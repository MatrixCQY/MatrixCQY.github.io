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
* **Candlestick-Image CNN for A-Share Stock Selection** — Rendered 20-day OHLC windows of 4,303 A-shares (2017–2022) as 60 × 60 images and trained a CNN in PyTorch to predict 5-day cross-sectional return ranks. Used a purged, gapped time split and eight point-in-time leakage assertions in the test suite. A batched GPU renderer draws about 278k images per second, pixel-identical to the reference renderer.
  * Audited the reference implementation: its label matched the design on only **0.16%** of points (8-day close-to-close instead of 5-day open-to-open rank), training labels leaked across the validation boundary, and predictions covered only the last 3 days of each month. Fixed all three.
  * 5-seed ensemble test RankIC **0.078** (NW-t **10.1**; single seeds 0.069–0.076), beating 5-day reversal by 0.056 IC (paired NW-t 4.3). Controlling for reversal leaves the CNN's partial IC at 0.075; controlling for the CNN, reversal's falls to 0.013 (t 1.2). Long-only excess breaks even at about **22 bp** one-way and is not significant at 15 bp (Sharpe 1.02, NW-t 1.1, DSR 0.70).
* **High-Frequency Mid-Price Forecasting on a Limit Order Book** — Worked with 23.5M snapshots of an 8-level order book for one instrument. Recovered the undocumented label (mid-price change 55 events ahead) and built 16 causal microstructure features (order-book and order-flow imbalance, aggressive flow, spread). Trained GRU, MLP-Mixer, XGBoost and Lasso, plus a validation-fit linear combination. Chunked float32 features and a GPU window loader (45k → 130k samples/s) let the full run fit in memory.
  * Showed that the reference implementation's test results were in-sample. The validation set was the test set, combination weights were fitted on the test set (reported R² 0.0345 vs. 0.0346 refitted on test), and the scaler was re-fitted on test data. Rebuilt it with a purged 64/16/20 split and train-only preprocessing.
  * Six models reach test IC **0.166–0.217** and R² **2.4–4.5%** (HAC t ≥ 89, Holm-corrected); the validation-fit combination reaches IC **0.224** and R² **4.84%**. Hand-crafted features beat the raw book by about 0.05 IC. Trading costs are not yet modelled.
* **factor_lab — A Reproducibility Framework for Published Equity Factors** — An independent A-share factor research stack (point-in-time financials, back-adjusted prices, Barra CNE5 neutralisation, a 53-operator expression DSL, Newey–West IC inference, layered backtesting with costs) built to replicate factors published in sell-side research and test them under proper multiple-testing correction.
  * **341** distinct factor expressions replicated on one common window (406 records across 30 batches): **277** significant unadjusted and **276** surviving Benjamini–Hochberg FDR, but **0/341** surviving a Deflated Sharpe Ratio threshold of 0.95. Across 341 trials, the expected maximum Sharpe under pure luck is ≈2.6.
  * Of the 105 factors whose source report gave a comparable long–short figure, the replication came in lower **95%** of the time, with a median shortfall of **−15.4%** annualised.
* **Commodity Futures Time-Series Momentum & Carry Factor Research** — Built a factor research and falsification pipeline on 26 Chinese commodity futures continuous contracts (daily, 2015–2026; main-contract rolls chosen by open interest and ratio back-adjusted at price gaps to remove phantom roll returns), reporting IC / ICIR / Newey–West t / quantile monotonicity / half-life, with out-of-sample checks via block bootstrap, permutation tests, walk-forward, PBO and DSR.
  * 26-contract time-series momentum portfolio, net of a 1 bp one-way fee (no slippage): Sharpe **0.45** (single-contract baseline 0.16). A 2×2 experiment shows volatility targeting lifts Sharpe from 0.05 to **0.25** (paired t = **3.56**, block-bootstrap 95% CI [0.03, 0.39]).
  * Falsified "continuous-contract slope = carry" (correlation with the true roll yield −0.10); all 54 candidate factors were insignificant after Bonferroni correction. A carry composite built from a 56-commodity basis panel reached Sharpe **1.09**, NW-t **3.34** before costs, clearing the Bonferroni threshold of 3.31; after a 1 bp fee it is 0.99 (NW-t 3.02), below the threshold.
* **Machine-Learning Factor Combination & Multi-Strategy Portfolio (Commodity Futures)** — Inputs: 56 commodities × 59 cross-sectional features (52 TA-Lib / academic factors + 7 basis anchors; winsorised, sector-neutralised, cross-sectionally standardised); label: cross-sectional rank of the 5-day forward return. Compared a strongly regularised LightGBM (15-seed ensemble) with LSTM / GRU on 20-day × 9-factor sequences, using the same 2022-05 split. Then volatility-targeted seven low-correlation legs (LightGBM / carry / LSTM / negative skew / cointegration basket / basis momentum / 5-day reversal) one by one and combined them.
  * LightGBM hold-out IC **0.028** (NW-t 2.53), long–short Sharpe **1.32** over 957 days before costs (break-even fee ≈ 5.6 bp one-way; purging the label overlap leaves it unchanged), with all 15 seeds positive (mean 1.13). An unregularised deep tree goes from IS 21.7 to OOS 0.58. LSTM ensemble Sharpe **1.08** before costs (GRU 0.84; single seeds 0.36–1.50).
  * Seven-leg portfolio hold-out Sharpe **2.47** before costs (**2.11** after a 1 bp fee), NW-t **4.78**, max drawdown **−9.1%** (average pairwise correlation 0.07). Five weighting schemes give hold-out Sharpe 2.37–2.51.

See the [portfolio](/portfolio/) page for longer write-ups.

Skills
======
* **Programming**: Python
* **Libraries**: PyTorch, NumPy, Pandas, Matplotlib, TA-Lib
* **Tools**: LaTeX, Markdown, Git
* **Languages**: Chinese (native), English (IELTS 6.0, CET-4)

Honors and Awards
======
* Fudan University Freshman Scholarship
* Basic Science Scholarship, Fudan University — 2023, 2024, 2025
* Sichuan Provincial Physics Competition, Third Prize — 2023
* Gaokao (National College Entrance Examination): 694, top 100 in province

Service and leadership
======
  * Mid Lane Shotcaller in League of Legends (LoL) :)
