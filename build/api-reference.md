---
title: "API Reference"
description: "QBTC RPC and gRPC API reference. (Detailed API documentation publishes alongside the public RPC endpoints.)"
---

<Info>
**Coming soon.** Comprehensive API documentation will be published alongside the public RPC endpoints.
</Info>

## Surfaces in scope

* **Chain RPC / REST.** Standard Cosmos SDK and CometBFT endpoints (`/status`, `/abci_info`, `/cosmos/bank/...`, etc.). These behave as documented in the upstream Cosmos SDK docs.
* **QBTC module queries.** Custom queries exposed by `x/qbtc` for UTXO state, claim status, and reserve state.
* **Block explorer.** Web UI at [explorer.qbtc.net](https://explorer.qbtc.net). Transaction / block / address lookup for QBTC.
* **Risk indexer.** Web UI at [indexer.qbtc.net](https://indexer.qbtc.net). A separate service exposing aggregate stats about Bitcoin's quantum-vulnerable UTXO surface (`/stats/overview`, `/address/stats`, etc.), broken down by script type.

## Sources

* Chain proto definitions: `proto/qbtc/qbtc/v1/` in the [chain repo](https://github.com/btcq-org).
* Standard Cosmos SDK API docs: [docs.cosmos.network](https://docs.cosmos.network/).
