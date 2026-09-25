---
title: "Deep Sequence Models & Multi-Strategy Portfolio"
excerpt: "LSTM / GRU ensembles on 20-day × 9-factor sequences, benchmarked against LightGBM, then seven low-correlation strategies combined into a portfolio with hold-out Sharpe 2.47, NW-t 4.78 and max drawdown −9.1%."
collection: portfolio
---

This project has two parts. Part one asks whether recurrent models add signal beyond the [LightGBM pipeline](/portfolio/gbdt-factor-mining/). Part two combines seven low-correlation strategies and measures how much of the portfolio gain is explained by diversification alone.

## 1. Sequence Models

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

## 2. Multi-Strategy Portfolio

Seven economically distinct legs: LightGBM, carry, LSTM, negative skew, a cointegration basket, basis momentum and 5-day reversal. Each leg is volatility-targeted on its own, and the seven are then equal-weighted.

| Metric | Value |
| :--- | :--- |
| Hold-out Sharpe | **2.47** |
| Newey–West t | **4.78** |
| Max drawdown | **−9.1%** |
| Annualised return | 25.7% over 988 trading days |
| Average pairwise correlation | 0.07 |
| Best single leg (cointegration basket) | 1.42 |

Equal-weight, ERC and HRP allocations differ by less than 0.1 in Sharpe, so the reported figure uses equal weights.

**How much of the gain is diversification?** Take N legs with equal volatility, a common Sharpe s and average correlation ρ̄. Equal-weighting scales Sharpe by √(N / (1 + (N−1)ρ̄)). With N = 7 and ρ̄ = 0.07 the factor is ≈ **2.22**. Applied to the mean single-leg Sharpe of 1.05, that gives ≈ 2.3, the same order as the measured 2.47. The gain comes from the covariance structure, not from picking legs.

## 3. Caveats

- **The LSTM leg has negative marginal value.** Dropping it raises the portfolio Sharpe from 2.47 to 2.54.
- **Selection bias.** The seven legs were chosen on the same data, and more signals were tried than the seven that remain.
- **The Deflated Sharpe Ratio of 1.00 is not credible.** The trial count fed to it (40) is an assumption, and the implementation understates cross-trial dispersion. Both push the DSR upward.
- **Leakage at the split.** The sequence split has no purge or embargo. Near 2022-05-24 the 20-day input window plus the 5-day label horizon make training and hold-out overlap by 25 trading days.
- **Validation loss.** The training loss curve uses a randomly permuted validation set. It only tracks convergence and is never used to select models or report out-of-sample results.
