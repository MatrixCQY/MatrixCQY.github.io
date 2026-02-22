---
title: "Quantitative Stock Selection Strategy Based on Multi-Scale Transformer"
excerpt: "Identifying non-linear Alpha factors in the A-share market using deep learning models, combining traditional Alpha 101 factors with modern attention mechanisms.<br/><img src='/images/quant-strategy-1.png'>"
collection: portfolio
---

This project proposes a quantitative stock selection strategy based on **Multi-Scale Transformer**, aiming to mine non-linear Alpha factors in the A-share market through deep learning models. 

The strategy combines traditional volume-price factors (Alpha 101) with modern attention mechanisms, enabling it to capture both long-term and short-term price fluctuation patterns in complex market environments.

## Performance Overview

![Equity Curve](/images/quant-strategy-1.png)
*Figure 1: Equity Curve (Model vbest) with Market Regimes*

The strategy demonstrates robust performance across different market regimes (Bull/Bear), achieving a Sharpe Ratio of **1.43**.

## Signal Analysis

![Price & Trading Signals](/images/quant-strategy-2.png)
*Figure 2: Price & Trading Signals (Stock 601857)*

![Price & Trading Signals](/images/quant-strategy-3.png)
*Figure 3: Price & Trading Signals (Stock 300750)*

The model effectively identifies buy/sell signals by analyzing multi-scale temporal features, providing stable excess returns over the benchmark.
