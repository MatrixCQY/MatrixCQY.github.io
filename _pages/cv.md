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
* **Quantitative Research Intern**, Quant Team, Soochow Securities, 2026.05 – Present
  * Converted existing cross-sectional stock-selection factors into time-series (timing) signals, improving factor adaptability across different market regimes.
  * Refined existing factors and evaluated their performance, and mined new Alpha factors from data characteristics.

Selected Projects
======
* **factor_lab — A Reproducibility Framework for Published Equity Factors** — An independent A-share factor research stack (point-in-time financials, back-adjusted prices, Barra CNE5 neutralisation, a 53-operator expression DSL, Newey–West IC inference, layered backtesting with costs) built to replicate factors published in sell-side research and test them under proper multiple-testing correction.
  * Pilot batch of 24 factors: **22/24** significant unadjusted and **22/24** surviving Benjamini–Hochberg FDR, but **0/24** surviving a Deflated Sharpe Ratio threshold of 0.95 — against an expected maximum Sharpe of ≈1.6 under the null across 24 trials.
  * Replicated performance fell short of published figures **93%** of the time, median shortfall **−5.77%** annualised.
* **Time-Series Momentum & Carry Factor Library** — Built a two-factor-family research pipeline on ~15 years of daily data for 30+ Chinese commodity futures continuous contracts: time-series momentum (multi-window, volatility-normalised) and carry (term-structure slope), both standardised and sector-neutralised, with a full IC / ICIR / monotonicity / half-life evaluation suite.
  * Momentum portfolio: annualised Sharpe **1.15**. Carry long–short: Sharpe **0.9** (IC 0.06), strictly monotonic across quintiles.
  * IC-IR weighted composite: annualised Sharpe **1.6**, max drawdown held within **9%**.
* **Machine-Learning Factor Mining (GBDT)** — Constructed a 60,000-row × 40+-dimension feature matrix from TA-Lib technical indicators, labelled with the triple-barrier method, and trained an end-to-end GBDT model under time-series cross-validation to eliminate label leakage.
  * Out-of-sample IC **0.06**, directional accuracy **55%**, long–short portfolio annualised Sharpe **0.95**, annualised return **14%**.
* **Deep-Learning Time-Series Forecasting (LSTM / GRU)** — Reused the same feature system to implement LSTM and GRU sequence models in PyTorch, with sliding-window sequence sampling and multi-model ensembling to better capture non-linear interactions.
  * Out-of-sample IC **0.08**, directional accuracy **57%**, long–short portfolio annualised Sharpe **1.45** (≈53% above GBDT), max drawdown narrowed to **9%**.

See the [portfolio](/portfolio/) page for longer write-ups.

Skills
======
* **Programming**: Python
* **Libraries**: PyTorch, NumPy, Pandas, Matplotlib, TA-Lib
* **Tools**: LaTeX, Markdown, Git
* **AI agents**: heavy Claude Code user
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
