---
title: "Candlestick-Image CNN for A-Share Stock Selection"
excerpt: "A convolutional network reads 20-day price charts rendered as 60 × 60 images. Over a 312-day test period on 4,303 A-shares, a 5-seed ensemble reaches RankIC 0.078 (NW-t 10.1) and absorbs the 5-day reversal signal. After costs the margin is thin: break-even is about 22 bp one-way, and at 15 bp the long-only excess is no longer significant."
collection: portfolio
order: 1
---

Each sample is a stock's last 20 trading days of open / high / low / close, drawn as a 60 × 60 image. A small CNN reads the image and predicts the stock's cross-sectional rank over the next five days. The question is whether a picture of the price path holds information that the standard hand-crafted price factor, 5-day reversal, does not. The approach adapts Jiang, Kelly & Xiu (2023): they classify the sign of the future return with a cross-entropy loss, while this network regresses the cross-sectional rank with MSE.

This is a personal project. It started from a reference implementation of the image-CNN idea. My work was the audit of that implementation, the fixes, a GPU rendering pipeline, the full-scale training runs and the robustness tests below.

## 1. Data

- **4,303 A-shares**, daily adjusted OHLC, 2017-01 to 2022-05 (4.5 million stock-days). The universe is the main boards plus ChiNext (no STAR Market or Beijing exchange); 253 names stop trading before the end of the sample, so delisted stocks are not filtered out.
- **Label.** Buy at the open of day t+1, sell at the open of day t+6: R<sub>t</sub> = O<sub>t+6</sub> / O<sub>t+1</sub> − 1. Each day the label is converted to its cross-sectional percentile minus 0.5. This bounds the target, removes the market's daily move, and stops a handful of extreme returns from dominating the MSE loss.
- **Split by window end date**, with a 6-day purge (the label span) and a 20-day gap (the image span) at each boundary:

| Segment | Window end dates | Windows | Trading days |
| :--- | :--- | ---: | ---: |
| Train | 2017-03-01 → 2019-12-23 | 2,205,282 | 689 |
| Validation | 2020-02-07 → 2020-12-23 | 760,760 | 217 |
| Test | 2021-02-01 → 2022-05-20 | 1,196,855 | 312 |

## 2. Method

**Rendering.** Each day takes three pixel columns. The open–close body fills all three, and the high–low shadow sits in the middle column. Prices are scaled to the window's own high and low, so no information from other windows or other stocks enters the image. The fractional part of each scaled price sets the brightness of the edge pixel (anti-aliasing), so sub-row information is kept. Up days are drawn in the red channel, down days in the green channel and doji in both. The blue channel carries nothing extra and is dropped, so the network input is 2 × 60 × 60. Volume is not drawn in the training images.

![A 20-day window and the image the network sees](/images/portfolio/kchart-cnn/kchart_example.png)

**Network.** Four convolution blocks (5 × 5 convolution, batch norm, LeakyReLU 0.1) with 8 → 16 → 32 → 64 channels, pooling 60 → 20 → 10 → 5 → 2, then dropout, a 256 → 16 → 1 head and 71,969 parameters in total. MSE loss, Adam with L2 weight decay 10⁻³, batch 256. Early stopping uses patience 10, and the best validation epoch is restored.

**Rendering on the GPU.** The reference renderer draws one image at a time in NumPy (0.12 ms per image). I rewrote it as a batched PyTorch kernel that draws each batch directly in GPU memory: about **278,000 images per second**. Drawing time per epoch fell from 4 minutes to 8 seconds. The batched kernel is pixel-identical to the reference renderer on 20,900 test images (CPU and GPU, with and without volume). One full training run takes about 45 minutes on a laptop GPU.

**Leakage assertions.** The pipeline runs eight point-in-time checks in its test suite:

| | Assertion |
| :--- | :--- |
| A1 | Perturbing prices up to day t leaves y<sub>t</sub> unchanged; perturbing rows after t leaves image x<sub>t</sub> unchanged. |
| A2 | Perturbing data after a date leaves every prediction up to that date unchanged. |
| A3 | Changing only the last day of a window changes only the rightmost three pixel columns. Shuffling a batch in eval mode and un-shuffling the output changes nothing (< 10⁻⁶). |
| A4 | No cross-period preprocessing: images are normalised within their own window, and labels are ranked within their own day. |
| A5 – A7 | Fixed seed reproduces weights exactly (checked on CPU; cuDNN on the GPU is not bit-for-bit deterministic); the checkpoint stores config and split parameters; validation loss moves during training. |
| A8 | The label is a return, not a price level, and the purge and gap are applied. |

## 3. What the Audit Found in the Reference Implementation

