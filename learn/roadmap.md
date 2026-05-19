# Roadmap

QBTC is pre-mainnet. The substance of the protocol (post-quantum consensus, ZK-gated claims, the UTXO mirror) is implemented. Features that build on top (a native liquidity pool, liquid staking) activate as adoption grows.

## What is built (v1)

These are present in the chain code and will ship with mainnet.

* **Post-quantum consensus** using ML-DSA (Dilithium / FIPS 204) via a forked CometBFT.
* **Cosmos SDK base** with standard modules: staking, distribution, governance, IBC, CosmWasm, and others.
* **One custom module (`x/qbtc`)** for UTXO mirroring, claims, and the ZK verifier.
* **Bifrost sidecar** for ingesting Bitcoin blocks under Byzantine-fault-tolerant attestation by validators.
* **ZK PLONK claim verifier** on-chain.
* **Batch claims** of up to 50 UTXOs per transaction via `MsgClaimWithProof`.
* **Reserve Module + validator emission.** The Reserve Module is funded by governance reclamation of dormant exposed-key BTC UTXOs and drained per-block to validators via the `EmissionCurve` and `BlocksPerYear` parameters. No inflationary minting.
* **Genesis UTXO snapshot** built by `utxo-indexer` from a Bitcoin node.
* **Vanilla Cosmos `x/gov`** for governance.

## Governance-activated (part of v1 tokenomics)

* **Reclamation of dormant exposed-key BTC UTXOs into the Reserve Module.** This is a structural part of QBTC's tokenomic design: QBTC entitlements attached to quantum-vulnerable dormant Bitcoin UTXOs (P2PK outputs and reused-address outputs older than 17 years) are reclaimed from the claim mirror and credited to the Reserve Module, sustaining validator emission and removing the value from vulnerable circulation. The mechanism is activated through standard `x/gov` proposals after mainnet rather than enforced by chain rules, so the validator set can set the activation parameters (categories, cutoffs, dispute windows) without forking the code. See [Tokenomics](../research/tokenomics.md) for the full design.

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

## Out of scope

The following are not on the QBTC roadmap.

* **A bridge that locks BTC under a custodian or multisig.** This would reintroduce custodial risk and would itself be quantum-vulnerable. See [Why a Parallel Chain](why-parallel-chain.md).
* **A fork of Bitcoin.** Bitcoin's chain is not touched.
* **A change to the 21M supply cap.** The cap holds for all time.
* **Retroactive airdrops** to wallets that did specific things to qualify. Entitlement is determined by holding BTC, not by performing actions QBTC rewards.

