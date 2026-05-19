# Consensus & Validators

QBTC consensus is **CometBFT, forked** to use ML-DSA signatures instead of Ed25519. The economic layer is standard Cosmos `x/staking` and `x/distribution`. The only QBTC-specific consensus addition is the `ebifrost` module's handling of attested Bitcoin block ingestion.

## Consensus engine

The chain depends on `github.com/btcq-org/cometbft`, a fork of CometBFT that replaces Ed25519 with ML-DSA throughout the consensus signing path. See [Quantum Resistance (ML-DSA)](quantum-resistance.md) for details.

## Validator set

Validators bond QBTC via the standard Cosmos `x/staking` module. The validator set is selected by bonded stake, with the maximum size and slashing parameters configured at genesis.

* **Bonding**: standard `x/staking` semantics.
* **Slashing**: standard `x/slashing` for double-signing and downtime.
* **Unbonding period**: parameter at genesis (typically 21 days for Cosmos chains; final value TBD before mainnet).
* **Validator consensus key**: ML-DSA.
* **Validator operator key**: standard Cosmos signing curve.

## Validator responsibilities

In addition to standard Cosmos validator duties, QBTC validators also:

1. **Run a `bifrost` sidecar** that watches a Bitcoin full node and gossips signed BTC blocks to peers. See [Architecture](architecture.md) for the data flow.
2. **Attest to ingested BTC blocks**. The `ebifrost` module aggregates these attestations; a block is ingested into QBTC state once more than 2/3 of bonded validator power has attested.

## Validator rewards

Validators earn from a **pre-allocated reserve** drawn down per the chain's emission formula, plus transaction fees. There is no inflationary minting. See [Tokenomics](../research/tokenomics.md) and the [Protocol Specification (v1) §2.5](../research/protocol-spec.md).

## Governance

Standard Cosmos `x/gov`. Proposals follow the standard voting period, deposit requirements, and threshold rules. No custom QBTC governance logic.

## What is not here

* No pool-bonded validator economics in v1. Validators bond QBTC, not liquidity-pool units. See [Vision & Roadmap](../research/vision-and-roadmap.md) for the post-MVP design.
* No age-weighted voting, depth-gated proposals, or three-layer governance. Standard `x/gov` only.

## Read next

* [Architecture](architecture.md), the system-level view.
* [Quantum Resistance (ML-DSA)](quantum-resistance.md).
* [Protocol Specification (v1)](../research/protocol-spec.md).
