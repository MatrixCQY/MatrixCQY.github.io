---
layout: archive
title: "CV"
permalink: /cv/
author_profile: true
redirect_from:
  - /resume
---

{% include base_path %}

Education
======
* **B.S. in Mathematics and Applied Mathematics**, Fudan University, 2023.09 – 2027.06 (expected)
  * Selected coursework: Probability Theory (A), Mathematical Statistics, Deep Learning (A), Data Structures, Optimization Methods, Stochastic Analysis in Finance
* **Exchange Student**, Department of Mathematics, The Hong Kong University of Science and Technology (HKUST), Fall 2025

Experience
======
* **Quantitative Research Intern**, Quant Team, Soochow Securities, 2026.05 – 2026.08
  * Converted existing cross-sectional stock-selection factors into time-series (timing) signals, improving factor adaptability across different market regimes.
  * Refined existing factors and evaluated their performance, and mined new Alpha factors from data characteristics.

Selected Projects
======
* **Candlestick-Image CNN for A-Share Stock Selection** — Rendered 20-day OHLC windows of 4,303 A-shares (2017–2022) as 60 × 60 images and trained a CNN in PyTorch to predict 5-day cross-sectional return ranks (a cross-sectional ranking task; the per-stock time series enters only as the input image). Used a purged, gapped time split and eight point-in-time leakage assertions in the test suite. A batched GPU renderer draws about 278k images per second, pixel-identical to the reference renderer.
  * Audited the reference implementation: its label matched the design on only **0.16%** of points (8-day close-to-close instead of 5-day open-to-open rank), training labels leaked across the validation boundary, and predictions covered only the last 3 days of each month. Fixed all three.
  * 5-seed ensemble test RankIC **0.078** (NW-t **10.1**; single seeds 0.069–0.076), beating 5-day reversal by 0.056 IC (paired NW-t 4.3). Controlling for reversal leaves the CNN's partial IC at 0.075; controlling for the CNN, reversal's falls to 0.013 (t 1.2). Long-only excess breaks even at about **22 bp** one-way and is not significant at 15 bp (Sharpe 1.02, NW-t 1.1, DSR 0.70).
* **High-Frequency Mid-Price Forecasting on a Limit Order Book** — A single-instrument time-series forecasting task (no cross-section) on 23.5M snapshots of an 8-level order book. Recovered the undocumented label (mid-price change 55 events ahead) and built 16 causal microstructure features (order-book and order-flow imbalance, aggressive flow, spread). Trained GRU, MLP-Mixer, XGBoost and Lasso, plus a validation-fit linear combination. Chunked float32 features and a GPU window loader (45k → 130k samples/s) let the full run fit in memory.
  * Showed that the reference implementation's test results were in-sample. The validation set was the test set, combination weights were fitted on the test set (reported R² 0.0345 vs. 0.0346 refitted on test), and the scaler was re-fitted on test data. Rebuilt it with a purged 64/16/20 split and train-only preprocessing.
  * Six models reach test IC **0.166–0.217** and R² **2.4–4.5%** (all HAC-significant after Holm correction); the validation-fit combination reaches IC **0.224** and R² **4.84%**. Hand-crafted features beat the raw book by about 0.05 IC. Trading costs are not yet modelled.
* **factor_lab — A Reproducibility Framework for Published Equity Factors** — An independent A-share cross-sectional factor research stack (point-in-time financials, back-adjusted prices, Barra CNE5 neutralisation, a 53-operator expression DSL, Newey–West IC inference on monthly cross-sectional IC, layered backtesting with costs) built to replicate factors published in sell-side research and test them under proper multiple-testing correction.
  * **341** distinct factor expressions replicated on one common window (406 records across 30 batches): **277** significant unadjusted and **276** surviving Benjamini–Hochberg FDR, but **0/341** surviving a Deflated Sharpe Ratio threshold of 0.95. Across 341 trials, the expected maximum Sharpe under pure luck is ≈2.6.
  * Of the 105 factors whose source report gave a comparable long–short figure, the replication came in lower **95%** of the time, with a median shortfall of **−15.4%** annualised.
