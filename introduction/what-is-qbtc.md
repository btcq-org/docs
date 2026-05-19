# What is QBTC?

QBTC is a **standalone, quantum-resistant blockchain that mirrors Bitcoin's UTXO set**. Every holder of Bitcoin has a pre-allocated, 1:1 claim of QBTC waiting for them on the new chain. To convert a claim into spendable QBTC, the holder proves control of their Bitcoin address using a zero-knowledge proof — never revealing the BTC public key on-chain.

The result: a parallel ledger of "Bitcoin balances" secured by post-quantum cryptography, available to every BTC holder, with no fork of Bitcoin and no bridge.

## The two mechanical innovations

QBTC works because of two specific design choices:

### 1. The validator layer uses post-quantum signatures

Every block on QBTC is signed and verified using **ML-DSA** (the NIST-standardized lattice-based signature, formerly known as CRYSTALS-Dilithium, published as **FIPS 204**). This replaces the Ed25519 signatures used by typical proof-of-stake chains, and means that even an adversary with a large-scale quantum computer cannot forge validator signatures or rewrite history.

The chain is built on a fork of CometBFT that adds native ML-DSA support throughout the consensus pipeline.

### 2. Claims use zero-knowledge proofs

To claim QBTC, a Bitcoin holder generates a ZK proof that says, in effect: *"I control the private key for the Bitcoin address that owns this UTXO, and I want my claim delivered to this QBTC address."*

What the proof reveals on-chain:
- The Hash160 (the Bitcoin address) of the UTXO being claimed.
- The destination QBTC address.

What the proof keeps hidden:
- The Bitcoin **public key**.
- The Bitcoin **private key**.
- The ECDSA signature.

This matters because once a Bitcoin public key is broadcast — for example, when you spend from an address — a quantum-capable adversary could derive the private key from it. The ZK proof lets QBTC verify ownership cryptographically without ever exposing the public key on a public network. The migration itself is quantum-safe.

## What QBTC is, technically

- A **Cosmos SDK** application chain with its own validator set, staking, governance, and IBC support.
- Native token: `qbtc`. Bech32 prefix: `qbtc`.
- Consensus: **CometBFT, forked** to use ML-DSA signatures instead of Ed25519.
- One custom module (`x/qbtc`) that handles UTXO mirroring, claim verification, and the rolling claim system.
- A per-validator sidecar process (`bifrost`) that watches a Bitcoin full node and gossips new BTC blocks into QBTC, where they are attested by >2/3 of bonded validator power before being processed.

## How a claim flows, end to end

1. **Genesis snapshot.** At launch, QBTC mirrors the Bitcoin UTXO set at a specific block height. Every UTXO becomes a claim entry in QBTC's state.
2. **Rolling updates.** As Bitcoin produces new blocks, the validator set ingests them and updates QBTC's mirror — new UTXOs become new claims, spent UTXOs are reconciled, and coinbase outputs add new claim entries.
3. **User claims.** A holder runs a quantum-safe wallet, signs a ZK proof for the UTXO they want to claim, and submits it to QBTC.
4. **Verification.** QBTC validators verify three things: the ZK proof is valid for the UTXO, the UTXO has an outstanding claim in QBTC's state, and the destination QBTC address is well-formed.
5. **Release.** The claim is released to the destination QBTC address. The claim entry is deleted from QBTC's state to prevent double-claims. The original Bitcoin UTXO is untouched — it remains on Bitcoin.

The Bitcoin holder can claim at any time. Claims do not expire. Holders can also choose never to claim — the BTC is theirs either way.

## What QBTC is not

- **Not a fork of Bitcoin.** Bitcoin's chain is untouched. QBTC is a separate chain with its own history starting from its own genesis block.
- **Not a bridge or peg.** No Bitcoin is locked anywhere. There is no custodian, no multisig holding BTC, no wrapped representation.
- **Not a rollup or layer-2.** QBTC does not post data or proofs back to Bitcoin. It is a sovereign chain.
- **Not an ICO.** There is no public sale, no presale, no investor allocation, and no team premine. The entire supply is claimable by existing Bitcoin holders.

## Read next

- [The Quantum Threat to Bitcoin](quantum-threat.md) — Why this needs to exist.
- [Why a Parallel Chain](why-parallel-chain.md) — Why a soft fork, hard fork, or bridge doesn't solve this.
- [Architecture Overview](../protocol/architecture.md) — Deeper technical view.
