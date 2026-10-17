---
title: "Commodity Futures Time-Series Momentum & Carry Factor Research"
excerpt: "A factor research and falsification pipeline on Chinese commodity futures (2015–2026): momentum Sharpe 0.45, a carry proxy that failed falsification, 54 candidate factors with none surviving Bonferroni, and an audit of the return series itself. A roll-detection rule missed most contract rolls; on true contract holding returns a basis-carry composite falls from Sharpe 1.09 (NW-t 3.34) to 0.47 (NW-t 1.40), while the plain carry level is the strongest leg at 0.84 (NW-t 2.60), all before costs."
collection: portfolio
order: 4
---

A research pipeline for two classical factor families on Chinese commodity futures. It is built to **falsify** signals as much as to find them: every candidate goes through significance, multiple-testing and out-of-sample checks before a number is reported. The checks also cover the data: the most important finding on this page is that an earlier carry result came from contract rolls, not from carry.

## 1. Data

- **26 continuous (main-contract) series**, daily, 2015-01 to 2026-06, with the main contract chosen by open interest. The momentum tests and the carry-proxy test use the series as spliced. The 54-factor scan and the single-leg strategy use a roll-adjusted version in which returns on suspected roll days (open interest changes by more than 50%) and on suspected data errors (absolute daily return above 15%) are set to zero. Section 5 shows that this rule catches only part of the rolls. The results that use it are null results, and leftover roll gaps can only create false positives, so they do not change those conclusions.
- For carry, a separate **56-commodity basis panel** that records each day's dominant contract and its price. Carry returns are that contract's own day-to-day price changes, with zero on the day the dominant contract changes, so no roll gap enters the return series.

## 2. Signals

**Time-series momentum.** Direction is the average sign of 21 / 63 / 126 / 252-day returns. Position size is 15% divided by the 60-day realised volatility, capped at 2× leverage.

**Carry composite.** Three legs: the basis level, a 63-day price-reversal proxy for the term-structure slope, and the 20-day change in the basis. Each leg is z-scored and the three are equal-weighted. The result is traded as a continuous-weight long–short book with a 10% portfolio volatility target.

## 3. Evaluation

IC / ICIR, quantile monotonicity and half-life for every factor; Newey–West t-statistics for strategy returns (the 54-factor scan uses plain t-statistics). On top of that: block bootstrap confidence intervals, a rolling split-sample stability check with fixed parameters, PBO, the Deflated Sharpe Ratio, and a Bonferroni threshold across the 54 candidate factors in the main scan. The 54 are a lower bound on the number of trials, since other parts of the pipeline scanned further variants.

## 4. Results

**Costs.** No figure on this page deducts slippage or market impact. In the last column, "1 bp fee" means a 1 bp one-way commission charged on every change in position, and "none" means neither commission nor slippage is deducted.

| Test | Result | Costs deducted |
| :--- | :--- | :--- |
| 26-contract momentum portfolio | Sharpe **0.45** (single-contract baseline 0.16) | 1 bp fee (leverage changes not charged) |
| Volatility targeting, 2×2 experiment | Sharpe 0.05 → **0.25**, paired t = **3.56**, block-bootstrap 95% CI [0.03, 0.39] | 1 bp fee |
| "Continuous-contract slope = carry" proxy | Quintile long–short Sharpe 0.735, but IC 0.0088 (t = 1.45), and on JM its correlation with the true roll yield is **−0.10**: no evidence that it tracks carry, so the proxy is **rejected** | 1 bp fee (Sharpe); IC and correlation involve no costs |
| 54 candidate factors | None has an unadjusted \|t\| above 1.96; none survives Bonferroni | 1 bp fee |
| IC-weighted multi-factor composite | 1.18 with full-sample weights (look-ahead); **0.09** with rolling 60-day weights | none |
| 63-day reversal (the slope proxy) as a strategy | Sharpe 0.45; rolling split-sample check over 18 folds, IS 0.576 → OOS 0.502 | 1 bp fee |
| **Basis-panel carry composite** | Sharpe **0.47**, NW-t **1.40** over 2,396 days, max drawdown −21.6% | **none** |
| Same composite, net of fees | 1 bp: Sharpe 0.36, NW-t 1.08; break-even ≈ 4 bp one-way | 1 bp fee |
| Carry legs added one at a time (no volatility target) | Basis level alone **0.84** (NW-t **2.60**); adding the slope proxy 0.39; adding basis momentum 0.67 | none |

The composite is not significant even before costs. The only leg with a clear economic rationale, the basis level (the carry of Koijen et al., 2018), is also the only one significant at 5% on its own. It does not clear the Bonferroni bar of 3.31, and picking it after seeing all three legs would be one more selection step, so the composite stays the headline number.

## 5. Audit: a Carry Result That Came From Contract Rolls

The first version of this pipeline built carry returns from the roll-adjusted main-contract series. The composite then had Sharpe **1.09** and NW-t **3.34**, just above the Bonferroni bar. Checking that series against the basis panel's own dominant-contract prices showed two problems:

- **The roll rule misses most rolls.** Of the 2,566 changes of dominant contract in the basis panel, only 5.5% are flagged by the open-interest or 15% rule on the day or the next day. Each missed roll leaves the price gap between two contracts in the series as if it were a one-day return.
- **The signal could see the gaps coming.** The main-contract series often rolls one day after the basis panel. On the basis panel's roll day the basis rate jumps, so the basis-momentum leg moves, and the next day the main series shows a gap in the same direction. The strategy was "predicting" returns that nobody could earn.

The two return series differ by more than 1% on only 1.54% of cells. Keeping the signal unchanged and replacing those returns with true holding returns already cuts the composite to 0.58; rebuilding the whole panel from dominant-contract prices gives the 0.47 above. The basis-momentum leg was riding the gaps, while the basis level got stronger once they were removed. The dominant-contract prices were checked against single-contract data where available (94% and 99% exact daily agreement for RB and JM), and the corrected return builder has its own unit tests.

## 6. Caveats

- No figure deducts slippage. The fees charged are a one-way commission on position changes; leverage changes from the volatility targets are not charged.
- The three carry legs were chosen **after** looking at the 54 candidates, and the windows (63, 20) were set on the same sample.
- The basis uses same-day data, which is mildly optimistic.
- Both commodity universes are today's listed contracts, so the sample has survivorship bias.
- Three contracts in the basis panel (PM, WH, WR) trade only a handful of lots a day and are not realistically tradable; they are kept so the universe matches the rest of the research.
- The IC-weighted multi-factor composite shows how easily look-ahead inflates results: fixing the weights to a rolling window takes its Sharpe from 1.18 to 0.09.

## References

- Moskowitz, T. J., Ooi, Y. H., & Pedersen, L. H. (2012). Time Series Momentum. *Journal of Financial Economics*, 104(2), 228–250.
- Koijen, R. S. J., Moskowitz, T. J., Pedersen, L. H., & Vrugt, E. B. (2018). Carry. *Journal of Financial Economics*, 127(2), 197–225.
