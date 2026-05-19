---
description: Quantum-safe Bitcoin. Claimable by every BTC holder, secured against the coming quantum threat.
---

# Welcome to QBTC

QBTC is a quantum-resistant chain that mirrors Bitcoin's UTXO set. Every Bitcoin holder can claim a 1:1 entitlement of QBTC by proving ownership of their BTC — without ever broadcasting their public key.

Bitcoin's ECDSA signatures will eventually fall to quantum computers. QBTC is the migration path: a parallel ledger built on post-quantum cryptography from day one, so holders can move to safety on their own timeline without forking Bitcoin itself.

> **Status:** Pre-mainnet. The protocol is in active development. Sections marked _Coming soon_ will be filled in as features go live.

## Start here

**[For BTC holders](getting-started/for-btc-holders.md)** — What QBTC means for you, how the claim works, and how to prepare.

**[For developers](getting-started/for-developers.md)** — Architecture, modules, APIs, and how to build on QBTC.

**[For researchers & institutions](getting-started/for-researchers.md)** — The quantum threat model, security analysis, and tokenomics.

## The core idea in three sentences

1. Bitcoin's signatures are not quantum-safe. A sufficiently advanced quantum computer can derive the private key from any address whose public key has been revealed on-chain.
2. QBTC is a separate chain that uses post-quantum signatures (ML-DSA / Dilithium) at the consensus layer and mirrors Bitcoin's UTXO set, so every BTC holder has a pre-allocated 1:1 claim waiting for them.
3. To claim, you prove control of your BTC address using a zero-knowledge proof — the proof verifies ownership without exposing the public key, so the migration itself is quantum-safe.

No bridge. No peg. No locked BTC. Your bitcoin stays on Bitcoin. QBTC is the safe harbor that exists in parallel.

## What QBTC is not

- **Not a fork of Bitcoin.** Bitcoin's chain is untouched.
- **Not a bridge.** No BTC is custodied or locked anywhere.
- **Not an ICO or pre-sale.** The entire supply is claimable by existing Bitcoin holders. No team premine, no investor allocation.
- **Not a wrapped asset.** QBTC is a native token on its own chain, secured by its own validator set.

## Read next

- [What is QBTC?](introduction/what-is-qbtc.md) — Longer explanation with the protocol mechanics.
- [The Quantum Threat to Bitcoin](introduction/quantum-threat.md) — Why this needs to exist now.
- [Fair Launch Principles](introduction/fair-launch.md) — How QBTC avoids the failure modes of most token launches.
