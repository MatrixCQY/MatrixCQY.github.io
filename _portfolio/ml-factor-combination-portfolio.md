---
title: "Machine-Learning Factor Combination & Multi-Strategy Portfolio (Commodity Futures)"
excerpt: "56 commodities × 59 cross-sectional features. A 15-seed regularised LightGBM reaches hold-out Sharpe 0.92 before costs (NW-t 1.56; daily IC 0.016, not significant); LSTM / GRU ensembles do not beat it; seven low-correlation strategies combine into a portfolio with hold-out Sharpe 1.31 before costs (NW-t 2.36, max drawdown −16.1%) and 0.93 after a 1 bp fee. All figures use contract holding returns, after an audit removed phantom roll returns from an earlier version."
collection: portfolio
order: 5
redirect_from:
  - /portfolio/gbdt-factor-mining/
  - /portfolio/lstm-gru-timeseries-forecasting/
---

A factor-combination pipeline for Chinese commodity futures in three parts: a regularised tree ensemble, recurrent sequence models benchmarked against it on the same split, and a portfolio of seven low-correlation strategies. Each result has to be robust to random seeds and has to show how much of its in-sample performance is overfitting.

## 1. Data and Features

- **56 commodities × 59 features** (93,040 rows): 52 TA-Lib / academic factors plus 7 basis anchors.
- Each feature is winsorised, sector-neutralised and cross-sectionally standardised.
- **Returns** are the dominant contract's own day-to-day price changes, with zero on roll days. An earlier version used a roll-adjusted main-contract series that still contained roll gaps; see the audit on the [momentum & carry page](/portfolio/momentum-carry-factor-library/). The correction cut the LightGBM Sharpe from 1.32 to 0.92 and the portfolio from 2.47 to 1.31.
- **Label:** the cross-sectional rank of the 5-day forward return. Every model on this page, trees and recurrent networks alike, is therefore a **cross-sectional** ranker and is scored by daily cross-sectional IC and a market-neutral long–short book; the sequence models in Section 3 differ only in taking each contract's own 20-day history as input.
- **Split:** a single time cut at 2022-05-24. Training set 48,412 rows / 1,320 days; hold-out 44,628 rows / **952 days**.

## 2. LightGBM

Strongly regularised **shallow LightGBM trees**, trained with 15 random seeds and averaged. Each day the scores become a continuous z-weighted long–short book with a 10% volatility target; its 63-day warm-up is dropped before computing Sharpe.

**Costs:** none deducted unless a row says otherwise. Where a fee is shown, it is a one-way commission charged on every change in position, on the same trading days; slippage is never deducted.

| Metric | Value |
| :--- | :--- |
| Information Coefficient | **0.016** (NW-t 1.42, not significant); IC > 0 on 53.8% of days |
| Long–short Sharpe, 15-seed ensemble | **0.92** (NW-t 1.56) |
| Blended with the carry prior | 0.76 |
| Single-seed Sharpe (no volatility target) | all 15 positive, mean 0.75, std 0.12, range [0.56, 0.93] |

The single-seed figures are computed without the volatility target and on slightly different days, so they are for comparing seeds with each other, not for measuring the gain from averaging. Blending in the carry prior lowers the result, so the plain ensemble is the reported model.

**Overfitting.**

| Model | In-sample Sharpe | Hold-out Sharpe |
| :--- | :--- | :--- |
| Unregularised deep tree | 21.5 | −0.35 |
| Regularised shallow ensemble | 10.3 | **0.92** |

In-sample figures use 3 seeds and hold-out figures 15. Both models lose a lot between in-sample and hold-out, which is normal for trees. The deep tree loses money out of sample; only the regularised model keeps a positive hold-out result.

**Purge and costs.**

| Training set | IC (NW-t) | Sharpe, no costs | Sharpe, 1 bp fee |
| :--- | :--- | :--- | :--- |
| Original split | 0.0160 (1.42) | 0.92 | 0.66 |
| Purge the last 5 days before the split | 0.0149 (1.33) | 0.96 | 0.70 |
| Purge 5 days + 20-day embargo | 0.0156 (1.39) | 0.95 | 0.69 |

Removing the training labels that overlap the hold-out changes little. Costs matter more: the book turns over about half its gross exposure every day, so Sharpe falls to 0.66 at 1 bp and 0.40 at 2 bp, and break-even is about **3.6 bp** one-way. Lower turnover, not a better model, is what this signal needs before it could trade.

The top features by split count are `amihud`, `adx14`, `volofvol` and `ret252`, with `carry` in fifth place: liquidity, trend strength, volatility-of-volatility and long-horizon momentum rather than a single prior.

## 3. Sequence Models

Do recurrent models add signal beyond the trees?

**Inputs.** 20-day × 9-channel sequences of price, volatility, open-interest and basis information, with the same split date (2022-05-24).
- 67,104 sequences in total: 31,449 for training and 35,500 in the hold-out.
- After windowing, the hold-out signal covers **754 days × 54 commodities**. Two commodities drop out because their windows always contain gaps.

