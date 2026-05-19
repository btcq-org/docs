# Roadmap

This page is an honest accounting of what is in the QBTC chain code today, what is specified but not yet enforced, and what is a longer-term vision.

We are pre-mainnet. The substance of the protocol (post-quantum consensus, ZK-gated claims, the genesis UTXO mirror) is implemented. The features that build on top (a native liquidity pool, liquid staking, etc.) will activate as adoption grows.

## What is built (v1)

These are present in the chain code and will ship with mainnet.

* **Post-quantum consensus** using ML-DSA (Dilithium / FIPS 204) via a forked CometBFT.
* **Cosmos SDK base** with standard modules: staking, distribution, governance, IBC, CosmWasm, and others.
* **One custom module (`x/qbtc`)** for UTXO mirroring, claims, and the ZK verifier.
* **Bifrost sidecar** for ingesting Bitcoin blocks under Byzantine-fault-tolerant attestation by validators.
* **ZK PLONK claim verifier** on-chain.
* **Batch claims** of up to 50 UTXOs per transaction via `MsgClaimWithProof`.
* **Reserve-funded validator emission**, drawing from a pre-allocated reserve via `EmissionCurve` and `BlocksPerYear` parameters. No inflationary minting.
* **Genesis UTXO snapshot** built by `utxo-indexer` from a Bitcoin node.
* **Vanilla Cosmos `x/gov`** for governance.

## What is specified, governance-driven

These are described in the QBTC specification and will be activated via on-chain governance after mainnet, not enforced in the v1 chain code.

* **Re-mining of dormant quantum-vulnerable UTXOs older than 17 years.** The QBTC entitlement of such UTXOs will be redirected into the validator reward pool, on the principle that those coins would otherwise be the first stolen by a quantum-capable attacker on Bitcoin Legacy. Implemented via governance proposals once mainnet is established.

## What is planned, post-MVP

These are part of QBTC's design vision but not in the v1 code or the immediate v1 governance roadmap. They become relevant as QBTC accumulates network adoption.

* **Native liquidity pool** for BTC ↔ QBTC swaps, on a model similar to THORChain's XYK pool.
* **Cross-chain threshold-signature vault** (DKLS24-style MPC) so the validator set can custody Bitcoin without trusted bridges.
* **Liquid staking**.
* **Streaming swaps** and pool-bonded validator economics.

These will arrive when there is sufficient claim-derived QBTC float and validator economic alignment to support them safely. They will be opened via governance, not by the team unilaterally.

## What is being researched, longer term

Open research questions that will inform future protocol upgrades.

* Alternative post-quantum signature schemes as the cryptography landscape evolves.
* Optimizations to the ZK claim circuit (proof size, generation time).
* Cross-chain interactions with other quantum-safe ecosystems.

## What is explicitly out of scope

To set expectations clearly, the following are not on the QBTC roadmap.

* **A bridge that locks BTC under a custodian or multisig.** This would reintroduce custodial risk and would itself be quantum-vulnerable. See [Why a Parallel Chain](why-parallel-chain.md).
* **A fork of Bitcoin.** Bitcoin's chain is not touched.
* **A change to the 21M supply cap.** The cap holds for all time.
* **Retroactive airdrops** to wallets that did specific things to qualify. Entitlement is determined by holding BTC, not by performing actions QBTC rewards.

## Status, in one line

The protocol substrate is real. The economic and DeFi features are deliberately staged: they activate when the network is large enough to support them, not before.
