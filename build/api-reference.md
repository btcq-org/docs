---
title: "API Reference"
description: "QBTC developer APIs: the Bitcoin risk indexer (api.qbtc.net, indexes real Bitcoin) and the QBTC chain REST gateway (current public testnet)."
---

QBTC exposes two HTTP surfaces a developer will use:

* **The Bitcoin risk indexer** (`https://api.qbtc.net`) — indexes the **real Bitcoin UTXO set** (the claimable universe). Its data is valid for mainnet planning today.
* **The QBTC chain** — standard Cosmos SDK REST/gRPC. The hosted gateway below points at the **current public testnet** and will change when mainnet relaunches.

<Info>
**Testnet vs. mainnet.** The Bitcoin indexer reflects real Bitcoin and is stable. The **chain** endpoints are a private testnet (chain ID `qbtc`, started 2026-03-14): the host, chain ID, and on-chain state (currently ~150 QBTC supply, empty Reserve) all change at mainnet relaunch. Treat chain endpoints as illustrative, not durable.
</Info>

## Bitcoin risk indexer — `https://api.qbtc.net`

A FastAPI service that indexes Bitcoin's UTXO set and classifies it by script type and address reuse. The SPA at [indexer.qbtc.net](https://indexer.qbtc.net) is a viewer over this API. The full machine-readable spec is at [`/openapi.json`](https://api.qbtc.net/openapi.json).

| Endpoint | Params | Returns |
|---|---|---|
| `/stats/supply` | — | `total_supply_sat` and `script_type_balances` (per-type total value). **Reliable.** |
| `/address/stats` | — | Per-script-type aggregate: `count`, `reused_count`, `total_sat`, `reused_sat`. **Reliable count source.** |
| `/stats/overview` | — | `utxo_count`, `scanned_blocks`, `latest_block`, `script_type_counts`. ⚠️ Counts are partial mid-scan — see caveat below. |
| `/address/status` | `script_type, reused, address, limit, offset` | Address list filtered by type / reuse. |
| `/address` | `q` | UTXO stats for a single address. |
| `/search` | `q` | Search by address / txid. |
| `/latest/utxos` | `limit, spent` | UTXO objects (fields below). |
| `/latest/blocks` | `limit` | Recent blocks. |
| `/latest/addresses` | `limit` | Recent addresses. |

### Example: the vulnerable-set breakdown

```bash
curl -s "https://api.qbtc.net/address/stats" \
  | jq '.results[] | select(.script_pub_type=="P2PK")'
```

```json
{
  "script_pub_type": "P2PK",
  "count": 217095,
  "reused_count": 179779,
  "total_sat": 170470366295595,
  "reused_sat": -1130072757777
}
```

`P2PK` outputs put the public key permanently on-chain, so the whole cohort (~217k scripts, ~1.70M BTC) is quantum-exposed. Reused `P2PKH` / `P2WPKH` addresses (where the public key has been revealed by a prior spend) add several million BTC more. See [The Quantum Threat](/learn/quantum-threat) and [Quantum Risk Assessment](/research/quantum-risk-assessment) for how these map to QBTC's claim and governance-reclamation paths.

### Example: a UTXO record

```bash
curl -s "https://api.qbtc.net/latest/utxos?limit=1" | jq '.results[0]'
```

```json
{
  "txid": "0e4f5c88...94b0b07b",
  "vout": 0,
  "address": "bc1q4vzcl3ren300gk7hw2wl8gk63a9k5gh9mt48g2",
  "value_sat": 149648,
  "script_pub_type": "P2WPKH",
  "created_block": 954582,
  "created_block_timestamp": 1781978285000000000,
  "spent": false
}
```

### Data-quality notes

* **Use `/address/stats` and `/stats/supply` for numbers.** The `/stats/overview` `script_type_counts` are inconsistent mid-scan (it can report `P2PK: 24`), and `utxo_count` overcounts. Treat overview counts as order-of-magnitude only.
* **`reused_sat` for P2PK is negative** — a known aggregation bug. The `count`, `reused_count`, and `total_sat` fields are sound.
* **`count` is an address/script count, not a UTXO count.** A reused script maps to multiple UTXOs, so the P2PK *UTXO* count is ≥ the reported `count`.
* **There is no dormant / age-filter endpoint.** The ">17-year exposed-key" selection that feeds a governance reclamation proposal is an off-chain query over `script_pub_type` + `created_block` age, not an API call.

## QBTC chain access

For production integrations, **run your own node** and query its local Cosmos SDK REST (`:1317`) and gRPC (`:9090`) — see [Running a Node](/build/running-a-node). Your node's chain ID is whatever the genesis declares (currently `qbtc`).

For quick reads against the current public testnet without standing up a node, a hosted Cosmos REST gateway is available:

```
https://api.vultisig.com/qbtc-rpc
```

### Routing quirk: only standard Cosmos REST is proxied

The gateway forwards **standard Cosmos SDK module queries under `/cosmos/...`** and nothing else:

| Request | Result |
|---|---|
| `…/qbtc-rpc/cosmos/base/tendermint/v1beta1/blocks/latest` | ✅ works |
| `…/qbtc-rpc/cosmos/bank/v1beta1/supply` | ✅ works |
| `…/qbtc-rpc/status`, `/block`, `/abci_info` (CometBFT RPC) | ❌ `Not Implemented` |
| `…/qbtc-rpc/qbtc/qbtc/v1/params` (custom `x/qbtc` routes) | ❌ `Not Implemented` |
| `…/qbtc-node/cosmos/...` | ❌ `404` |

CometBFT RPC methods and the custom `x/qbtc` module routes are **not** exposed through this gateway. To read them, query your own node directly, or read the constants from source (next section).

### Example: chain tip and supply

```bash
# Latest block (height, time, chain_id)
curl -s "https://api.vultisig.com/qbtc-rpc/cosmos/base/tendermint/v1beta1/blocks/latest" \
  | jq '.block.header | {height, time, chain_id}'
# → {"height":"61602","time":"2026-06-23T10:58:37Z","chain_id":"qbtc"}

# Total supply (base units; 1 QBTC = 100,000,000)
curl -s "https://api.vultisig.com/qbtc-rpc/cosmos/bank/v1beta1/supply" | jq '.supply'
# → [{"denom":"qbtc","amount":"15000104396"}]   (~150 QBTC; Reserve still empty)
```

### Chain parameters (read from source)

The custom `x/qbtc` parameters are not served by the public gateway. The canonical values live in [`constants/constants.go`](https://github.com/btcq-org/qbtc/blob/main/constants/constants.go):

| Constant | Value | Meaning |
|---|---|---|
| `EmissionCurve` | `5` | Divisor in the per-block Reserve release. See [Tokenomics](/research/tokenomics). |
| `BlocksPerYear` | `5,256,000` | `10 × 60 × 24 × 365` (10 blocks/min). |
| `MinUtxoConfirmationBlocks` | `144` | Bitcoin confirmations (~1 day) before a UTXO is claimable. |
| `ClaimWithProofDisabled` | `0` | Claim kill-switch (0 = claims enabled). |

## See also

* [Architecture](/build/architecture), how the chain and indexer fit together.
* [Claim Mechanism](/build/claim-mechanism), the claim message and proof flow.
* [Running a Node](/build/running-a-node), to expose your own REST/gRPC.
* [Chain repository](https://github.com/btcq-org/qbtc), the source of truth.
