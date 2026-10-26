---
title: "What is QBTC?"
description: "QBTC explained in plain English: a blockchain with post-quantum validator signatures that mirrors Bitcoin, claimable 1:1 via zero-knowledge proof."
---

QBTC is a new blockchain that mirrors Bitcoin. A Bitcoin holder claims an equal amount of QBTC by proving they control their Bitcoin address. The claim does not publish the public key on chain. The self-claim supports P2PKH (`1…`) and P2WPKH (`bc1q…`) addresses today.

## In plain English

A few terms you'll see repeatedly. Read these once and the rest of the docs become much easier.

* **UTXO** — short for "unspent transaction output." Think of a Bitcoin balance not as a single number but as a collection of separate coins (each one a UTXO). When you "have 0.5 BTC," you actually control one or more UTXOs that add up to 0.5 BTC. Bitcoin's entire ledger is a set of UTXOs.
* **Public key** — a long number derived from your Bitcoin private key. Your Bitcoin address is a hash (a one-way summary) of your public key. Bitcoin uses your public key to verify that signatures came from you.
* **Why public keys matter for quantum** — quantum computers can derive a private key from a public key. Once your public key is broadcast on Bitcoin (which happens every time you spend), a quantum-capable attacker could in principle reconstruct your private key and steal your coins.
* **Zero-knowledge proof (ZK proof)** — a cryptographic technique that proves you know a secret without revealing the secret itself. QBTC uses a ZK proof to confirm you own your Bitcoin address without publishing the public key on chain.

## What QBTC does

QBTC is a standalone blockchain that keeps a continuous **mirror** of Bitcoin's UTXO set inside its own state. Every Bitcoin UTXO has a 1:1 QBTC entitlement in that mirror. The zero-knowledge self-claim supports P2PKH (`1…`) and P2WPKH (`bc1q…`) outputs today. A new output needs 144 Bitcoin confirmations (about one day) before it can claim.

To convert a claim into spendable QBTC:

1. You open a wallet that supports QBTC claims.
2. The wallet signs a digest with your Bitcoin key and sends the signature to a proving service.
3. The service builds a ZK proof that says, in effect, *"The holder controls the private key for this Bitcoin address and wants the claim delivered to this QBTC address."* The service broadcasts the claim.
4. The chain verifies the proof, marks the claim as exhausted, and credits the QBTC to your destination address.

Your Bitcoin never moves. Your public key never goes on chain.

## The two design choices that make this work

### 1. The validator layer uses post-quantum signatures

Every block on QBTC is signed using **ML-DSA**, a lattice-based signature scheme standardized by NIST as FIPS 204. ML-DSA is believed secure against known quantum attacks, so a quantum computer should not let an adversary forge a QBTC validator signature or rewrite QBTC's history.

The chain is built on a fork of CometBFT that uses ML-DSA throughout the consensus pipeline.

### 2. Claims use zero-knowledge proofs

The ZK proof reveals on-chain only:

* The hash of your Bitcoin address (which is public on Bitcoin anyway).
* The destination QBTC address.

It keeps secret:

* Your Bitcoin public key.
* The signature you produced.

Once a Bitcoin public key has been broadcast (during a normal Bitcoin spend), a quantum-capable attacker could derive the private key from it. The ZK proof lets QBTC verify ownership without publishing the public key on chain.

## What QBTC is, technically

* A **Cosmos SDK** application chain with its own validator set, staking, governance, and IBC support.
* Native token: `qbtc`. Bech32 address prefix: `qbtc`.
* Consensus: **CometBFT, forked** to use ML-DSA signatures instead of Ed25519.
* One custom module (`x/qbtc`) that handles UTXO mirroring, claim verification, and the ZK PLONK verifier.
* A per-validator sidecar process (`bifrost`) that watches a Bitcoin full node and gossips new BTC blocks into QBTC, where more than 2/3 of bonded validator power must attest before they are processed.

## How a claim flows, end to end

1. **At launch.** The chain loads a bootstrap seed of the Bitcoin UTXO set. Each UTXO becomes an entitlement entry in QBTC's state. Eligibility is live with no snapshot date: whoever controls an eligible unspent output at claim time can claim it.
2. **Continuous updates.** As Bitcoin produces new blocks, QBTC's validators ingest them and update the mirror. New UTXOs become new entitlement entries; spent ones are reconciled; coinbase outputs add new entries. Whoever currently controls a Bitcoin UTXO controls the corresponding QBTC entitlement.
3. **User claims.** A holder's wallet signs a digest for the address they want to claim. A proving service builds the ZK proof and broadcasts the claim. A single transaction can claim up to 50 UTXOs from the same Bitcoin address. A new output needs 144 Bitcoin confirmations (about one day) before it can claim.
4. **Verification.** Validators verify three things: the ZK proof is valid, the UTXO has an outstanding entitlement, and the destination QBTC address is well-formed.
5. **Release.** The QBTC is minted into the destination address. The entitlement is exhausted to prevent double-claims. The original Bitcoin UTXO is untouched and remains on Bitcoin.

Holders can claim immediately, wait years, or never claim at all. A claimed coin stays claimed after it moves on Bitcoin. The only exception: **governance votes can reclaim dormant exposed-key BTC** (outputs that have not moved for more than 17 years and whose public key is visible on chain). The cutoff is a Bitcoin block height written into each proposal. See [Tokenomics](/research/tokenomics).

## Read next

* [The Quantum Threat to Bitcoin](/learn/quantum-threat), why this needs to exist.
* [Why a Parallel Chain](/learn/why-parallel-chain), why a soft fork, hard fork, or bridge does not solve this.
* [For BTC Holders](/learn/for-btc-holders), what to do as a Bitcoin owner.
* [Architecture](/build/architecture), the deeper technical view.
