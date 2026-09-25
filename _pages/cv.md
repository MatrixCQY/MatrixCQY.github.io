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
* **factor_lab — A Reproducibility Framework for Published Equity Factors** — An independent A-share factor research stack (point-in-time financials, back-adjusted prices, Barra CNE5 neutralisation, a 53-operator expression DSL, Newey–West IC inference, layered backtesting with costs) built to replicate factors published in sell-side research and test them under proper multiple-testing correction.
  * Pilot batch of 24 factors: **22/24** significant unadjusted and **22/24** surviving Benjamini–Hochberg FDR, but **0/24** surviving a Deflated Sharpe Ratio threshold of 0.95 — against an expected maximum Sharpe of ≈1.6 under the null across 24 trials.
  * Replicated performance fell short of published figures **93%** of the time, median shortfall **−5.77%** annualised.
* **Commodity Futures Time-Series Momentum & Carry Factor Research** — Built a factor research and falsification pipeline on 26 Chinese commodity futures continuous contracts (daily, 2015–2026; main-contract rolls chosen by open interest and ratio back-adjusted at price gaps to remove phantom roll returns), reporting IC / ICIR / Newey–West t / quantile monotonicity / half-life, with out-of-sample checks via block bootstrap, permutation tests, walk-forward, PBO and DSR.
  * 26-contract time-series momentum portfolio: Sharpe **0.45** (single-contract baseline 0.16). A 2×2 experiment shows volatility targeting lifts Sharpe from 0.05 to **0.25** (paired t = **3.56**, block-bootstrap 95% CI [0.03, 0.39]).
  * Falsified "continuous-contract slope = carry" (correlation with the true roll yield −0.10); all 54 candidate factors were insignificant after Bonferroni correction. A carry composite built from a 56-commodity basis panel reached Sharpe **1.09**, NW-t **3.34**, clearing the Bonferroni threshold of 3.31.
* **Machine-Learning Factor Combination (LightGBM)** — Inputs: 56 commodities × 59 cross-sectional features (52 TA-Lib / academic factors + 7 basis anchors; winsorised, sector-neutralised, cross-sectionally standardised); label: cross-sectional rank of the 5-day forward return. Strongly regularised shallow trees with a 15-seed ensemble, evaluated on a 957-day hold-out period after 2022-05.
  * Hold-out IC **0.028** (NW-t 2.53), long–short Sharpe **1.32**, **1.34** when blended with the carry prior; all 15 seeds have positive Sharpe (mean 1.13). An unregularised deep tree goes from IS 21.7 to OOS 0.58, quantifying overfitting and motivating the strong-regularisation setup.
* **Deep Sequence Models & Multi-Strategy Portfolio** — Trained LSTM / GRU models in PyTorch on 20-day × 9-factor sequences (15-seed ensembles) and compared them with GBDT using the same 2022-05 split date; then volatility-targeted seven low-correlation sub-strategies (LightGBM / carry / LSTM / negative skew / cointegration basket / basis momentum / 5-day reversal) one by one and combined them with equal weights.
  * LSTM ensemble Sharpe **1.08** (GBDT 1.32, GRU 0.84); single-seed Sharpe ranges from 0.36 to 1.50, quantifying training noise. Seven-leg portfolio hold-out Sharpe **2.47**, NW-t **4.78**, max drawdown **−9.1%** (average pairwise correlation 0.07; equal-weight / ERC / HRP differ by < 0.1).

See the [portfolio](/portfolio/) page for longer write-ups.

Skills
======
* **Programming**: Python
* **Libraries**: PyTorch, NumPy, Pandas, Matplotlib, TA-Lib
* **Tools**: LaTeX, Markdown, Git
* **Languages**: Chinese (native), English (CET-4, CET-6)

Honors and Awards
======
* Fudan University Freshman Scholarship
* Basic Science Scholarship, Fudan University — 2023, 2024, 2025
* Chinese Physics Olympiad (CPhO), Third Prize — 2023
* Gaokao (National College Entrance Examination): 694, top 100 in province

Service and leadership
======
  * Mid Lane Shotcaller in League of Legends (LoL) :)
