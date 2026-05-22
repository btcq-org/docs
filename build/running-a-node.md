---
title: "Running a Node"
description: "Running a QBTC validator or full node. (Detailed operator documentation publishes as testnet stabilizes.)"
---

<Info>
**Coming soon.** Detailed node-operator documentation will be published as testnet stabilizes.
</Info>

## What you'll need (high level)

* A machine capable of running `qbtcd` (the chain daemon), `bifrost` (the Bitcoin block-watcher sidecar), and a Bitcoin full node.
* If you want to host proof generation for users, a separate machine with at least 16 GB RAM is recommended for `proof-service`.
* Connectivity to the QBTC P2P network and a Bitcoin full node.

## Binaries

* [`qbtcd`](https://github.com/btcq-org) — chain daemon.
* [`bifrost`](https://github.com/btcq-org) — Bitcoin block watcher (per-validator sidecar).
* [`proof-service`](https://github.com/btcq-org) — remote PLONK prover (optional).
* [`utxo-indexer`](https://github.com/btcq-org) — builds genesis UTXO snapshot.

## See also

* [Architecture](architecture.md), how the binaries fit together.
* [Consensus & Validators](consensus.md), validator economics.
