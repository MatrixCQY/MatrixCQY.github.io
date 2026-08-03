---
title: "Time-Series Momentum & Carry Factor Library — Chinese Commodity Futures"
excerpt: "A two-factor-family research pipeline over ~15 years of daily data on 30+ Chinese commodity futures, with a full IC / ICIR / monotonicity / half-life evaluation suite."
collection: portfolio
---

A research pipeline for two classical factor families on the Chinese commodity futures market, built on roughly **15 years of daily data across 30+ continuous (main-contract) series**.

## 1. Factor Construction

**Time-series momentum.** Multi-window return signals, volatility-normalised so that contracts with very different realised volatility contribute comparably to the composite.

**Carry.** Term-structure slope, i.e. the annualised roll yield implied by the spread between nearby and deferred contracts.

Both families are then **cross-sectionally standardised** and **sector-neutralised**, so that the surviving signal is not simply a bet on one commodity sector (energy, ferrous, agriculture, …).

## 2. Evaluation Suite

Rather than reporting a single headline Sharpe ratio, every factor is passed through a standard diagnostic battery:

| Diagnostic | What it answers |
| :--- | :--- |
| **IC / ICIR** | Is the rank correlation with forward returns positive, and is it stable relative to its own volatility? |
| **Quintile monotonicity** | Does the return ordering hold across all five buckets, or is the signal driven by one extreme tail? |
| **Half-life** | How fast does the signal decay — and therefore how much turnover does it demand? |

## 3. Results

| Portfolio | Annualised Sharpe | Notes |
| :--- | :--- | :--- |
| Time-series momentum | **1.15** | |
| Carry (long–short) | **0.90** | IC 0.06, strictly monotonic across quintiles |
| **IC-IR weighted composite** | **1.60** | Max drawdown held within **9%** |

The composite weights the two families by their IC-IR, which is the natural weighting when the goal is to maximise the information ratio of the combined signal under an approximate independence assumption.

## 4. Caveats

The strict quintile monotonicity of the carry factor is the more informative result here — a monotone bucket ordering is much harder to produce by chance than a good Sharpe ratio on a single long–short leg. The composite Sharpe of 1.6 is reported before transaction costs and slippage; on a factor with this half-life, execution assumptions materially affect the realisable number.
