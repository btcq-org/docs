---
title: "Consensus & Validators"
description: "QBTC consensus runs on CometBFT with ML-DSA signatures replacing Ed25519. Staking, distribution, and governance are standard Cosmos modules."
---

QBTC consensus is **CometBFT, forked** to use ML-DSA signatures instead of Ed25519. The economic layer is standard Cosmos `x/staking` and `x/distribution`. The only QBTC-specific consensus addition is Bitcoin block ingestion through vote extensions.

## Consensus engine

The chain depends on `github.com/btcq-org/cometbft`, a fork of CometBFT that replaces Ed25519 with ML-DSA throughout the consensus signing path. See [Quantum Resistance (ML-DSA)](/build/quantum-resistance) for details.

## Validator set

Validators bond QBTC via the standard Cosmos `x/staking` module (see [Becoming a validator](/build/running-a-node#becoming-a-validator) for the step-by-step). The validator set is selected by bonded stake, with the maximum size and slashing parameters configured at genesis.

* **Bonding**: standard `x/staking` semantics (self-bond from the validator's own account; no inflation, so rewards come from fees and Reserve emission).
* **Slashing**: standard `x/slashing` — double-sign and downtime.
* **Unbonding period**: 21 days on the current test network (a genesis parameter; subject to change at mainnet).
* **Validator consensus key**: ML-DSA-65 (`/cosmos.crypto.mldsa65.PubKey`).
* **Account keys** (including the validator operator account): ML-DSA-65 only. The chain rejects all other key types, including secp256k1, ed25519 and multisig.

## Validator responsibilities

In addition to standard Cosmos validator duties, QBTC validators also:

1. **Run the Bitcoin reader in `qbtcd`**, pointed at a Bitcoin Core node they trust. See [Running a Node](/build/running-a-node#configure-the-bitcoin-reader-validators).
2. **Attest Bitcoin blocks in their consensus votes** (vote extensions). A block enters QBTC state once validators with more than 2/3 of voting power attest it. See [Architecture](/build/architecture) for the data flow.

## Validator rewards

Validators earn from the **Reserve Module** (drawn down per the chain's emission formula) plus transaction fees. There is no inflationary minting. See [Tokenomics](/research/tokenomics) and the [Protocol Specification §2.5](/research/protocol-spec).

## Governance

Standard Cosmos `x/gov`. Proposals follow the standard voting period, deposit requirements, and threshold rules. No custom QBTC governance logic.

## Read next

* [Architecture](/build/architecture), the system-level view.
* [Quantum Resistance (ML-DSA)](/build/quantum-resistance).
* [Protocol Specification](/research/protocol-spec).
