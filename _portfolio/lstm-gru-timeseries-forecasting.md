---
title: "Deep-Learning Time-Series Forecasting (LSTM / GRU)"
excerpt: "Sequence models in PyTorch on the same feature system as the GBDT pipeline — a controlled comparison of tree ensembles versus recurrent architectures."
collection: portfolio
---

A follow-up to the [GBDT factor-mining pipeline](/portfolio/gbdt-factor-mining/) that holds the feature system, labelling scheme and validation protocol fixed and swaps only the model class. Because the inputs are identical, the comparison isolates the contribution of the architecture rather than of feature engineering.

## 1. Models

**LSTM** and **GRU** sequence models implemented in **PyTorch**, trained on **sliding-window sequence samples** so each observation carries its recent history rather than a single cross-sectional snapshot. Predictions from multiple models are then **ensembled**.

The motivation is straightforward: a tree ensemble sees each row independently and must have any temporal structure hand-engineered into its features, whereas a recurrent model can represent interactions across the window directly.

## 2. Out-of-Sample Results

| Metric | LSTM / GRU ensemble | GBDT baseline |
| :--- | :--- | :--- |
| Information Coefficient (IC) | **0.08** | 0.06 |
| Directional accuracy | **57%** | 55% |
| Long–short annualised Sharpe | **1.45** | 0.95 |
| Max drawdown | **9%** | — |

The Sharpe improvement of roughly **53%** over the GBDT baseline comes with a *narrower* drawdown, which is the more reassuring of the two facts — a Sharpe gain purchased with fatter tails would be much less interesting.

## 3. Caveats

Both model families were evaluated out-of-sample under the same forward-ordered splits, so the comparison is internally consistent. It is still a comparison on **one** feature system and **one** market: the correct reading is "recurrent architectures added signal here", not "recurrent architectures dominate trees". A stronger claim would require a Deflated Sharpe Ratio adjustment for the number of configurations searched, which is the natural next step for this project.
