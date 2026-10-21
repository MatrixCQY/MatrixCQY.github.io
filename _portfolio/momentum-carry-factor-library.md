---
title: "Commodity Futures Time-Series Momentum & Carry Factor Research"
excerpt: "A factor research and falsification pipeline on Chinese commodity futures. On dominant-contract holding returns (2016–2026), 26-contract time-series momentum reaches Sharpe 0.81 (NW-t 2.45) net of a 1 bp fee, two thirds of it cross-sectional; 252-day cross-sectional momentum reaches 0.71 (NW-t 2.09). A carry proxy failed falsification, 54 candidate factors survive nothing, and an audit of the return series shows that spliced continuous contracts hid half of the momentum effect while inventing a carry result: a basis-carry composite falls from Sharpe 1.09 (NW-t 3.34) to 0.47 (NW-t 1.40) on true holding returns, with the plain carry level the strongest leg at 0.84 (NW-t 2.60), all before costs."
collection: portfolio
order: 4
---

A research pipeline for two classical factor families on Chinese commodity futures. It is built to **falsify** signals as much as to find them: every candidate goes through significance, multiple-testing and out-of-sample checks before a number is reported. The checks also cover the data: the most important findings on this page are that an earlier carry result came from contract rolls, not from carry, and that the same rolls had hidden half of the momentum effect.

## 0. Time Series or Cross-Section?

The same signal s<sub>i,t</sub> (contract i, day t) can be used in two ways, and the two answer different questions.

| | Time-series use | Cross-sectional use |
| :--- | :--- | :--- |
| Position | w<sub>i,t</sub> = g(s<sub>i,t</sub>): the contract against its own history | w<sub>i,t</sub> = h(rank<sub>t</sub>(s<sub>·,t</sub>)) − mean: the contract against the others |
| Net exposure Σ<sub>i</sub> w<sub>i,t</sub> | varies over time | identically zero (market neutral) |
| Question answered | when to be long or short this contract | which contracts to be long and short |
| Evaluation | per-contract predictive regressions, comparison with always-long | daily cross-sectional IC / ICIR, quantile sorts, long–short books |

