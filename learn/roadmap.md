# Roadmap

QBTC is pre-mainnet. The protocol substrate (post-quantum consensus, ZK-gated claims, the UTXO mirror) is implemented and undergoing testing.

**Mainnet target: Q3 2026.**

## Component status

| Component | Status |
|---|---|
| Post-quantum consensus (ML-DSA / FIPS 204) | **Built**, in chain code |
| ZK PLONK claim verifier (on-chain) | **Built**, in chain code |
| Bifrost sidecar + ebifrost block ingestion | **Built**, in chain code |
| User claim mechanism (`MsgClaimWithProof`, batch up to 50 UTXOs) | **Built**, in chain code |
| Reserve Module + validator emission formula | **Built**, in chain code |
| Cosmos `x/gov` governance | **Built**, in chain code |
| Genesis UTXO snapshot (`utxo-indexer`) | **Built**, in chain code |
| Governance reclamation of dormant exposed-key BTC into Reserve | **Activated via governance** after mainnet |

Terminology:

* **Built** — present in the chain code, ships at mainnet.
* **Activated via governance** — the mechanism is part of QBTC's tokenomics but is enacted through `x/gov` proposals after mainnet rather than enforced by automatic chain rules. The validator set sets the activation parameters (UTXO categories, cutoffs, dispute windows) through governance.

## Governance reclamation of dormant exposed-key BTC

QBTC entitlements attached to quantum-vulnerable dormant Bitcoin UTXOs (P2PK outputs and reused-address outputs older than 17 years) are reclaimed from the claim mirror and credited to the Reserve Module on a roughly two-week voting cadence. This sustains validator emission and removes value from vulnerable circulation, redistributing it to a quantum-safe address.

See [Tokenomics](../research/tokenomics.md) for the full design.

## Open research

* Alternative post-quantum signature schemes as the cryptography landscape evolves.
* Optimizations to the ZK claim circuit (proof size, generation time).
* Cross-chain interactions with other quantum-safe ecosystems.

## Out of scope

* **A bridge that locks BTC under a custodian or multisig.** This would reintroduce custodial risk and would itself be quantum-vulnerable. See [Why a Parallel Chain](why-parallel-chain.md).
* **A fork of Bitcoin.** Bitcoin's chain is not touched.
* **A change to the 21M supply cap.** The cap holds for all time.
