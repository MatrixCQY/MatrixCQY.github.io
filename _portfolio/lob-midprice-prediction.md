---
title: "High-Frequency Mid-Price Forecasting on an 8-Level Limit Order Book"
excerpt: "23.5 million order-book snapshots of a single instrument; the target is the mid-price change 55 events ahead. Six models are trained on a purged 64/16/20 split, with combination weights fitted on validation only. Test IC is 0.166–0.217 (combination 0.224) and R² is 2.4–4.8%. Hand-crafted microstructure features clearly beat the raw book."
collection: portfolio
order: 2
---

The data are snapshots of an 8-level limit order book (LOB) for one instrument: 23.5 million events, with row order as the only clock. The task is to forecast the mid-price change 55 events ahead with sequence models (GRU, MLP-Mixer) and tabular models (XGBoost, Lasso), then combine them.

This is a personal project. It started from a reference implementation of this pipeline. My work was the audit, which found that its reported test results were in-sample, plus the fixes, a memory- and GPU-efficient full-scale pipeline, and the evaluation below.

## 1. Data and Label

- **23,532,026 snapshots × 48 columns**: for each of 8 levels, the ask and bid price, size and order count. No timestamps; row order is time. Tick size is 0.5 and the median spread is 1.5, i.e. three ticks.
- **The label was undocumented, so I recovered it.** y correlates with the future mid-price change mid<sub>t+h</sub> − mid<sub>t</sub> at every horizon h. The correlation peaks at exactly 1.000 at h = 55, where the two are identical point by point. So y = mid<sub>t+55</sub> − mid<sub>t</sub>, a price change in price units.

![Correlation of y with the h-event mid-price change](/images/portfolio/lob/lob_label_horizon.png)

- **Split by row: 64% train / 16% validation / 20% test.** The last 55 rows of the train and validation segments are dropped (purged), because adjacent labels overlap by up to 54 events. Clipping bounds (0.5% / 99.5%) and the robust scaler are fitted on the training segment only.

## 2. Features and Models

**16 hand-crafted features**, all causal (they use data up to t only):

| Family | Features |
| :--- | :--- |
| Mid-price momentum | change over 30 / 60 / 120 events |
| Spread | best ask − best bid |
| Order-book imbalance | level-1 size, level-1 order count, all-level size, price-weighted all-level size (bid-positive) |
| Order-flow imbalance | level-1 and all-level OFI (Cont, Kukanov & Stoikov, 2014), plus their 60-event rolling sums |
| Aggressive flow | volume taken at the best ask on up-ticks and at the best bid on down-ticks (60-event sums), and their imbalance |
| Cancellation proxy | deep (levels 5–8) vs. near (1–4) depth ratio, bid minus ask |

**Models.** Six in total:

- GRU (window 60, 2 layers, hidden 64) and a simplified MLP-Mixer (window 10, 4 layers, hidden 64; after Tolstikhin et al., 2021), each trained twice: once on the 48 raw book columns and once on the 16 features.
- XGBoost (60 trees, depth 6) and Lasso (α = 10⁻⁵) on the features.

The networks use MSE loss, AdamW and batch 512, with early stopping on validation loss (patience 5, at most 30 epochs). The **combination** is an OLS regression of y on the six model scores, fitted on the validation segment and evaluated on the test segment.

**Full-scale engineering.** The first full run failed trying to allocate 8.4 GB. Reading in float32 and computing features in 2-million-row chunks fixed it: the chunks overlap by 256 rows and the output is bit-identical to the one-pass version. Peak memory is now 12.9 GB for the feature pipeline and 17.8 GB for the raw book. A loader that keeps the whole table in GPU memory and slices windows by index arithmetic raised throughput from 45,000 to **130,000 samples per second**; the rest of the time is the GRU itself. The full run takes about two hours on a laptop GPU.

**Leakage assertions** in the test suite:
- A1: labels start after the window and segments do not overlap after the purge.
- A2: features use only rows up to t, and each prediction is indexed to its window's last row.
- A3: shuffling a batch permutes the outputs identically.
- A4: clipping and scaling are fitted on train only.
- A5: a fixed seed reproduces the run.
- A6: the stored best weights are a deep copy.
- A7: validation loss moves during training.
- A8: the label is a mid-price change, not a level.

## 3. What the Audit Found in the Reference Implementation

| Finding | Evidence | Fix |
| :--- | :--- | :--- |
| **Validation set = test set.** Early stopping and combination weights were both selected on the test segment. | The test file is the last 20% of the training file, matched value for value, and the training script uses it for both roles. | Purged three-way split. |
| **Combination weights fitted on the test set.** The hard-coded weights were also mis-copied, with two model names swapped. | Reported combined R² 0.0345 vs. **0.0346** when refitted on the test set itself, i.e. the reported figure is in-sample. Hard-coded weights give 0.0324. | Fit on validation, evaluate on test. |
| **Scaler re-fitted on test data** at prediction time. | The fitted centre shifts by up to 3.0 on one feature. | Prediction only calls `transform`. |
| **"Best" weights stored by reference.** `state_dict()` shares storage with the live parameters, so the saved model is the last epoch. | Reproduced with three SGD steps. | Deep copy; asserted in A6. |
| **Prediction script reads the row-number column as data.** | 49 columns into a 48-input GRU (crash); the feature function silently shifts every column by one. | Columns validated by name on load. |
| **19 features with rank 17.** One imbalance feature has the opposite sign to the literature convention, and the spread is missing. | Two columns are identical point by point. Corr(imbalance, y) = −0.098 where buy pressure should be positive. | Rewritten 16-feature set, bid-positive, OFI aligned to best-price changes. |
| **Clipping quantiles taken from the full sample**, including the test period. The models were also evaluated on three differently clipped versions of y. | Full-sample bounds [−3.75, 4.0] vs. training-only [−2.5, 2.5]. | Train-only bounds; one label for all six models. |

