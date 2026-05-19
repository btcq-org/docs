# Roadmap

QBTC is pre-mainnet. The protocol substrate (post-quantum consensus, ZK-gated claims, the UTXO mirror) is implemented. Features that build on top (a native liquidity pool, liquid staking) activate as adoption grows.

## Status, at a glance

| Component | Status |
|---|---|
| Post-quantum consensus (ML-DSA / FIPS 204) | **Built**, in chain code |
| ZK PLONK claim verifier (on-chain) | **Built**, in chain code |
| Bifrost sidecar + ebifrost block ingestion | **Built**, in chain code |
| User claim mechanism (`MsgClaimWithProof`, batch up to 50 UTXOs) | **Built**, in chain code |
| Reserve Module + validator emission formula | **Built**, in chain code |
| Vanilla Cosmos `x/gov` governance | **Built**, in chain code |
| Genesis UTXO snapshot (`utxo-indexer`) | **Built**, in chain code |
| Governance reclamation of dormant exposed-key BTC into Reserve | **Activated via governance** after mainnet (part of v1 tokenomics) |
| Native BTC ↔ QBTC liquidity pool | **Post-MVP** (not in v1) |
| Cross-chain threshold-signature vault | **Post-MVP** (not in v1) |
| Liquid staking | **Post-MVP** (not in v1) |
| Streaming swaps, pool-bonded validator economics | **Post-MVP** (not in v1) |

Terminology:

* **Built** — present in the v1 chain code, ships at mainnet.
* **Activated via governance** — the mechanism is part of v1 tokenomics but is enacted through `x/gov` proposals after mainnet rather than enforced by chain rules. This is intentional: it lets the validator set set the activation parameters without forking the code.
* **Post-MVP** — part of the design vision, not in v1. Activated through governance once the network has the participants and float to support it.

## What ships at mainnet

The eight "Built" items above. Read [Architecture](../build/architecture.md) for the system layout and [Protocol Specification (v1)](../research/protocol-spec.md) for the canonical reference.

## Governance reclamation of dormant exposed-key BTC

QBTC entitlements attached to quantum-vulnerable dormant Bitcoin UTXOs (P2PK outputs and reused-address outputs older than 17 years) are reclaimed from the claim mirror and credited to the Reserve Module, sustaining validator emission and removing value from vulnerable circulation.

The mechanism is activated through standard `x/gov` proposals on a roughly two-week voting cadence. Validators set the activation parameters (UTXO categories, cutoffs, dispute windows) through governance rather than chain forks.

See [Tokenomics](../research/tokenomics.md) for the full design.

## Post-MVP features

* **Native liquidity pool** for BTC ↔ QBTC swaps, on a model similar to THORChain's XYK pool.
* **Cross-chain threshold-signature vault** (DKLS24-style MPC) so the validator set can custody Bitcoin without trusted bridges.
* **Liquid staking**.
* **Streaming swaps** and pool-bonded validator economics.

These arrive when there is sufficient claim-derived QBTC float and validator economic alignment to support them safely. They open via governance, not by the team unilaterally.

## Open research

* Alternative post-quantum signature schemes as the cryptography landscape evolves.
* Optimizations to the ZK claim circuit (proof size, generation time).
* Cross-chain interactions with other quantum-safe ecosystems.

## Out of scope

* **A bridge that locks BTC under a custodian or multisig.** This would reintroduce custodial risk and would itself be quantum-vulnerable. See [Why a Parallel Chain](why-parallel-chain.md).
* **A fork of Bitcoin.** Bitcoin's chain is not touched.
* **A change to the 21M supply cap.** The cap holds for all time.
* **Retroactive airdrops** to wallets that performed specific actions to qualify. Entitlement is determined by holding BTC, not by performing actions QBTC rewards.