| Finding | Evidence | Fix |
| :--- | :--- | :--- |
| The label is not the label the design specifies. Code: 8-day close-to-close raw return. Design: 5-day open-to-open cross-sectional rank. | Pointwise agreement **0.16%**, correlation 0.66 (300 stocks × 2020). Raw returns reach +438% and dominate the MSE. | Label function parametrised, rank-centred, and unit-tested against a hand-computed case. |
| The supplied checkpoint had learned nothing usable. | Validation MSE 0.007942 vs. 0.007933 for a constant-zero forecast (R² −0.1%). Out-of-sample RankIC −0.011 (NW-t −0.61) over 44 days. | Retrained under the corrected pipeline. |
| Prediction reads only data inside the requested date range. | A one-month prediction file covers only its last **3** trading days; the first 20 are consumed building the first window. | Build windows on the full history, then filter by window end date. |
| No purge at the train / validation boundary. | **47.7%** of training labels end on or after the split date. | Split by window end date with purge and gap; asserted in A1 / A8. |
| Training batches are not shuffled. | The first batch of 256 images holds only 13 stocks and 21 dates. | Shuffle every epoch with a fixed seed. |
| The image cache is keyed only by date range. | Changing the horizon or lookback silently reuses stale images and stale labels. | Images are rendered on the fly; there is no disk cache. |
| Renderer: canvas height and width swapped; doji clamped to the wrong row in volume charts. | Both are masked at the 20-day, no-volume setting; reproduced with a synthetic doji. | Fixed. Neither fix changes a single pixel in the training configuration. |

## 4. Results

The single-seed run stopped at epoch 13; the best validation epoch was 5.

| Signal | Test RankIC (312 days) | NW-t (5 lags) |
| :--- | ---: | ---: |
| CNN, single seed (seed 42, first GPU run) | **0.078** | **10.9** |
| 5-day reversal | 0.022 | 2.0 |

