# What is QBTC?

QBTC is a new blockchain that mirrors Bitcoin. Every Bitcoin holder will be able to claim an equal amount of QBTC by proving they own their Bitcoin address. The proof never reveals the public key, so the claim itself is safe from quantum-computer attack.

## In plain English

A few terms you'll see repeatedly. Read these once and the rest of the docs become much easier.

* **UTXO** — short for "unspent transaction output." Think of a Bitcoin balance not as a single number but as a collection of separate coins (each one a UTXO). When you "have 0.5 BTC," you actually control one or more UTXOs that add up to 0.5 BTC. Bitcoin's entire ledger is a set of UTXOs.
* **Public key** — a long number derived from your Bitcoin private key. Your Bitcoin address is a hash (a one-way summary) of your public key. Bitcoin uses your public key to verify that signatures came from you.
* **Why public keys matter for quantum** — quantum computers can derive a private key from a public key. Once your public key is broadcast on Bitcoin (which happens every time you spend), a quantum-capable attacker could in principle reconstruct your private key and steal your coins.
* **Zero-knowledge proof (ZK proof)** — a cryptographic technique that proves you know a secret without revealing the secret itself. QBTC uses a ZK proof to confirm you own your Bitcoin address without ever broadcasting the public key.

## What QBTC does

QBTC is a standalone blockchain that keeps a continuous **mirror** of Bitcoin's UTXO set inside its own state. Every Bitcoin UTXO that exists right now has a corresponding 1:1 entitlement of QBTC waiting in that mirror.

To convert a claim into spendable QBTC:

1. You open a quantum-safe wallet.
2. The wallet generates a ZK proof that says, in effect, *"I control the private key for this Bitcoin address. I want my claim delivered to this QBTC address."*
3. You submit the proof to QBTC.
4. The chain verifies the proof, marks the claim as exhausted, and credits the QBTC to your destination address.

Your Bitcoin never moves. Your public key is never broadcast. Your private key never leaves your wallet.

## The two design choices that make this work

### 1. The validator layer uses post-quantum signatures

Every block on QBTC is signed using **ML-DSA**, a lattice-based signature scheme standardized by NIST as FIPS 204. Even an adversary with a large-scale quantum computer cannot forge a QBTC validator signature or rewrite QBTC's history.

The chain is built on a fork of CometBFT that uses ML-DSA throughout the consensus pipeline.

### 2. Claims use zero-knowledge proofs

The ZK proof reveals on-chain only:

* The hash of your Bitcoin address (which is public on Bitcoin anyway).
* The destination QBTC address.

It keeps secret:

* Your Bitcoin public key.
* Your Bitcoin private key.
* The signature you produced.

Once a Bitcoin public key has been broadcast (during a normal Bitcoin spend), a quantum-capable attacker could derive the private key from it. The ZK proof lets QBTC verify ownership cryptographically without ever exposing the public key. The migration itself stays quantum-safe.

## What QBTC is, technically

* A **Cosmos SDK** application chain with its own validator set, staking, governance, and IBC support.
* Native token: `qbtc`. Bech32 address prefix: `qbtc`.
* Consensus: **CometBFT, forked** to use ML-DSA signatures instead of Ed25519.
* One custom module (`x/qbtc`) that handles UTXO mirroring, claim verification, and the ZK PLONK verifier.
* A per-validator sidecar process (`bifrost`) that watches a Bitcoin full node and gossips new BTC blocks into QBTC, where more than 2/3 of bonded validator power must attest before they are processed.

## How a claim flows, end to end

1. **At launch.** QBTC starts with a snapshot of the Bitcoin UTXO set. Every UTXO becomes an entitlement entry in QBTC's state.
2. **Continuous updates.** As Bitcoin produces new blocks, QBTC's validators ingest them and update the mirror. New UTXOs become new entitlement entries; spent ones are reconciled; coinbase outputs add new entries. Whoever currently controls a Bitcoin UTXO controls the corresponding QBTC entitlement.
3. **User claims.** A holder runs a quantum-safe wallet, signs a ZK proof for the UTXO they want to claim, and submits it. A single transaction can claim up to 50 UTXOs from the same Bitcoin address.
4. **Verification.** Validators verify three things: the ZK proof is valid, the UTXO has an outstanding entitlement, and the destination QBTC address is well-formed.
5. **Release.** The QBTC is minted into the destination address. The entitlement is exhausted to prevent double-claims. The original Bitcoin UTXO is untouched and remains on Bitcoin.

Claims do not expire. Holders can claim immediately, wait years, or never claim at all.

## What QBTC is not

* **Not a fork of Bitcoin.** Bitcoin's chain is untouched. QBTC is a separate chain with its own history starting from its own genesis block.
* **Not a bridge or peg.** No Bitcoin is locked anywhere. There is no custodian, no multisig holding BTC, no wrapped representation.
* **Not a rollup or layer-2.** QBTC does not post data or proofs back to Bitcoin. It is a sovereign chain.
* **Not an ICO.** There is no public sale, no presale, no investor allocation, and no team premine. The entire supply is claimable by existing Bitcoin holders.

## Read next

* [The Quantum Threat to Bitcoin](quantum-threat.md), why this needs to exist.
* [Why a Parallel Chain](why-parallel-chain.md), why a soft fork, hard fork, or bridge does not solve this.
* [For BTC Holders](for-btc-holders.md), what to do as a Bitcoin owner.
* [Architecture](../build/architecture.md), the deeper technical view.
