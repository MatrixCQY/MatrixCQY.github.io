---
title: "Commodity Futures Time-Series Momentum & Carry Factor Research"
excerpt: "A factor research and falsification pipeline on 26 Chinese commodity futures (2015–2026): momentum Sharpe 0.45, a carry proxy that failed falsification, and a basis-panel carry composite at Sharpe 1.09 / NW-t 3.34, just past a Bonferroni bar of 3.31."
collection: portfolio
---

A research pipeline for two classical factor families on Chinese commodity futures. It is built to **falsify** signals as much as to find them: every candidate goes through significance, multiple-testing and out-of-sample checks before a number is reported.

## 1. Data

- **26 continuous (main-contract) series**, daily, 2015-01 to 2026-06. The main contract is chosen by open interest and the series is **ratio back-adjusted** at each roll, removing the phantom roll returns that naive splicing creates.
- For carry, a separate **56-commodity main-contract basis panel**.

## 2. Signals

**Time-series momentum.** Direction is the average sign of 21 / 63 / 126 / 252-day returns. Position size is 15% divided by the 60-day realised volatility, capped at 2× leverage.

**Carry composite.** Three legs: basis level, term-structure slope, and 20-day basis change. Each leg is z-scored and the three are equal-weighted. The result is traded as a continuous-weight long–short book with a 10% portfolio volatility target.

## 3. Evaluation

IC / ICIR, Newey–West t-statistics, quantile monotonicity and half-life for every factor. On top of that: block bootstrap confidence intervals, walk-forward re-estimation, PBO, the Deflated Sharpe Ratio, and a Bonferroni threshold across all 54 candidate factors tested.

## 4. Results

| Test | Result |
| :--- | :--- |
| 26-contract momentum portfolio | Sharpe **0.45** (single-contract baseline 0.16) |
| Volatility targeting, 2×2 experiment | Sharpe 0.05 → **0.25**, paired t = **3.56**, block-bootstrap 95% CI [0.03, 0.39] |
| "Continuous-contract slope = carry" proxy | Quintile long–short Sharpe 0.735, but IC 0.0088 (t = 1.45) and correlation with the true roll yield **−0.10**, so the proxy is **rejected** |
| 54 candidate factors | None has an unadjusted \|t\| above 1.96; none survives Bonferroni |
| IC-weighted multi-factor composite | 1.18 with full-sample weights (look-ahead); **0.09** with rolling 60-day weights |
| Single-leg carry strategy | Sharpe 0.45, walk-forward 18 folds IS 0.576 → OOS 0.502 |
| **Basis-panel carry composite** | Sharpe **1.09**, NW-t **3.34** over 2,396 days (Bonferroni bar 3.31), max drawdown −23.6% |

## 5. Caveats

- The Sharpe of 1.09 is **gross of transaction costs**.
- The three carry legs were chosen **after** looking at the 54 candidates. The Bonferroni bar counts those 54 tests but not the extra freedom of that choice, so NW-t 3.34 clears the bar only nominally.
- The basis uses same-day data, which is mildly optimistic.
- The IC-weighted multi-factor composite shows how easily look-ahead inflates results: fixing the weights to a rolling window takes its Sharpe from 1.18 to 0.09.