Every portfolio obeys an identity that splits its return into the two parts (w̄, r̄ are the day's cross-sectional means):

(1/N) Σ<sub>i</sub> w<sub>i</sub> r<sub>i</sub> = (1/N) Σ<sub>i</sub> (w<sub>i</sub> − w̄)(r<sub>i</sub> − r̄) + w̄ r̄ = **cross-sectional part** + **net-exposure (timing) part**.

On this page, **time-series momentum** (TSMOM) is a time-series construction, but Section 4 measures how much of its return is actually cross-sectional. **Cross-sectional momentum** is market neutral by construction. **Carry** is used both ways: the roll yield of a single contract is a time-series view, the basis-panel ranking is cross-sectional (Koijen et al., 2018, find both work, the cross-sectional version more strongly). The 54-factor scan is cross-sectional.

## 1. Data

- **26 commodity futures**, daily, **2016-01 to 2026-06 (2,531 days)**, with the dominant contract chosen by open interest. **Returns are the dominant contract's own day-to-day price changes, with zero on the day the dominant contract changes**, so no roll gap enters the series; momentum signals are computed on the same index. An earlier version of this page used the spliced continuous series (2015–2026) for the momentum tests; Section 5 explains why it was replaced and shows both sets of numbers.
- For carry, a separate **56-commodity basis panel** that records each day's dominant contract, its price and its basis rate. Carry returns are built the same way.
- The 54-factor scan (9 factor families × 6 windows) uses a roll-adjusted version of the spliced series (returns on suspected roll days and on suspected data errors set to zero) and has not been repeated on holding returns. Section 5 shows that this rule catches only part of the rolls and that roll gaps can bias a result in either direction, so that null result is provisional.

## 2. Signals

**Time-series momentum.** Direction is the average sign of 21 / 63 / 126 / 252-day returns (the 21- and 252-day directions correlate only 0.23, so the windows diversify). Position size is 15% divided by the 60-day realised volatility, lagged one day, capped at 2× leverage; the equal-weight portfolio is then scaled to a 10% volatility target, capped at 3×. The volatility estimate uses only data up to t − 1.

**Cross-sectional momentum.** Each day the 26 contracts are ranked on their 252-day return (ending at t − 1); the top tercile is held long and the bottom tercile short, one unit each side.

**Carry composite.** Three legs on the basis panel: the basis level, a 63-day price-reversal proxy for the term-structure slope, and the 20-day change in the basis. Each leg is z-scored and the three are equal-weighted. The result is traded as a continuous-weight long–short book with a 10% portfolio volatility target.

## 3. Evaluation

IC / ICIR, quantile monotonicity and half-life for every factor; Newey–West t-statistics for strategy returns (the 54-factor scan uses plain t-statistics). On top of that: block bootstrap confidence intervals, a rolling split-sample stability check with fixed parameters, Patton–Timmermann monotonicity tests, PBO, the Deflated Sharpe Ratio, and a Bonferroni threshold across the 54 candidate factors in the main scan. The 54 are a lower bound on the number of trials, since other parts of the pipeline scanned further variants; the 66-configuration grid behind the cross-sectional momentum result is counted separately below.

## 4. Results

**Costs.** No figure on this page deducts slippage or market impact. In the last column, "1 bp fee" means a 1 bp one-way commission charged on every change in position, and "none" means neither commission nor slippage is deducted.

### 4.1 Time-series momentum (holding returns, 2016–2026)

| Test | Result | Costs deducted |
| :--- | :--- | :--- |
| 26-contract portfolio, two-level volatility scaling | Sharpe **0.81**, NW-t **2.45**, max drawdown −21.5% (equal-weight, no portfolio target: 0.64, NW-t 1.96; single-contract RB, 252-day window: 0.56) | 1 bp fee (leverage changes not charged) |
| Same portfolio on the spliced series, same dates | Sharpe 0.41, NW-t 1.24: roll gaps hide half of the effect | 1 bp fee |
| 2×2 risk-management experiment, same direction signal | bare sign, equal notional **0.44** → time-series volatility targeting **0.67** → plus cross-sectional inverse-volatility weighting **0.73**; the two steps are not additive (0.67 + 0.55 − 0.44 = 0.78 > 0.73) | 1 bp fee |
| Volatility targeting, significance | ΔSharpe 0.22 at the portfolio level; per-contract paired t **3.12** (p = 0.0045, n = 26, 18 of 26 improve); the same 0.22 on the spliced series (t 2.60), so this gain does not depend on the return convention | 1 bp fee |
| **Decomposition into cross-sectional and timing parts** (equal-weight multi-window portfolio) | total Sharpe 0.69 (NW-t 2.13); **cross-sectional part 0.79 (NW-t 2.41), 66% of the mean return**; net-exposure timing part 0.27 (NW-t 0.86), 34%, not significant | none |
| Single contracts, 252-day window | 19 of 26 positive, 3 of 26 significant (NW-t > 1.96), median Sharpe 0.21: ten years is too short for single-contract significance, the portfolio result comes from diversification | 1 bp fee |

A signal built as a time-series rule earns two thirds of its money cross-sectionally on these 26 commodities, i.e. from being long the strong contracts and short the weak ones on the same day; the "time the whole market" component is not significant. Goyal & Jegadeesh (2018) find the opposite split on US equities, so the split has to be measured, not assumed. On the spliced series the two parts are roughly equal and neither is significant.

### 4.2 Cross-sectional momentum (holding returns, 2017-02 to 2026-06, 2,266 days)

| Test | Result | Costs deducted |
| :--- | :--- | :--- |
| 252-day momentum, tercile long–short | Sharpe **0.71**, NW-t **2.09**, annualised +10.5%, max drawdown −22.9%; daily Rank IC **0.026** (NW-t **4.24**); break-even ≈ 22 bp one-way | 1 bp fee |
| Same strategy on the spliced series | Sharpe **−0.27** (NW-t −0.77): the spliced series strips out the roll yield, and momentum winners sit in backwardation (winners' average carry +0.032 vs losers' +0.006; winners-minus-losers under-counted by 15.4% a year) | 1 bp fee |
| Robustness | quintiles 0.70, rank weights 0.69, skip the last 21 days 0.67, hold 21 days 0.69 (turnover 0.19 → 0.035), 56 contracts 0.72; sub-samples 2017–2020 **1.17** vs 2021–2026 **0.40** (the second half is not significant on its own) | 1 bp fee |
| Term structure | 1–2-day reversal is significant (IC NW-t −3.34 / −2.18) but breaks even at 1–2 bp; the sign flips between 21 and 63 days; 252 days is the strongest horizon | 1 bp fee |
| Sector neutralisation | lowers momentum from 0.71 to 0.48 (56 contracts: 0.72 → 0.26); the sector-level trend is part of the signal | 1 bp fee |
| Relation to TSMOM | daily correlation 0.52; TSMOM on cross-sectional momentum has no alpha (t 0.65), cross-sectional momentum on TSMOM keeps 6.2% a year (t 1.48, not significant): in a single asset class the two mostly overlap | 1 bp fee |
| Multiple testing | 66 configurations (11 lookback/skip pairs × raw/sector-neutral × 3 holding periods), Bonferroni bar 3.37: the IC t-statistic clears it, the long–short t of 2.09 does not; 252 days is the pre-registered horizon of the literature, not a grid pick | — |

### 4.3 Carry and the factor scan

| Test | Result | Costs deducted |
| :--- | :--- | :--- |
| "Continuous-contract slope = carry" proxy (−(P<sub>t−1</sub>/P<sub>t−64</sub> − 1) × 4) | On JM its correlation with the true roll yield is **−0.10**: it is a 63-day reversal factor, not carry. On the spliced series it looks good (quintile long–short Sharpe 0.79, NW-t 2.63, quintile NAVs monotone) but its IC t is 1.45 and the Patton–Timmermann monotonicity test gives p = 0.74; **on holding returns the quintile long–short is −0.10 (NW-t −0.34) and the Rank IC −0.004**. Rejected, and its spliced-series return was a roll artefact | 1 bp fee (Sharpe); IC and correlation involve no costs |
| 54 candidate factors | None has an unadjusted \|t\| above 1.96; none survives Bonferroni | 1 bp fee |
| IC-weighted multi-factor composite | 1.18 with full-sample weights (look-ahead); **0.09** with rolling 60-day weights | none |
| **Basis-panel carry composite** | Sharpe **0.47**, NW-t **1.40** over 2,396 days, max drawdown −21.6% | **none** |
| Same composite, net of fees | 1 bp: Sharpe 0.36, NW-t 1.08; break-even ≈ 4 bp one-way | 1 bp fee |
| Carry legs added one at a time (no volatility target) | Basis level alone **0.84** (NW-t **2.60**); adding the slope proxy 0.39; adding basis momentum 0.67 | none |

The composite is not significant even before costs. The only leg with a clear economic rationale, the basis level (the carry of Koijen et al., 2018), is also the only one significant at 5% on its own. It does not clear the Bonferroni bar of 3.31, and picking it after seeing all three legs would be one more selection step, so the composite stays the headline number.

## 5. Audit: What Contract Rolls Did to the Results

The first version of this pipeline used spliced continuous series. Checking those series against the basis panel's own dominant-contract prices showed two problems:

- **The roll rule misses most rolls.** Of the 2,566 changes of dominant contract in the basis panel, only 5.5% are flagged by the open-interest or 15% rule on the day or the next day. Each missed roll leaves the price gap between two contracts in the series as if it were a one-day return.
- **The signal could see the gaps coming.** The spliced series often rolls one day after the basis panel. On the basis panel's roll day the basis rate jumps, so the basis-momentum leg moves, and the next day the spliced series shows a gap in the same direction. The strategy was "predicting" returns that nobody could earn.

The roll gaps biased different results in different directions, which is why their effect cannot be guessed and every result had to be rerun:

| Result | Spliced series | Dominant-contract holding returns |
| :--- | :--- | :--- |
| Basis-carry composite, Sharpe / NW-t | 1.09 / 3.34 (just above the Bonferroni bar) | **0.47 / 1.40** |
| Slope-proxy (63-day reversal) quintile long–short | 0.79 / 2.63 | **−0.10 / −0.34** |
| 26-contract TSMOM, two-level scaling | 0.41 / 1.24 | **0.81 / 2.45** |
| 252-day cross-sectional momentum, tercile long–short | −0.27 / −0.77 | **0.71 / 2.09** |

For the carry composite, the two return series differ by more than 1% on only 1.54% of cells, yet keeping the signal unchanged and replacing those returns with true holding returns already cuts it to 0.58; rebuilding the whole panel from dominant-contract prices gives the 0.47 above. The basis-momentum leg was riding the gaps, while the basis level got stronger once they were removed. For momentum the direction was the opposite: the gaps were noise to a trend signal and cancelled part of the roll yield that momentum winners earn, so both momentum results were understated. The dominant-contract prices were checked against single-contract data where available (94% and 99% exact daily agreement for RB and JM), and the corrected return builder has its own unit tests.

## 6. Caveats

- No figure deducts slippage. The fees charged are a one-way commission on position changes; leverage changes from the volatility targets are not charged.
- The per-contract paired t-test for volatility targeting treats the 26 contracts as independent; contracts in the same sector are highly correlated, so the effective sample is smaller and the true p-value larger.
- The multi-window set (21 / 63 / 126 / 252) is a choice and is counted as one trial; the portfolio-level 3× leverage cap binds on 34.5% of days, so the headline Sharpe is sensitive to it.
- The three carry legs were chosen **after** looking at the 54 candidates, and the windows (63, 20) were set on the same sample.
- The basis uses same-day data, which is mildly optimistic.
- Both commodity universes are today's listed contracts, so the sample has survivorship bias.
- Three contracts in the basis panel (PM, WH, WR) trade only a handful of lots a day and are not realistically tradable; they are kept so the universe matches the rest of the research.
- The IC-weighted multi-factor composite shows how easily look-ahead inflates results: fixing the weights to a rolling window takes its Sharpe from 1.18 to 0.09.

## References

- Moskowitz, T. J., Ooi, Y. H., & Pedersen, L. H. (2012). Time Series Momentum. *Journal of Financial Economics*, 104(2), 228–250.
- Koijen, R. S. J., Moskowitz, T. J., Pedersen, L. H., & Vrugt, E. B. (2018). Carry. *Journal of Financial Economics*, 127(2), 197–225.
- Goyal, A., & Jegadeesh, N. (2018). Cross-Sectional and Time-Series Tests of Return Predictability: What Is the Difference? *The Review of Financial Studies*, 31(5).
- Patton, A. J., & Timmermann, A. (2010). Monotonicity in Asset Returns: New Tests with Applications to the Term Structure, the CAPM, and Portfolio Sorts. *Journal of Financial Economics*, 98(3), 605–625.
