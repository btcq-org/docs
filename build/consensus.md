---
title: "Consensus & Validators"
description: "QBTC consensus runs on CometBFT with ML-DSA signatures replacing Ed25519. Staking, distribution, and governance are standard Cosmos modules."
---

QBTC consensus is **CometBFT, forked** to use ML-DSA signatures instead of Ed25519. The economic layer is standard Cosmos `x/staking` and `x/distribution`. The only QBTC-specific consensus addition is the `ebifrost` module's handling of attested Bitcoin block ingestion.

## Consensus engine

The chain depends on `github.com/btcq-org/cometbft`, a fork of CometBFT that replaces Ed25519 with ML-DSA throughout the consensus signing path. See [Quantum Resistance (ML-DSA)](/build/quantum-resistance) for details.

## Validator set

Validators bond QBTC via the standard Cosmos `x/staking` module (see [Becoming a validator](/build/running-a-node#becoming-a-validator) for the step-by-step). The validator set is selected by bonded stake, with the maximum size and slashing parameters configured at genesis.

* **Bonding**: standard `x/staking` semantics (self-bond from the validator's own account; no inflation, so rewards come from fees and Reserve emission).
* **Slashing**: standard `x/slashing` — double-sign and downtime.
* **Unbonding period**: 21 days on the current testnet (a genesis parameter; subject to change at mainnet relaunch).
* **Validator consensus key**: ML-DSA (`/cosmos.crypto.mldsa.PubKey`).
* **Validator operator (account) key**: also ML-DSA — QBTC's forked Cosmos SDK uses post-quantum account keys, not secp256k1.

## Validator responsibilities

In addition to standard Cosmos validator duties, QBTC validators also:

1. **Run a `bifrost` sidecar** that watches a Bitcoin full node and gossips signed BTC blocks to peers. See [Architecture](/build/architecture) for the data flow.
2. **Attest to ingested BTC blocks**. The `ebifrost` module aggregates these attestations; a block is ingested into QBTC state once more than 2/3 of bonded validator power has attested.

## Validator rewards

Validators earn from the **Reserve Module** (drawn down per the chain's emission formula) plus transaction fees. There is no inflationary minting. See [Tokenomics](/research/tokenomics) and the [Protocol Specification §2.5](/research/protocol-spec).

## Governance

Standard Cosmos `x/gov`. Proposals follow the standard voting period, deposit requirements, and threshold rules. No custom QBTC governance logic.

## Read next

* [Architecture](/build/architecture), the system-level view.
* [Quantum Resistance (ML-DSA)](/build/quantum-resistance).
* [Protocol Specification](/research/protocol-spec).
