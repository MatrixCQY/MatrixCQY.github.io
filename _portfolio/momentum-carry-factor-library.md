---
title: "Commodity Futures Time-Series Momentum & Carry Factor Research"
excerpt: "A factor research and falsification pipeline on 26 Chinese commodity futures (2015–2026): momentum Sharpe 0.45, a carry proxy that failed falsification, and a basis-panel carry composite at Sharpe 1.09 / NW-t 3.34 before costs, just past a Bonferroni bar of 3.31."
collection: portfolio
order: 4
---

A research pipeline for two classical factor families on Chinese commodity futures. It is built to **falsify** signals as much as to find them: every candidate goes through significance, multiple-testing and out-of-sample checks before a number is reported.

## 1. Data

- **26 continuous (main-contract) series**, daily, 2015-01 to 2026-06, with the main contract chosen by open interest. The momentum tests and the carry-proxy test use the series as spliced. The 54-factor scan and the single-leg carry walk-forward use a **roll-adjusted** version: returns on roll days (open interest changes by more than 50%) and on suspected data errors (absolute daily return above 15%) are set to zero before compounding, removing the phantom roll returns that naive splicing creates.
- For carry, a separate **56-commodity main-contract basis panel**, roll-adjusted the same way.

## 2. Signals

**Time-series momentum.** Direction is the average sign of 21 / 63 / 126 / 252-day returns. Position size is 15% divided by the 60-day realised volatility, capped at 2× leverage.

**Carry composite.** Three legs: basis level, term-structure slope, and 20-day basis change. Each leg is z-scored and the three are equal-weighted. The result is traded as a continuous-weight long–short book with a 10% portfolio volatility target.

## 3. Evaluation

IC / ICIR, Newey–West t-statistics, quantile monotonicity and half-life for every factor. On top of that: block bootstrap confidence intervals, walk-forward re-estimation, PBO, the Deflated Sharpe Ratio, and a Bonferroni threshold across all 54 candidate factors tested.

## 4. Results

**Costs.** No figure on this page deducts slippage or market impact. In the last column, "1 bp fee" means a 1 bp one-way commission charged on every change in position, and "none" means neither commission nor slippage is deducted.

| Test | Result | Costs deducted |
| :--- | :--- | :--- |
| 26-contract momentum portfolio | Sharpe **0.45** (single-contract baseline 0.16) | 1 bp fee |
| Volatility targeting, 2×2 experiment | Sharpe 0.05 → **0.25**, paired t = **3.56**, block-bootstrap 95% CI [0.03, 0.39] | 1 bp fee |
| "Continuous-contract slope = carry" proxy | Quintile long–short Sharpe 0.735, but IC 0.0088 (t = 1.45) and correlation with the true roll yield **−0.10**, so the proxy is **rejected** | 1 bp fee (Sharpe); IC and correlation involve no costs |
| 54 candidate factors | None has an unadjusted \|t\| above 1.96; none survives Bonferroni | 1 bp fee |
| IC-weighted multi-factor composite | 1.18 with full-sample weights (look-ahead); **0.09** with rolling 60-day weights | none |
| Single-leg carry strategy | Sharpe 0.45, walk-forward 18 folds IS 0.576 → OOS 0.502 | 1 bp fee |
| **Basis-panel carry composite** | Sharpe **1.09**, NW-t **3.34** over 2,396 days (Bonferroni bar 3.31), max drawdown −23.6% | **none** |

## 5. Caveats

- **The Sharpe of 1.09 deducts no costs at all**: neither commission nor slippage. Its continuous weights rebalance daily and the 10% volatility target changes leverage daily, and none of that turnover is charged. The IC-weighted composite likewise deducts nothing; every other strategy result deducts only a 1 bp one-way commission, with no slippage.
- The three carry legs were chosen **after** looking at the 54 candidates. The Bonferroni bar counts those 54 tests but not the extra freedom of that choice, so NW-t 3.34 clears the bar only nominally.
- The basis uses same-day data, which is mildly optimistic.
- The IC-weighted multi-factor composite shows how easily look-ahead inflates results: fixing the weights to a rolling window takes its Sharpe from 1.18 to 0.09.

## References

- Moskowitz, T. J., Ooi, Y. H., & Pedersen, L. H. (2012). Time Series Momentum. *Journal of Financial Economics*, 104(2), 228–250.
- Koijen, R. S. J., Moskowitz, T. J., Pedersen, L. H., & Vrugt, E. B. (2018). Carry. *Journal of Financial Economics*, 127(2), 197–225.