**Models.** LSTM (15-seed ensemble) and GRU (5-seed ensemble) in PyTorch. Training samples whose 5-day label reaches into the hold-out are purged. **Costs:** none deducted unless stated, neither commission nor slippage.

| Model | Hold-out Sharpe |
| :--- | :--- |
| LightGBM ensemble (952-day hold-out, with volatility target) | **0.92** |
| LSTM ensemble | **0.81** (NW-t 1.47) |
| GRU ensemble | 0.58 |

The LSTM and GRU figures are without the volatility target. The LSTM does **not** beat the tree model, and neither is significant at 5%. Single-seed LSTM Sharpe ranges from 0.37 to 1.25. Over 754 days the standard error of an annualised Sharpe is about 0.58 (Lo, 2002), so seed-to-seed differences of a few tenths are statistically indistinguishable.

Extending the purge to the 20-day input window (training samples must end 25 days before the split) gives an LSTM Sharpe of 0.85 (NW-t 1.55), so the shorter purge did not inflate the result. After a 1 bp fee the two versions give 0.66 and 0.71.

## 4. Multi-Strategy Portfolio

Seven economically distinct legs: LightGBM, carry, LSTM, negative skew, a cointegration basket, basis momentum and 5-day reversal. Six are cross-sectional long–short books (ranked across contracts, net exposure zero); the cointegration basket is a time-series spread trade. Each leg is volatility-targeted on its own, and the seven are then equal-weighted.

**Costs:** six legs deduct nothing (no commission, no slippage). The cointegration basket deducts a 2 bp commission per unit of position change, still with no slippage. Rebalancing from the leg- and portfolio-level volatility targets is not charged.

| Metric | Value |
| :--- | :--- |
| Hold-out Sharpe | **1.31** |
| Hold-out Sharpe, 1 bp / 2 bp fee on the six signal legs | 0.93 (NW-t 1.67) / 0.55 (NW-t 0.99) |
| Newey–West t | **2.36** |
| Deflated Sharpe Ratio | 0.65 (below 0.95) |
| Max drawdown | **−16.1%** |
| Annualised return | 13.6% over 988 trading days |
| Average pairwise correlation | 0.06 |
| Best single leg (negative skew) | 1.06 |

The portfolio clears NW-t 1.96 before costs but not the Deflated Sharpe Ratio, and not after a 1 bp fee.

**Allocation schemes.** Equal weight 1.31, inverse volatility 1.31, ERC risk parity 1.33, HRP 1.36 and minimum variance 1.29. The covariance matrix behind the four non-equal schemes is estimated on the hold-out itself, so these numbers are only a relative comparison; the equal-weight headline needs no estimate. The spread is small because the legs are already equal-volatility and nearly uncorrelated.

**Leave-one-out.** Dropping the cointegration basket costs the most (−0.30), then negative skew (−0.18). Dropping the LSTM (−0.02) or 5-day reversal (+0.02) barely matters. Removing legs by hold-out marginal value would be one more selection step, so all seven are kept.

**The cointegration leg is not evidence of cointegration.** Of 902 pair tests on the training period, 40 pass at 5% against 45.1 expected by chance, and none survives Bonferroni. The leg's hold-out Sharpe is 0.56; its value here is low correlation with the other legs, not a proven spread relationship.

**How much of the gain is diversification?** Take N legs with equal volatility, a common Sharpe s and average correlation ρ̄. Equal-weighting scales Sharpe by √(N / (1 + (N−1)ρ̄)). With N = 7 and ρ̄ = 0.06 the factor is ≈ **2.27**. Applied to the mean single-leg Sharpe of 0.57, that gives ≈ 1.29, close to the measured 1.31. The gain comes from the covariance structure, not from picking legs.

## 5. Scope

- **Costs.** Fees are modelled as a one-way commission of 1–2 bp on position changes. Slippage, market impact and the leverage changes made by the volatility targets are not charged, so even the net figures are optimistic.
- **One hold-out.** Purging the label overlap and adding an embargo leave the results almost unchanged (Sections 2 and 3), but a single time split is still one out-of-sample observation.
- **Start of the hold-out.** Four legs only have values in the hold-out, so for its first 63 days the portfolio volatility target is estimated from three legs and runs at higher leverage.
- **Selection.** The seven legs were chosen on the same data, from a larger set of signals tried. Section 4 shows how much of the 1.31 comes from low correlation, but the single-leg Sharpes it starts from were themselves selected, so 1.31 is an upper bound.
- **Survivorship.** The 56 commodities are those listed today.

## References

- Lo, A. W. (2002). The Statistics of Sharpe Ratios. *Financial Analysts Journal*, 58(4), 36–52.
- Koijen, R. S. J., Moskowitz, T. J., Pedersen, L. H., & Vrugt, E. B. (2018). Carry. *Journal of Financial Economics*, 127(2), 197–225.
