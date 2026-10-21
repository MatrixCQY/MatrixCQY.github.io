---
permalink: /
title: "About Me"
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

I am **Qiyang CHENG**, an undergraduate in Mathematics and Applied Mathematics at **Fudan University** (B.S., 2023–2027). From May to August 2026 I was a quantitative research intern on the quant team at **Soochow Securities**; in Fall 2025 I was an exchange student in the Department of Mathematics at **HKUST**.

My work is in **systematic alpha research**. I build and evaluate factors on Chinese commodity futures and A-shares, with a focus on:

- **Factor construction** — [time-series and cross-sectional momentum and carry](/portfolio/momentum-carry-factor-library/) on commodity futures, multi-window signals with volatility normalisation, cross-sectional standardisation and sector neutralisation. Each signal is classified by how it is used, and each portfolio's return is split into its cross-sectional and net-exposure parts: on Chinese commodities, two thirds of time-series momentum's return turns out to be cross-sectional.
- **Factor evaluation** — full IC / ICIR / quantile-monotonicity / half-life diagnostics rather than a single headline Sharpe ratio, with the return convention audited first (spliced continuous contracts hid half of the momentum effect and invented a carry result).
- **Deep learning on market data** — a [CNN that reads candlestick images](/portfolio/kchart-cnn-stock-selection/) of 4,303 A-shares (a cross-sectional ranking task with per-stock time-series input), and [GRU / MLP-Mixer models on an 8-level limit order book](/portfolio/lob-midprice-prediction/) (a single-instrument time-series task). In both cases I audited the reference implementation for leakage before reporting any number. The CNN signal is also tested across seeds, against 5-day reversal and after trading costs.
- **Machine learning for factor combination** — LightGBM and LSTM/GRU models over cross-sectional feature panels, all predicting a cross-sectional rank (the sequence models only change the input), judged by hold-out IC and Sharpe, seed stability and the in-sample vs. out-of-sample gap, with the remaining leakage and selection biases stated rather than hidden.
- **Replication and multiple testing** — [factor_lab](/portfolio/factor-lab-reproducibility/) is an independent research stack built to ask how many published equity factors survive a careful replication *and* a Deflated Sharpe Ratio correction. Across the 341 distinct factors replicated so far, 276 cleared FDR control and none cleared DSR.

My broader interests are in statistics, financial machine learning, and the parts of market microstructure that decide whether a paper signal survives contact with execution.

Feel free to browse my [portfolio](/portfolio/), [CV](/cv/), [notes](/notes/), and [reading list](/reading-list/).
