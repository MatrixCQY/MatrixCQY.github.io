---
title: "factor_lab — A Reproducibility Framework for Published Equity Factors"
excerpt: "An independent factor-research stack built to answer one question: how many published sell-side equity factors survive a careful replication and a proper multiple-testing correction? Includes a live 28-panel factor dashboard."
collection: portfolio
---

`factor_lab` is a self-contained equity factor research stack built around a single question:

> Of the factors published in sell-side quantitative research, how many survive an **independent replication** and a **proper multiple-testing correction**?

This is the domestic-market analogue of the replication literature — Harvey, Liu & Zhu (2016), *…and the Cross-Section of Expected Returns*; Hou, Xue & Zhang (2020), *Replicating Anomalies* — applied to Chinese A-shares. Answering it honestly requires building the whole pipeline, because the answer is extremely sensitive to details that summary tables never report: point-in-time discipline, the neutralisation scheme, transaction costs, and how many candidates were searched before the winner was chosen.

**[→ Open a live factor dashboard](/files/factor-lab/htsc_turn_1m.html)** — 28 panels for a single factor, self-contained HTML, light/dark aware, with CSV export, PNG export and an A4 print stylesheet.

---

## 1. Data Layer

Every module is validated against a naive reference implementation and an explicit look-ahead test before it is trusted.

| Component | What it does | Verification |
| :--- | :--- | :--- |
| Trading calendar | Master calendar plus a whole-library audit | Detected **29 panels contaminated with 4,261 non-trading days each** |
| Point-in-time expansion | Financial statements from report-period to daily frequency | Cell-by-cell agreement with a naive implementation; **zero look-ahead violations** |
| Price adjustment | Back-adjusted prices and returns | `fwd1[t] == ret[t+1]` holds exactly; **15 adjustment-factor defects** flagged and masked |
| Universes | 9 index universes plus a tradability mask | CSI 300 has exactly 300 members at all times — and the **first and last constituent sets overlap in only 124 of 300 names**, which is survivorship bias made visible |
| Barra CNE5 | Style exposures, industry dummies, factor returns | Industries mutually exclusive with zero overlap; design matrix full rank, 40/40 |
| Minute bars | 12 daily statistics derived from intraday bars | Reconciled against daily aggregates to a **median ratio of 1.0000** |

**A note on the minute-bar mapping.** The intraday files carry no timestamp column — order is time. Each stock-day has exactly 242 bars, and the mapping was established empirically rather than assumed:

- bar 0 is 09:30 and **contains the opening call auction** (4.42% of market volume)
- bars 239 and 240 (14:58, 14:59) are **exactly zero** — there is no continuous trading during the closing auction
- bar 241 is the **closing call auction** (1.27% of volume)

The default continuous-session window therefore excludes both auctions. A call auction is a single clearing price; splicing it into a minute series manufactures artificial jumps at both ends of the day and badly distorts any correlation or autocorrelation estimate computed from it.

## 2. Operator and Expression Layer

33 time-series operators and 13 cross-sectional operators, exposed through a **factor expression DSL** with 53 operators:

```python
f = evaluate("-1 * ts_mean(turn, 20)", env)     # 20-day turnover factor
```

The DSL parses to an AST against a whitelist — **no `eval`**. Ten adversarial expressions were written specifically to try to break out of it; all ten are rejected.

Numerical claims are held to a tolerance rather than an eyeball: the WLS neutralisation satisfies its first-order condition `X'Wε = 0` to **3.9 × 10⁻¹³**, and the multivariate rolling-regression residual operator agrees with `lstsq` everywhere.

## 3. Evaluation Layer

- **IC / RankIC with Newey–West HAC standard errors.** Monthly IC series are autocorrelated and heteroskedastic; a naive t-statistic on them is inflated. Output matches `statsmodels` exactly.
- **Layered backtest** with turnover and transaction-cost modelling, including drift (a market-cap-weighted portfolio correctly shows zero drift turnover).
- **Multiple-testing suite**: Benjamini–Hochberg FDR, Probabilistic Sharpe Ratio, **Deflated Sharpe Ratio**, and Hansen's SPA test. BH is cross-checked against `statsmodels`; the `E[max SR]` term inside DSR is verified by Monte Carlo.

## 4. The Result That Matters

Two batches replicated so far — **35 factors**, all-A universe, monthly rebalancing, 20 bp one-way cost, with the preprocessing pipeline stated in the source reports (MAD winsorisation → industry and style neutralisation via √market-cap WLS → z-score):

| | Batch 1 | Batch 2 |
| :--- | :--- | :--- |
| Factors | 24 — value, size, reversal, volatility (7), turnover, growth, quality (5) | 11 — **high-frequency price–volume** (7 HF, 3 price–volume, 1 turnover) |
| Unadjusted *p* < 0.05 | 22 / 24 | 11 / 11 |
| Benjamini–Hochberg FDR, *q* ≤ 0.05 | 22 / 24 | 11 / 11 |
| **Deflated Sharpe Ratio > 0.95** | **0 / 24** (max DSR 0.35) | **0 / 11** (max DSR 0.69) |

**33 of 35 factors clear FDR control. Not one clears the Deflated Sharpe Ratio.**

That last row is the whole point. Under the null of pure luck, the expected maximum annualised Sharpe across 24 independent trials is roughly 1.6 — and batch 1's best long–short Sharpe is 1.52. Batch 2's best is 1.57 against a lower bar drawn from 11 trials, and still fails. FDR control asks whether each factor beats zero; DSR asks whether the *best* factor beats what luck would have produced given how many were tried. Those are different questions, and only the second one is the one an allocator actually cares about.

