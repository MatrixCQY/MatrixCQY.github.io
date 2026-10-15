---
title: "Machine-Learning Factor Combination & Multi-Strategy Portfolio (Commodity Futures)"
excerpt: "56 commodities × 59 cross-sectional features. A 15-seed regularised LightGBM reaches hold-out IC 0.028 (NW-t 2.53) and long–short Sharpe 1.32; LSTM / GRU ensembles do not beat it; seven low-correlation strategies combine into a portfolio with hold-out Sharpe 2.47, NW-t 4.78 and max drawdown −9.1%."
collection: portfolio
order: 5
redirect_from:
  - /portfolio/gbdt-factor-mining/
  - /portfolio/lstm-gru-timeseries-forecasting/
---

A factor-combination pipeline for Chinese commodity futures in three parts: a regularised tree ensemble, recurrent sequence models benchmarked against it on the same split, and a portfolio of seven low-correlation strategies. Each result has to be robust to random seeds and has to show how much of its in-sample performance is overfitting.

## 1. Data and Features

- **56 commodities × 59 features** (93,246 rows): 52 TA-Lib / academic factors plus 7 basis anchors.
- Each feature is winsorised, sector-neutralised and cross-sectionally standardised.
- **Label:** the cross-sectional rank of the 5-day forward return.
- **Split:** a single time cut at 2022-05-24. Training set 48,493 rows / 1,320 days; hold-out 44,753 rows / **957 days**.

## 2. LightGBM

Strongly regularised **shallow LightGBM trees**, trained with 15 random seeds and averaged. Each day the scores become a continuous z-weighted long–short book with a 10% volatility target.

| Metric | Value |
| :--- | :--- |
| Information Coefficient | **0.028** (NW-t 2.53); IC > 0 on 56.9% of days |
| Long–short Sharpe, 15-seed ensemble | **1.32** |
| Blended with the carry prior | **1.34** |
| Single-seed Sharpe | all 15 positive, mean 1.13, std 0.11, range [0.88, 1.26] |

The ensemble's 1.32 sits above the single-seed mean of 1.13. This is the variance reduction expected from bagging, and it is also why the best single seed should never be the number reported.

**Overfitting.**

| Model | In-sample Sharpe | Hold-out Sharpe |
| :--- | :--- | :--- |
| Unregularised deep tree | 21.7 | 0.58 |
| Regularised shallow ensemble | 9.9 | **1.32** |

Both models lose a lot between in-sample and hold-out, which is normal for trees. Only the regularised model keeps a usable hold-out result, so regularisation here is necessary rather than optional.

The top features by split count are `amihud`, `ret252`, `volofvol` and `adx14`, with `carry` in fifth place. The model mixes liquidity, long-horizon momentum, volatility-of-volatility and trend strength instead of leaning on a single prior.

## 3. Sequence Models

Do recurrent models add signal beyond the trees?

**Inputs.** 20-day × 9-factor sequences. The 9 channels come from the LightGBM feature set, and the split date is the same (2022-05-24).
- 67,248 sequences in total: 31,455 for training and 35,638 in the hold-out.
- After windowing, the hold-out signal covers **759 days × 54 commodities**. Two commodities drop out because their windows always contain gaps.

**Models.** LSTM and GRU in PyTorch, each as a 15-seed ensemble.

| Model | Hold-out Sharpe |
| :--- | :--- |
| LightGBM ensemble (957-day hold-out) | **1.32** |
| LSTM ensemble | **1.08** (NW-t 1.89) |
| GRU ensemble | 0.84 |

The LSTM does **not** beat the tree model, and its NW-t of 1.89 is not significant at 5%. Single-seed Sharpe ranges from 0.36 to 1.50. Over 759 days the standard error of an annualised Sharpe is about 0.58 (Lo, 2002), so seed-to-seed differences of a few tenths are statistically indistinguishable.

## 4. Multi-Strategy Portfolio

Seven economically distinct legs: LightGBM, carry, LSTM, negative skew, a cointegration basket, basis momentum and 5-day reversal. Each leg is volatility-targeted on its own, and the seven are then equal-weighted.

| Metric | Value |
| :--- | :--- |
| Hold-out Sharpe | **2.47** |
| Newey–West t | **4.78** |
| Max drawdown | **−9.1%** |
| Annualised return | 25.7% over 988 trading days |
| Average pairwise correlation | 0.07 |
| Best single leg (cointegration basket) | 1.42 |

Five allocation schemes give hold-out Sharpe between 2.37 and 2.51: equal weight 2.47, inverse volatility 2.40, ERC risk parity 2.51, HRP 2.37 and minimum variance 2.45. The reported figure uses equal weights.

**How much of the gain is diversification?** Take N legs with equal volatility, a common Sharpe s and average correlation ρ̄. Equal-weighting scales Sharpe by √(N / (1 + (N−1)ρ̄)). With N = 7 and ρ̄ = 0.07 the factor is ≈ **2.22**. Applied to the mean single-leg Sharpe of 1.05, that gives ≈ 2.3, the same order as the measured 2.47. The gain comes from the covariance structure, not from picking legs.

## 5. Caveats

- **Leakage at the split.** Neither split has a purge or embargo. The 5-day labels just before 2022-05-24 overlap the LightGBM hold-out; for the sequence models, the 20-day input window plus the 5-day label horizon make training and hold-out overlap by 25 trading days.
- **Overlapping labels.** Consecutive 5-day labels overlap, which inflates naive t-statistics by roughly √5.
- **Costs and hold-outs.** Results are gross of costs and come from one hold-out period only.
- **The LSTM leg has negative marginal value.** Dropping it raises the portfolio Sharpe from 2.47 to 2.54.
- **Selection bias.** The seven legs were chosen on the same data, and more signals were tried than the seven that remain.
- **The Deflated Sharpe Ratio of 1.00 is not credible.** The trial count fed to it (40) is an assumption, and the implementation understates cross-trial dispersion. Both push the DSR upward.
- **Validation loss.** The sequence models' training loss curve uses a randomly permuted validation set. It only tracks convergence and is never used to select models or report out-of-sample results.
- **Next steps.** In order: Purged K-Fold / Combinatorial Purged CV, a cost model, then a Deflated Sharpe Ratio over the configurations searched.