Both clear a Holm correction at 5%; the reversal only just clears it, and only at 5 lags (its NW-t is 1.9 at 10 or 20 lags, while the CNN's stays above 10). An occlusion test asked which days the network uses: blacking out each day's three columns in turn, the five most sensitive days are exactly the last five, in order of recency. The network reads mainly the most recent week, the same span as 5-day reversal, yet its IC is 3.6 times higher. Whether the extra information comes from intraday shape (shadows, body position) needs an ablation that has not been run yet.

## 5. Robustness

A single seed and a single training run say little on their own, so three checks were added.

![RankIC by seed, ensemble and reversal](/images/portfolio/kchart-cnn/kchart_ic.png)

**Seeds.** Five independent trainings (seeds 1, 2, 3, 4, 42). Best validation epochs fall between 4 and 9. Single-seed RankIC is 0.069–0.076 (mean 0.0725, standard deviation 0.0027), and every seed has NW-t above 9. Seed 42 enters here as a GPU re-run (0.076); the 0.078 in Section 4 is the best of the six runs, and 0.0725 is the representative single-model figure. The ensemble averages the five daily cross-sectional ranks: RankIC **0.078**, NW-t **10.1**, positive on 85.9% of days. It beats the best single seed because seed-specific errors partly cancel.

**Paired test against reversal.** On the same 312 days, the daily IC difference (ensemble minus reversal) averages **0.056** with NW-t **4.3**, and the CNN wins on 71% of days.

**Is the CNN just reversal in disguise?** Partial rank IC: each day, regress one signal's ranks on the other's, then correlate the residual with the label.

| | Partial RankIC | NW-t |
| :--- | ---: | ---: |
| CNN, controlling for reversal | **0.075** | **9.7** |
| Reversal, controlling for the CNN | 0.013 | 1.2 |

Controlling for reversal barely moves the CNN. Controlling for the CNN leaves reversal insignificant. Whatever is useful in reversal, the CNN already contains.

## 6. Costs and Limitations

**Portfolio.** Five overlapping books with a 5-day hold: each day one fifth of capital enters at the next open. Names that are limit-locked or suspended the next day are excluded. The implementable version is **long top 10% minus the equal-weight market**, hedgeable with index futures. Long top 10% minus short bottom 10% is reported for reference only, because single-name shorting in A-shares is restricted. Realistic one-way cost for 2021–22 is roughly 10–20 bp: about 2.5 bp commission, 10 bp stamp duty on sales, and 5–10 bp of impact and slippage. 15 bp is the baseline.

![NAV at 0 and 15 bp, and net Sharpe against cost](/images/portfolio/kchart-cnn/kchart_costs.png)

Long top 10% minus the equal-weight market, CNN ensemble, daily turnover 26.7% (buys plus sells; 13.4% each way). Cost is the one-way rate times this turnover:

| One-way cost | Annualised excess | Volatility | Sharpe | NW-t | Max drawdown |
| :--- | ---: | ---: | ---: | ---: | ---: |
| 0 bp | 14.7% | 4.6% | 3.23 | 3.53 | −2.2% |
| 10 bp | 8.0% | 4.6% | 1.76 | 1.92 | −3.0% |
| **15 bp** | **4.6%** | 4.6% | **1.02** | **1.11** | −4.3% |
| 20 bp | 1.3% | 4.6% | 0.28 | 0.31 | −5.5% |

- **Break-even cost ≈ 22 bp one-way.** At the 15 bp baseline, the excess return is **not significant** (NW-t 1.1).
- The five seeds' net Sharpe at 15 bp ranges from 0.24 to 1.46. The **Deflated Sharpe Ratio** (Bailey & López de Prado, 2014) uses the variance of these five Sharpes as the luck threshold, as in the original paper. The result is **0.70**, below the 0.95 bar. Counting only the five seeds as trials understates the search, so the true figure is lower still.
- Long–short (not implementable): break-even about 43 bp; at 15 bp, Sharpe 2.57 with NW-t 3.0. Most of that return comes from the short leg.
- For comparison, 5-day reversal loses money in the long-excess form even before costs (−6.3% annualised). Its long–short version breaks even at 13 bp.

**Reading.** Statistically the signal is real: IC is stable, seeds agree, and reversal does not explain it. Under long-only-plus-hedge constraints, though, turnover eats most of the excess. The lever is turnover, not a bigger model: longer holding periods or weekly rebalancing, a sell buffer (exit only below the top 20%), a liquidity filter, or cost-aware portfolio optimisation.

**Not yet done.**
- Capacity and market impact: the top decile is about 400 names, and it needs an assessment against traded value.
- Hedge basis: an equal-weight market is not a tradeable index, and a CSI 1000 futures hedge would add tracking error.
- The test period is one 16-month window.
- Exits are not checked for limit-down or suspension; such days are booked at a zero return. They are under 0.1% of the long book.
- The occlusion result is suggestive, not an ablation.
- The optimiser is Adam with coupled L2, as in the reference implementation. Switching to AdamW would require re-tuning the decay, so it was left unchanged and all numbers above use this setting.

## 7. Interface

Module layout (signatures only):

```
qlab/ml/kline_image_cnn/
├── data.py        forward_return, cross_section_rank, make_label, split_samples
├── plot.py        kchart_array              reference renderer (NumPy)
├── plot_torch.py  kchart_batch              batched renderer (PyTorch, CPU / GPU)
├── dataset.py     build_windows, KChartWindowDataset, KChartGpuBatches
├── model.py       DeepCNN
├── train.py       KChartConfig, train_kchart
├── predict.py     load_deepcnn, predict_kchart
└── evaluate.py    paired_ic_test, partial_rank_ic, tradable_mask, target_weights,
                   overlapping_portfolio, cost_table, dsr_from_trials
```

```python
kchart_array(window, seq_len=20, show_amt=False) -> np.ndarray            # uint8 (60, 3*seq_len, 3)
kchart_batch(values: Tensor, seq_len=20, show_amt=False) -> Tensor        # pixel-identical, batched
KChartGpuBatches(windows, batch_size=256, shuffle=False, device="cuda", seed=0, ...)
make_label(panel, horizon=5, delay=1, price="open", rank=True) -> pd.Series
split_samples(dates, train_end, val_end=None, *, horizon=5, delay=1, seq_len=20,
              purge=None, gap=None) -> TimeSplit
train_kchart(panel, train_end, val_end=None, cfg=None, *, start=None, end=None, ...) -> KChartTrainResult
paired_ic_test(ic_a, ic_b, lags=5) -> dict
partial_rank_ic(df, signal, control, label) -> pd.Series
overlapping_portfolio(weights, open_ret, holding=5) -> pd.DataFrame
cost_table(port, costs_bp=(0, 5, 10, 15, 20, 30, 40), freq=252, lags=5) -> pd.DataFrame
                                                                          # attrs: break-even bp, turnover
dsr_from_trials(pnl, trial_sharpes, freq=252) -> dict
```

## References

- Jiang, J., Kelly, B., & Xiu, D. (2023). (Re-)Imag(in)ing Price Trends. *The Journal of Finance*, 78(6), 3193–3249.
- Bailey, D. H., & López de Prado, M. (2014). The Deflated Sharpe Ratio: Correcting for Selection Bias, Backtest Overfitting, and Non-Normality. *The Journal of Portfolio Management*, 40(5), 94–107.

*Code available on request. The underlying market data are not redistributed.*