* **Commodity Futures Time-Series Momentum & Carry Factor Research** — Built a factor research and falsification pipeline on 26 Chinese commodity futures (daily, 2016–2026; returns are the dominant contract's own holding returns, zero on roll days), reporting IC / ICIR / Newey–West t / quantile monotonicity / half-life, with block bootstrap, Patton–Timmermann monotonicity tests, rolling split-sample checks, PBO and DSR as out-of-sample checks. Every signal is classified and evaluated as time-series or cross-sectional, and each portfolio's return is split into its cross-sectional and net-exposure parts.
  * 26-contract time-series momentum (multi-window sign, two-level volatility scaling), net of a 1 bp one-way fee (no slippage): Sharpe **0.81** (NW-t **2.45**; 0.41 on the spliced continuous series, which hides half the effect). A 2×2 experiment: volatility targeting lifts Sharpe from 0.44 to **0.67** (per-contract paired t **3.12**), cross-sectional inverse-volatility weighting to 0.73. **66% of the portfolio's mean return is cross-sectional** (Sharpe 0.79, NW-t 2.41); the net-exposure timing part is not significant (0.27, t 0.86).
  * 252-day cross-sectional momentum, tercile long–short after 1 bp: Sharpe **0.71** (NW-t 2.09), daily Rank IC 0.026 (NW-t **4.24**); on the spliced series it reads **−0.27**, because roll gaps strip the roll yield that momentum winners earn. Falsified "continuous-contract slope = carry" (correlation with the true roll yield −0.10; its quintile long–short falls from 0.79 to −0.10 on holding returns); all 54 candidate factors were insignificant after Bonferroni correction.
  * Audited the return series: the open-interest roll rule flagged only **5.5%** of 2,566 dominant-contract rolls, and the leftover roll gaps were predictable from the basis signal a day ahead. Rebuilt returns from dominant-contract prices; a 56-commodity basis-carry composite fell from Sharpe **1.09** (NW-t 3.34) to **0.47** (NW-t 1.40), while the plain carry level reached **0.84** (NW-t 2.60), all before costs.
* **Machine-Learning Factor Combination & Multi-Strategy Portfolio (Commodity Futures)** — Inputs: 56 commodities × 59 cross-sectional features (52 TA-Lib / academic factors + 7 basis anchors; winsorised, sector-neutralised, cross-sectionally standardised); label: cross-sectional rank of the 5-day forward return, so every model is a cross-sectional ranker. Compared a strongly regularised LightGBM (15-seed ensemble) with LSTM / GRU on 20-day × 9-factor per-contract sequences (time-series input, same cross-sectional target), using the same 2022-05 split. Then volatility-targeted seven low-correlation legs (LightGBM / carry / LSTM / negative skew / cointegration basket / basis momentum / 5-day reversal) one by one and combined them.
  * All returns use dominant-contract holding returns after the roll audit above. LightGBM hold-out long–short Sharpe **0.92** (NW-t 1.56) over 952 days before costs, daily IC 0.016 (NW-t 1.42, not significant); break-even fee ≈ 3.6 bp one-way; purging the label overlap leaves it unchanged; all 15 seeds positive. An unregularised deep tree goes from IS 21.5 to OOS −0.35. LSTM ensemble Sharpe **0.81** before costs (GRU 0.58; single seeds 0.37–1.25).
  * Seven-leg portfolio hold-out Sharpe **1.31** before costs (0.93 after a 1 bp fee), NW-t **2.36**, max drawdown **−16.1%**, DSR 0.65 (average pairwise correlation 0.06). Five weighting schemes give hold-out Sharpe 1.29–1.36.

See the [portfolio](/portfolio/) page for longer write-ups.

Skills
======
* **Programming**: Python
* **Libraries**: PyTorch, NumPy, Pandas, Matplotlib, TA-Lib
* **Tools**: LaTeX, Markdown, Git
* **Languages**: Chinese (native), English (IELTS, CET-4)

Honors and Awards
======
* Fudan University Freshman Scholarship
* Basic Discipline Scholarship, Fudan University — 2023–24 and 2024–25 academic years
* Sichuan Provincial Physics Competition, Third Prize — 2023
* Gaokao (National College Entrance Examination): 694, top 100 in province

Service and leadership
======
  * Mid Lane Shotcaller in League of Legends (LoL) :)
