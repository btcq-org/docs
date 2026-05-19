# API Reference

{% hint style="info" %}
**Coming soon.** Comprehensive API documentation will be published alongside the public RPC endpoints.
{% endhint %}

## Surfaces in scope

* **Chain RPC / REST.** Standard Cosmos SDK and CometBFT endpoints (`/status`, `/abci_info`, `/cosmos/bank/...`, etc.). These behave as documented in the upstream Cosmos SDK docs.
* **QBTC module queries.** Custom queries exposed by `x/qbtc` for UTXO state, claim status, and reserve state.
* **Risk indexer.** A separate service exposing aggregate stats about Bitcoin's quantum-vulnerable UTXO surface (`/stats/overview`, `/address/stats`, etc.).

## Sources

* Chain proto definitions: `proto/qbtc/qbtc/v1/` in the [chain repo](https://github.com/btcq-org).
* Standard Cosmos SDK API docs: [docs.cosmos.network](https://docs.cosmos.network/).
