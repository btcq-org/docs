---
title: "Security Model"
description: "QBTC's three independent security foundations: post-quantum consensus, ZK claim proofs, and Bitcoin's own UTXO state. Plus the trust boundaries and failure modes."
---

QBTC's security rests on three independent foundations. A compromise in any one of them does not automatically compromise the others.

## 1. Post-quantum consensus

Every validator vote, every block-commit signature, every consensus message is signed with ML-DSA (FIPS 204). ML-DSA is designed to resist signature forgery by a quantum-capable adversary. See [Quantum Resistance (ML-DSA)](/build/quantum-resistance).

**Trust assumption:** ML-DSA-44 (NIST security category 2) is believed secure against both classical and quantum adversaries. This rests on the hardness of lattice problems, which has been the standard post-quantum assumption for over a decade and survived NIST's multi-year PQC standardization process.

## 2. ZK-gated claims

A claim is only accepted if the submitted PLONK proof verifies. The proof attests that the claimant controls a Bitcoin private key whose public-key Hash160 matches the claimed UTXO. The public key does not go on chain.

**Trust assumption:** PLONK's soundness rests on the discrete log assumption over a pairing-friendly elliptic curve, a pre-quantum assumption. For the lifetime of the migration window, a quantum attacker who can break the ZK proof can also derive the Bitcoin private key directly, so ZK soundness is not the bottleneck. Migration to a fully post-quantum SNARK is on the long-term research agenda.

## 3. Bitcoin attestation by 2/3+ of validators

Bitcoin blocks are not trusted from a single oracle. Each validator's `bifrost` independently watches Bitcoin, signs the block it sees with its ML-DSA consensus key, and gossips. The `ebifrost` module accepts a block only after more than 2/3 of bonded validator power has attested.

**Trust assumption:** At any given time, more than 1/3 of bonded validator power is honest. Standard Byzantine fault tolerance.

## Threat model

| Threat | Defense |
|---|---|
| Validator double-spends | `x/slashing` for double-signing. Standard Cosmos. |
| Validator collusion (>1/3) | Acceptable byzantine fraction is bounded by stake distribution. Slashing makes collusion economically expensive. |
| Quantum forgery of validator signatures | ML-DSA. |
| Quantum forgery of Bitcoin signatures during a claim | The BTC public key is a hidden input to the proof. It never goes on chain. |
| Double-claim of the same UTXO | `EntitledAmount` set to 0 after claim. Subsequent attempts fail. |
| Replay of a valid proof against a different destination | Destination address is a public input bound into the proof. A different destination produces a different proof. |
| Proving-service operator | The wallet signs a digest with the Bitcoin key and sends the signature to a proving service. The service builds the proof and broadcasts the claim. The service receives the signature, not the private key. |
| Quantum forgery of account signatures | Only ML-DSA accounts have post-quantum protection. Accounts can also use secp256k1, ed25519 or multisig keys. |
| Stolen or compromised user wallet | Same as Bitcoin: control of the BTC private key equals control of the claim. |
| Front-running of a claim transaction | Standard Cosmos mempool. Claims are not high-MEV (the same UTXO can only be claimed by the holder of the matching key). |

## Known weaknesses

* **PLONK is not post-quantum.** Bounded by Bitcoin's own pre-quantum nature. Migration to a fully post-quantum SNARK is a research direction.
* **Claims use a proving service today.** The holder relies on the service to build the proof and broadcast the claim.
* **Account keys are not all post-quantum.** Accounts that use secp256k1, ed25519 or multisig keys do not have post-quantum protection.
* **The bifrost design assumes honest majority for Bitcoin block ingestion.** Ingestion needs attestations from more than 2/3 of bonded validator power. Validators above that threshold acting together could feed a false Bitcoin block. Slashing applies, but only after detection.

## Security review

A pre-launch security review is in progress. Mainnet follows after it closes.

## See also

* [Quantum Risk Assessment](/research/quantum-risk-assessment)
* [Protocol Specification](/research/protocol-spec)
