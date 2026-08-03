---
title: "factor_lab — A Reproducibility Framework for Published Equity Factors"
excerpt: "An independent factor-research stack built to answer one question: how many published sell-side equity factors survive a careful replication and a proper multiple-testing correction?"
collection: portfolio
---

`factor_lab` is a self-contained equity factor research stack built around a single question:

> Of the factors published in sell-side quantitative research, how many survive an **independent replication** and a **proper multiple-testing correction**?

This is the domestic-market analogue of the replication literature — Harvey, Liu & Zhu (2016), *…and the Cross-Section of Expected Returns*; Hou, Xue & Zhang (2020), *Replicating Anomalies* — applied to Chinese A-shares. Answering it honestly requires building the whole pipeline, because the answer is extremely sensitive to details that summary tables never report: point-in-time discipline, the neutralisation scheme, transaction costs, and how many candidates were searched before the winner was chosen.

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

Pilot batch: **24 replicable factors**, all-A universe, 2014–2026, monthly rebalancing, quintile sorts, 20 bp one-way cost, with the preprocessing pipeline stated in the source reports — MAD winsorisation → 30 industry + 10 style neutralisation via √market-cap WLS → z-score.

| Test | Factors passing |
| :--- | :--- |
| Unadjusted *p* < 0.05 | **22 / 24** |
| Benjamini–Hochberg FDR, *q* ≤ 0.05 | **22 / 24** |
| **Deflated Sharpe Ratio > 0.95** | **0 / 24** |

That last row is the whole point of the project. Under the null of pure luck, the **expected maximum annualised Sharpe across 24 independent trials is roughly 1.6** — and not one factor's long–short Sharpe clears that bar. FDR control asks whether each factor beats zero; DSR asks whether the *best* factor beats what luck would have produced given how many were tried. Those are different questions, and only the second one is the one an allocator actually cares about.

Two further findings:

- **Replicated performance came in below the published figure 93% of the time, with a median shortfall of −5.77% annualised.** This is not an accusation of bad faith — it is the ordinary consequence of publication incentives plus in-sample parameter selection.
- **Neutralisation reorders the entire ranking.** Book-to-price flips to *significantly negative* once Barra-neutralised (t = −3.74) because it is collinear with the Barra BooktoPrice style factor; earnings-to-price loses significance entirely (t = 0.79); turnover and decay-weighted reversal are by far the strongest survivors (t ≈ 10); and the volatility family retains significant IC while its long–short return collapses — the low-volatility anomaly is, in this sample, largely a shadow of style exposure.

The scorecard and the per-factor HTML dashboards share a single computation path, so no number on a dashboard can drift from the reconciliation table.

## 5. Known Limitations

- **Capacity is not yet modelled.** ADV-based capacity analysis and market-impact costs are the next module; a factor with a good Sharpe at 20 bp and no capacity ceiling is an incomplete result.
- **Pure-factor returns via Barra regression** are not yet implemented, so the neutralisation results are portfolio-sort based rather than regression based.
- Factor families that the underlying data cannot support — northbound flow, margin trading, shareholder counts, lockup expiries, block trades, tick-level order book, options, convertibles — are recorded in the knowledge base and explicitly flagged infeasible rather than approximated.

*Built on a licensed commercial data vendor; the underlying data and source documents are not redistributed. Individual reports and their publishers are not identified here — the finding is about methodology in aggregate, not about any particular institution.*
