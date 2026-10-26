---
title: "Quantum Resistance (ML-DSA)"
description: "QBTC's two-layer post-quantum design: ML-DSA (NIST FIPS 204) at consensus, and PLONK zero-knowledge proofs at the claim layer."
---

QBTC uses post-quantum and zero-knowledge techniques on two layers of the chain.

## At the consensus layer: ML-DSA

The chain's consensus signing path uses **ML-DSA** (Module-Lattice-Based Digital Signature Algorithm), formerly known as CRYSTALS-Dilithium, standardized by NIST as **FIPS 204**.

Every validator's consensus key is an ML-DSA key. Every consensus vote, every block-commit signature, every gossip message is signed with ML-DSA. There is no ECDSA or Ed25519 dependency anywhere in the consensus path.

Implemented via a fork of CometBFT at `github.com/btcq-org/cometbft`, which adds a `crypto/mldsa` package and routes signing through it.

If validators signed with Ed25519, a quantum-capable adversary could forge a validator signature and rewrite chain history. ML-DSA is lattice-based and is believed secure against known classical and quantum attacks. QBTC uses the ML-DSA-44 parameter set (NIST security category 2).

### Size and bandwidth

ML-DSA signatures are larger than Ed25519:

* ML-DSA-44 signature: 2420 bytes (~2.4 KB).
* ML-DSA-44 public key: 1312 bytes (~1.3 KB).
* Ed25519 signature: 64 bytes.
* Ed25519 public key: 32 bytes.

Block size and bandwidth costs are higher accordingly. The chain absorbs the cost as part of the design.

## At the claim layer: ZK proofs

A claim carries a zero-knowledge proof of control of a Bitcoin address. The Bitcoin public key does not go on chain. Once a Bitcoin public key is broadcast (during a normal spend, for example), it becomes a target for Shor's algorithm.

The proof system is **PLONK**, a SNARK-style construction. The circuit verifies:

* A valid ECDSA signature by a Bitcoin key.
* That the corresponding public key hashes (via Hash160) to a specific Bitcoin address.
* Binding to a specific destination QBTC address (so a proof can't be replayed against a different destination).

Public inputs (revealed on-chain):

* Hash160 of the Bitcoin address.
* Destination QBTC address.

Hidden inputs (not published on chain):

* Bitcoin public key.
* ECDSA signature.

### Proof generation

The wallet signs a digest with the Bitcoin key and sends the signature to a proving service. The service builds the zero-knowledge proof and broadcasts the claim. The Bitcoin public key never goes on chain. See [Claim Mechanism](/build/claim-mechanism) for the supported address types.

## Why both layers

Each layer covers a different risk. If only consensus used ML-DSA, a claim that published your BTC public key would expose that key to a quantum attacker. If only claims used ZK, a quantum attacker could forge validator signatures and rewrite the chain.

Accounts on QBTC can also use secp256k1, ed25519 or multisig keys. Post-quantum protection applies only to accounts that use ML-DSA keys.

## References

* NIST FIPS 204: ML-DSA specification.
* `github.com/btcq-org/cometbft`: the forked CometBFT.
* `x/qbtc/zk/`: PLONK circuits and on-chain verifier in the chain code.
* [Protocol Specification §1, §2.3](/research/protocol-spec).
