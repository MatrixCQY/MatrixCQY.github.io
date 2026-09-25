---
title: "Machine-Learning Factor Combination with LightGBM"
excerpt: "56 commodities × 59 cross-sectional features, a 15-seed regularised LightGBM ensemble, and a 957-day hold-out: IC 0.028 (NW-t 2.53), long–short Sharpe 1.32, all 15 seeds positive."
collection: portfolio
---

A non-linear factor-combination pipeline for Chinese commodity futures. The output has to be robust to random seeds and has to show how much of its in-sample performance is overfitting.

## 1. Data and Features

- **56 commodities × 59 features** (93,246 rows): 52 TA-Lib / academic factors plus 7 basis anchors.
- Each feature is winsorised, sector-neutralised and cross-sectionally standardised.
- **Label:** the cross-sectional rank of the 5-day forward return.
- **Split:** a single time cut at 2022-05-24. Training set 48,493 rows / 1,320 days; hold-out 44,753 rows / **957 days**.

## 2. Model

Strongly regularised **shallow LightGBM trees**, trained with 15 random seeds and averaged. Each day the scores become a continuous z-weighted long–short book with a 10% volatility target.

## 3. Hold-out Results

| Metric | Value |
| :--- | :--- |
| Information Coefficient | **0.028** (NW-t 2.53); IC > 0 on 56.9% of days |
| Long–short Sharpe, 15-seed ensemble | **1.32** |
| Blended with the carry prior | **1.34** |
| Single-seed Sharpe | all 15 positive, mean 1.13, std 0.11, range [0.88, 1.26] |

The ensemble's 1.32 sits above the single-seed mean of 1.13. This is the variance reduction expected from bagging, and it is also why the best single seed should never be the number reported.

## 4. Overfitting

| Model | In-sample Sharpe | Hold-out Sharpe |
| :--- | :--- | :--- |
| Unregularised deep tree | 21.7 | 0.58 |
| Regularised shallow ensemble | 9.9 | **1.32** |

Both models lose a lot between in-sample and hold-out, which is normal for trees. Only the regularised model keeps a usable hold-out result, so regularisation here is necessary rather than optional.

The top features by split count are `amihud`, `ret252`, `volofvol` and `adx14`, with `carry` in fifth place. The model mixes liquidity, long-horizon momentum, volatility-of-volatility and trend strength instead of leaning on a single prior.

## 5. Caveats

- **Label leakage at the split.** The time cut has no purge or embargo, so 5-day labels just before 2022-05-24 overlap the hold-out.
- **Overlapping labels.** Consecutive 5-day labels overlap, which inflates naive t-statistics by roughly √5.
- **Costs and hold-outs.** Results are gross of costs and come from one hold-out period only.
- **Next steps.** In order: Purged K-Fold / Combinatorial Purged CV, a cost model, then a Deflated Sharpe Ratio over the configurations searched.

The same features feed the [sequence models and multi-strategy portfolio](/portfolio/lstm-gru-timeseries-forecasting/).
