---
title: "Claim Mechanism"
description: "How a BTC holder converts their QBTC entitlement into spendable QBTC: ZK proof of ownership, batch claims up to 50 UTXOs, taint propagation rules."
---

The claim mechanism is how a Bitcoin holder converts their QBTC entitlement into spendable QBTC. Everything described here is implemented in `x/qbtc` in the chain code.

## What's in QBTC's state

At genesis, the chain ingests a snapshot of the Bitcoin UTXO set. For every UTXO at the reference height, QBTC stores a claim entry that includes:

* The Bitcoin Hash160 (the 20-byte address hash).
* The UTXO's BTC amount, scaled 1:1 to QBTC.
* An `EntitledAmount` field, initially set to the claim amount and decremented to 0 when claimed.

As new Bitcoin blocks are ingested via `ebifrost` (see [Architecture](architecture.md)), the mirror updates:

* New UTXOs add new claim entries.
* Spent UTXOs are reconciled.
* Coinbase outputs add new claim entries; Bitcoin miners receive a corresponding QBTC claim.

## The proof

To claim, a holder submits a `MsgClaimWithProof` transaction containing:

* A **PLONK zero-knowledge proof** of ownership of a Bitcoin address.
* The list of UTXOs to claim, up to **50 UTXOs per transaction**.
* A destination QBTC address.

The proof's public inputs (revealed on-chain):

* Hash160 of the Bitcoin address being claimed.
* The destination QBTC address.

The proof's hidden inputs (kept secret):

* The Bitcoin public key.
* The Bitcoin private key.
* An ECDSA signature.

The chain verifies ownership without the public key ever being broadcast. This is what keeps the claim itself quantum-safe.

## Validator handling

When a validator receives a `MsgClaimWithProof`, the handler (`x/qbtc/keeper/handle_msg_claim_with_proof.go`) executes:

1. **Proof verification.** The on-chain PLONK verifier checks the proof against the public inputs.
2. **For each claimed UTXO:**
   * Verify the UTXO exists in QBTC's state.
   * Verify its `EntitledAmount > 0` (not previously claimed).
   * Verify the UTXO's stored Hash160 matches the proven address.
3. **Atomic disbursement.** If any check fails, the entire batch reverts (cache-context semantics). If all pass, the cumulative `EntitledAmount` is transferred to the destination, and each claimed UTXO's `EntitledAmount` is set to 0.

## Double-claim prevention and taint propagation

A claimed UTXO has `EntitledAmount == 0`. Any subsequent attempt to claim it fails at step 2 of validator handling.

The claimed status also propagates through Bitcoin spends. When the `ebifrost` module ingests a new Bitcoin block, any transaction whose inputs include claimed UTXOs carries the claimed status to its outputs in proportion to the value contributed by claimed inputs. A child of a fully-claimed parent has `EntitledAmount = 0` and cannot be claimed. A child of a partially-claimed set of parents inherits a proportionally-reduced `EntitledAmount`.

Propagation makes governance reclamation (see [Tokenomics](../research/tokenomics.md)) permanent: once a UTXO is reclaimed into the Reserve Module, the Bitcoin holder cannot recover the QBTC entitlement by spending the UTXO to a new address.

## What claims do not do

* Claims do not move BTC. Your Bitcoin remains on the Bitcoin chain after claiming.
* Claims do not expire. An unclaimed entry sits in QBTC's state indefinitely.
* Claims do not require any prior registration.

## Proof generation

Proofs are generated client-side. Two paths exist:

* **Native wallet flow.** An established multi-chain MPC wallet partner is implementing native ML-DSA signing and ZK claim-proof generation, with rollout planned at mainnet. Users see claiming as a normal in-wallet action. The partner will be named ahead of launch.
* **Hosted proof service.** Independent operators run `proof-service` HTTP endpoints that wallets can use to offload computation on constrained devices. Multiple operators run these so users can choose.
* **Local CLI prover.** `zkprover` lets advanced users generate proofs themselves.

Proof inputs (including private key material) are constructed locally. The proof service computes only the cryptographic output and cannot forge claims against UTXOs whose keys it has not seen.

On the chain side, verification takes ~2–5 ms per proof (proof size ~1 KB), so claims clear quickly.

## References

* `x/qbtc/keeper/handle_msg_claim_with_proof.go`: handler logic.
* `x/qbtc/zk/`: PLONK circuit definition.
* `proto/qbtc/qbtc/v1/msg_claim_with_proof.proto`: message format.
* [Protocol Specification §2.3, §2.4](../research/protocol-spec.md).
