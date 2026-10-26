---
title: "Roadmap"
description: "QBTC is pre-mainnet. A test network has run since March 2026; mainnet is a fresh genesis, planned for Q4 2026. Component-level status table."
---

QBTC is pre-mainnet. The protocol substrate (post-quantum consensus, ZK-gated claims, the UTXO mirror) runs on a public test network that started in March 2026. The test network may be reset.

**Mainnet: a fresh genesis, planned for Q4 2026.** Mainnet follows after the pre-launch security review closes.

## Component status

| Component | Status |
|---|---|
| Post-quantum consensus (ML-DSA-44 / FIPS 204) | **Built**, in chain code |
| ZK PLONK claim verifier (on-chain) | **Built**, in chain code |
| Bifrost sidecar + ebifrost block ingestion | **Built**, in chain code |
| User claim mechanism (`MsgClaimWithProof`, batch up to 50 UTXOs; P2PKH and P2WPKH outputs) | **Built**, in chain code |
| Reserve Module + validator emission formula | **Built**, in chain code |
| Cosmos `x/gov` governance | **Built**, in chain code |
| Bootstrap seed of the Bitcoin UTXO set (`utxo-indexer`); eligibility is live, with no snapshot date | **Built**, in chain code |
| Governance reclamation of dormant exposed-key BTC | **Built**; each reclaim is enacted by a governance vote |
| Pre-launch security review | **In progress** |

Terminology:

* **Built** — present in the chain code, ships at mainnet.
* **Enacted by a governance vote** — the mechanism is in code, but each use needs an `x/gov` proposal to pass. Each proposal states which outputs it reclaims.

## Governance reclamation of dormant exposed-key BTC

Governance votes can reclaim the QBTC entitlement of Bitcoin outputs that have not moved for more than 17 years and whose public key is visible on chain. The cutoff is a Bitcoin block height written into each proposal. Later votes can move it forward. Each reclaim splits 90 / 5 / 5: 90% to the Reserve, 5% to a development fund and 5% to a marketing fund. The Reserve pays validator and staker rewards. A reclaim does not touch the coins on Bitcoin.

See [Tokenomics](/research/tokenomics) for the full design.

## Open research

* Alternative post-quantum signature schemes as the cryptography landscape evolves.
* Optimizations to the ZK claim circuit (proof size, generation time).
* Support for more Bitcoin address types in the self-claim.

## Out of scope

* **A bridge that locks BTC under a custodian or multisig.** This would reintroduce custodial risk and would itself be quantum-vulnerable. See [Why a Parallel Chain](/learn/why-parallel-chain).
* **A fork of Bitcoin.** Bitcoin's chain is not touched.
* **A change to the 21M supply cap.** The cap holds for all time.
