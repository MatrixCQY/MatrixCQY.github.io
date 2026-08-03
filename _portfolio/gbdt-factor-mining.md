---
title: "Machine-Learning Factor Mining with GBDT"
excerpt: "A 60,000 × 40+ feature matrix from TA-Lib indicators, triple-barrier labelling, and time-series cross-validation — an end-to-end GBDT pipeline built to avoid label leakage."
collection: portfolio
---

An end-to-end gradient-boosted decision tree (**GBDT**) pipeline for mining predictive signals from technical indicators, designed around the leakage problems that make most naive ML backtests unreproducible.

## 1. Feature Matrix

A **60,000-row × 40+-dimension** feature matrix built from **TA-Lib** technical indicators — momentum, volatility, volume and oscillator families across multiple lookback windows.

## 2. Labelling: the Triple-Barrier Method

Fixed-horizon labels ("did the price rise over the next *k* days?") throw away the path and ignore the fact that a position would realistically have been closed early. The **triple-barrier method** (López de Prado, *Advances in Financial Machine Learning*, Ch. 3) instead labels each observation by which of three barriers is touched first:

- an upper profit-taking barrier,
- a lower stop-loss barrier,
- a vertical time barrier.

This produces labels that correspond to a decision an actual strategy could have taken.

## 3. Validation: no label leakage

Standard k-fold cross-validation is invalid on financial time series: overlapping label windows leak information from the validation fold into training. The pipeline uses **time-series cross-validation** with strictly forward-ordered splits, so every validation window sits entirely after its training window.

## 4. Out-of-Sample Results

| Metric | Value |
| :--- | :--- |
| Information Coefficient (IC) | **0.06** |
| Directional accuracy | **55%** |
| Long–short portfolio, annualised Sharpe | **0.95** |
| Annualised return | **14%** |

## 5. Reading the numbers honestly

A directional accuracy of 55% and an IC of 0.06 are modest in absolute terms — which is the expected magnitude for a genuine out-of-sample signal on daily data. Numbers far above this range on a feature set of this kind are usually a leakage symptom rather than an alpha discovery. The value of this project is as much in the validation scaffolding as in the point estimates.

The same feature system was reused for the [LSTM / GRU sequence models](/portfolio/lstm-gru-timeseries-forecasting/), which allows a controlled comparison between tree ensembles and sequence models on identical inputs.