## 4. Results

Test segment: 4.7 million samples. Significance comes from the slope t-statistic in y = a + b·score, with Newey–West HAC standard errors at 55 lags (labels overlap by 54 events, so naive t-statistics are badly inflated). The six single-model p-values are Holm-corrected.

| Model | Best epoch | Test IC | Test R² | HAC t |
| :--- | ---: | ---: | ---: | ---: |
| GRU · raw book | 1 | 0.166 | 2.44% | 89 |
| MLP-Mixer · raw book | 4 | 0.172 | 2.59% | 98 |
| Lasso · features | — | 0.171 | 2.36% | 95 |
| XGBoost · features | — | 0.181 | 3.17% | 97 |
| GRU · features | 16 | **0.217** | **4.51%** | 111 |
| MLP-Mixer · features | 26 | 0.216 | 4.38% | 115 |
| Equal-weight combination | — | 0.219 | 3.80% | 119 |
| **Validation-fit combination** | — | **0.224** | **4.84%** | 118 |

![Test IC and R² by model](/images/portfolio/lob/lob_test_ic_r2.png)

- **Features beat the raw book.** The same networks gain about 0.05 IC and nearly double their R² when fed the 16 features instead of the 48 raw columns. The raw-book networks peak at epochs 1 and 4; the feature networks keep improving to epochs 16 and 26.
- **The combination adds R², not IC.** Its IC is only 0.007 above the best single model, but R² rises from 4.51% to 4.84%. The equal-weight average has a similar IC but only 3.80% R².
- **Why the gap between IC and R².** For a forecast of the form a + b·s, the best achievable R² is IC², reached when the scale b is right. The validation-fit combination gets 4.84% against IC² = 5.01%, so its scale is nearly optimal. The equal-weight average gets 3.80% against 4.79%: averaging raw scores loses scale, while regression weights fix it. The same bound explains why the R² values look small: with IC around 0.2, R² cannot exceed about 5%. A low R² is a property of the metric here, not evidence of a weak forecast.
- **Validation loss above training loss is not overfitting here.** The MSE of a constant-zero forecast is E[y²], and E[y²] is 1.24 / 1.98 / 5.88 on the three segments: the later part of the sample is far more volatile. Overfitting shows up as validation loss rising with epochs, not as one curve sitting above the other.

![Rolling mean of y squared across the sample](/images/portfolio/lob/lob_label_variance.png)

## 5. Limitations

- **No trading-cost model.** The median spread is three ticks. Whether a 55-event forecast with this R² survives crossing the spread has not been tested, so the result above is a forecasting result, not a trading result.
- **Stability across regimes.** The test segment is almost five times as volatile as the training segment. One split cannot say whether the R² holds in other regimes, and rolling-origin evaluation is the next step.
- **One seed per network.** The K-line project measured seed dispersion; this one does not yet.
- **The combination is a further selection step** over six models. A strict comparison would correct for it, e.g. with Hansen's SPA test.
- One instrument, no timestamps, so time-of-day effects cannot be separated from event-time effects.

## 6. Interface

Module layout (signatures only):

```
qlab/ml/lob_midprice_forecast/
├── features.py   generate_features_vectorized, generate_features_chunked, future_mid_diff, QuantileClipper
├── dataset.py    load_lob_csv, split_book, purged_split, prepare_segments, SlidingDataset, GpuWindowLoader
├── models.py     GRUModel, MLPMixer
├── train.py      LobNNConfig, main_train, model_train_xgb, model_train_lasso
├── predict.py    predict_nn, predict_tree, score_ic_r2
└── combine.py    align_results, fit_combination, apply_combination, evaluate_combination
```

```python
generate_features_chunked(raw, chunk_rows=2_000_000, overlap=256, add_spread=True,
                          out_dtype=np.float32) -> pd.DataFrame          # bit-identical to one pass
future_mid_diff(ask_price_arry, bid_price_arry, windows, ret=False)     # mid[t+h] - mid[t]
purged_split(n, test_frac=0.2, val_frac=0.2, purge=55) -> LobSplit
prepare_segments(raw, source="features", split=None, clip_p=0.005, add_spread=True,
                 chunk_rows=None, dtype=float) -> LobSegments           # clip + scale fitted on train
GpuWindowLoader(df, seq_len, batch_size=512, shuffle=False, device=None, seed=0)
GRUModel(input_dim=21, hidden_dim=128, num_layers=2)
MLPMixer(input_dim=21, seq_len=60, hidden_dim=64, num_layers=4)
main_train(cfg: LobNNConfig, train_data, val_data, ..., device=None, num_epochs=None,
           gpu=False, seed=0) -> tuple                                  # (model, TrainResult)
evaluate_combination(val_results: dict, test_results: dict) -> tuple    # (table, CombinationFit)
```

*Code available on request. The order-book data are not redistributed.*