Two further findings:

- **Replicated performance came in below the published figure in 17 of the 18 cases where the source report gave a comparable headline number** (batch 1: 14/15, median shortfall −5.77% annualised; batch 2: 3/3, median −15.30%). The remaining 17 factors did not publish a directly comparable statistic. This is not an accusation of bad faith — it is the ordinary consequence of publication incentives plus in-sample parameter selection.
- **Neutralisation reorders the entire ranking.** Book-to-price flips to *significantly negative* once Barra-neutralised (t = −3.74) because it is collinear with the Barra BooktoPrice style factor; earnings-to-price loses significance entirely (t = 0.79); turnover and decay-weighted reversal are by far the strongest survivors (t ≈ 10); and the volatility family retains significant IC while its long–short return collapses — the low-volatility anomaly is, in this sample, largely a shadow of style exposure.

## 5. The Factor Dashboard

Every replicated factor gets a **self-contained HTML dashboard** — no CDN, no build step, no server. The linked examples are the turnover factor from Huatai Securities' single-factor test series (2017-01-09), a candlestick upper-shadow factor from Soochow Securities' technical-analysis series (2020-06-19), and an intraday turnover-uniformity factor from the same Soochow series (2021-03-01), all reproduced independently:

**[→ 1-Month Average Turnover · factor dashboard](/files/factor-lab/htsc_turn_1m.html)**

**[→ Candlestick Upper-Shadow Std Dev · factor dashboard](/files/factor-lab/dwzq_candle_up_std.html)**

**[→ Turnover-Distribution Uniformity (minute-bar) · factor dashboard](/files/factor-lab/dwzq_utd.html)**

The third one doubles as a worked example of Section 4's headline finding: NW *t* = 8.91 on RankIC (nowhere near a fluke), yet the 20 bp long–short annualises at only +1.6% and DSR = 0.000 — a factor that is statistically real and economically dead, the two questions the dashboard is built to keep separate.

28 panels in five groups, so the page can be skimmed top-down. Beyond the usual layered net-value curve and IC series, the panels that exist specifically to *attack* the factor are:

| Panel | The question it is designed to answer |
| :--- | :--- |
| **Long-only vs benchmark** | A-share short selling is heavily constrained, so a long–short Sharpe is not an implementable result. The benchmark is the **selection universe equal-weighted, rebalanced by the same engine** — not a cap-weighted index, which would confound the factor with an equal-weight premium. |
| **Parameter plateau** | Does performance survive in a neighbourhood of the chosen lookback, or is it a lone peak? A lone peak is overfitting. |
| **Cost sensitivity and breakeven** | At what one-way cost does the strategy stop paying? A factor with 2.45× monthly two-way turnover lives or dies on this number. |
| **Neutralisation ladder** | Market-cap 1st/2nd/3rd order versus full Barra style — how much of the signal is just size? |
| **Barra style correlation** | Is this factor a proxy for a style factor wearing a different name? |
| **Long–short decomposition** | Which leg produced the return — and is that leg tradeable? |
| **Regime segmentation** | Does the factor work across market regimes, or only in one? |
| **Rank autocorrelation and half-life** | How long does the signal persist before it has to be re-traded? |
| **Coverage over time** | The first alarm for a data incident: a coverage cliff means the panel broke, not that the factor changed. |
| **Rolling ICIR, IC decay, per-industry IC, win rate / payoff / tails, monthly return heatmap** | Stability, horizon, breadth, and the shape of the return distribution behind the Sharpe. |

Implementation details that keep the numbers honest: the factor is computed at the T close and returns accrue from T+1; missing values are never filled, they drop out of the universe; the Newey–West bandwidth is set automatically (L = 4) and the naive t-statistic is never quoted.

**On consistency with the scorecard.** The dashboard and the reconciliation table run the same code but not the same window: the dashboard uses the full available sample (2010-03-31 – 2026-02-27, 192 monthly rebalances) while the batch scorecard is restricted to the common 144-month window so that factors are compared against each other on identical data. The performance figures therefore differ by design — the turnover factor shows +14.6% annualised long–short on the dashboard versus +8.62% in the batch table. The **multiple-testing statistics (BH-FDR *q*, DSR) are not recomputed on the dashboard**; they are imported from the batch scorecard, because a selection-bias correction is only meaningful relative to the full set of trials it was drawn from.

## 6. Known Limitations

- **Capacity is not yet modelled.** ADV-based capacity analysis and market-impact costs are the next module; a factor with a good Sharpe at 20 bp and no capacity ceiling is an incomplete result.
- **Pure-factor returns via Barra regression** are not yet implemented, so the neutralisation results are portfolio-sort based rather than regression based.
- **The two batches are not a random sample** of the literature. They were selected to be replicable from the available data, which biases towards factors with simple, fully-specified definitions. The DSR result should be read as "none of the 35 factors I could replicate survives", not "no published factor survives".
- Factor families that the underlying data cannot support — northbound flow, margin trading, shareholder counts, lockup expiries, block trades, tick-level order book, options, convertibles — are recorded in the knowledge base and explicitly flagged infeasible rather than approximated.

*Built on a licensed commercial data vendor; the underlying data and source documents are not redistributed. Individual dashboards cite the source report, as a replication should. The aggregate findings above are a statement about methodology and publication incentives across the literature, not about any particular institution.*
