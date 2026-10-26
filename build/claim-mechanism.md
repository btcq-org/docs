---
title: "Claim Mechanism"
description: "How a BTC holder converts their QBTC entitlement into spendable QBTC: ZK proof of ownership, batch claims up to 50 UTXOs, taint propagation rules."
---

The claim mechanism is how a Bitcoin holder converts their QBTC entitlement into spendable QBTC. Everything described here is implemented in `x/qbtc` in the chain code.

## What's in QBTC's state

The chain loads a bootstrap seed of the Bitcoin UTXO set (`genesis-954355.bin`). Eligibility is live with no snapshot date: whoever controls an eligible unspent output at claim time can claim it. For every tracked UTXO, QBTC stores a claim entry that includes:

* The Bitcoin Hash160 (the 20-byte address hash).
* The UTXO's BTC amount, scaled 1:1 to QBTC.
* An `EntitledAmount` field, initially set to the claim amount and decremented to 0 when claimed.

As new Bitcoin blocks are ingested via `ebifrost` (see [Architecture](/build/architecture)), the mirror updates:

* New UTXOs add new claim entries.
* Spent UTXOs are reconciled.
* Coinbase outputs add new claim entries; Bitcoin miners receive a corresponding QBTC claim.

## Supported today

* **Address types:** P2PKH (`1…`) and P2WPKH (`bc1q…`). Other address types cannot self-claim today.
* **Confirmations:** a new output needs 144 Bitcoin confirmations (about one day) before it can claim.

## The proof

To claim, a holder submits a `MsgClaimWithProof` transaction containing:

* A **PLONK zero-knowledge proof** of ownership of a Bitcoin address.
* The list of UTXOs to claim, up to **50 UTXOs per transaction**.
* A destination QBTC address.

The proof's public inputs (revealed on-chain):

* Hash160 of the Bitcoin address being claimed.
* The destination QBTC address.

The proof's hidden inputs (not published on chain):

* The Bitcoin public key.
* An ECDSA signature.

The chain verifies control of the address. The Bitcoin public key does not go on chain.

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

Propagation makes governance reclamation (see [Tokenomics](/research/tokenomics)) permanent: once governance reclaims a UTXO, the Bitcoin holder cannot recover the QBTC entitlement by spending the UTXO to a new address.

## What claims do not do

* Claims do not move BTC. Your Bitcoin remains on the Bitcoin chain after claiming.
* Claims have no expiry date. Governance can reclaim long-dormant outputs whose public key is already visible on Bitcoin (see [Tokenomics](/research/tokenomics)).
* Claims do not require any prior registration.

## Proof generation

The wallet signs a digest with the Bitcoin key and sends the signature to a proving service. The service builds the zero-knowledge proof and broadcasts the claim. The Bitcoin public key never goes on chain. The private key stays in the wallet.

## References

* `x/qbtc/keeper/handle_msg_claim_with_proof.go`: handler logic.
* `x/qbtc/zk/`: PLONK circuit definition.
* `proto/qbtc/qbtc/v1/msg_claim_with_proof.proto`: message format.
* [Protocol Specification §2.3, §2.4](/research/protocol-spec).
