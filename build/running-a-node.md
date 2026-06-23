---
title: "Running a Node"
description: "Run a QBTC node: one-line install of qbtcd + bifrost, genesis download, Bitcoin RPC configuration, and systemd startup. Testnet."
---

<Info>
**Testnet.** QBTC is pre-mainnet (targeting Q3 2026). The instructions below stand up a node against the current public **testnet**. Endpoints, the chain ID, and the pinned version change as the testnet progresses — always cross-check the [chain repository](https://github.com/btcq-org/qbtc) for the latest values.
</Info>

A QBTC node runs two processes side by side:

* **`qbtcd`** — the chain daemon (Cosmos SDK + the ML-DSA CometBFT fork). This is the node.
* **`bifrost`** — the sidecar that connects to a Bitcoin full node, watches for new Bitcoin blocks, and relays them to the chain. See [Architecture](/build/architecture) for how the two fit together.

You also need access to a **Bitcoin full node** (for `bifrost` to read blocks from). It can run on the same machine or a separate one.

## Prerequisites

* A Linux host (the installer targets `linux-amd64` release binaries and `systemd`).
* `curl`, `tar`, `sudo`, `sha256sum`, and `systemctl` available on the host.
* A reachable Bitcoin full node with RPC enabled (host, port, RPC username, and password).
* For building from source instead of using release binaries: **Go 1.22+** and **Make**.

## Quick install (recommended)

The chain repo ships an install script that downloads the `qbtcd` and `bifrost` binaries to `/usr/local/bin`, optionally sets up Cosmovisor for upgrade management, initializes the node home directory, downloads the genesis file, writes a `bifrost` config template, and installs `systemd` services.

```bash
curl -sSL https://raw.githubusercontent.com/btcq-org/qbtc/main/scripts/install.sh | bash
```

To pin a specific version (recommended for reproducibility — check the [releases page](https://github.com/btcq-org/qbtc/releases) for the current testnet version):

```bash
curl -sSL https://raw.githubusercontent.com/btcq-org/qbtc/main/scripts/install.sh | bash -s -- -v 1.0.21
```

or via environment variable:

```bash
QBTC_VERSION=1.0.21 bash -c "$(curl -sSL https://raw.githubusercontent.com/btcq-org/qbtc/main/scripts/install.sh)"
```

<Tip>
Piping a remote script straight into `bash` runs unreviewed code as your user. If you prefer to inspect it first:

```bash
curl -sSL https://raw.githubusercontent.com/btcq-org/qbtc/main/scripts/install.sh -o qbtc-install.sh
less qbtc-install.sh
bash qbtc-install.sh
```
</Tip>

### What the installer creates

| Path | Contents |
|---|---|
| `/usr/local/bin/qbtcd`, `/usr/local/bin/bifrost` | The two binaries. |
| `$HOME/.qbtc` | Chain daemon home (config, data, genesis). |
| `$HOME/.bifrost` | Bifrost home (config, local DB). |
| `systemd` units `qbtcd` and `bifrost` | Service definitions (auto-restart, raised file-descriptor limit). |

## Configure bifrost

Before starting the services, point `bifrost` at your Bitcoin full node. Edit its config:

```bash
vim ~/.bifrost/config.json
```

The template the installer writes looks like this — fill in your Bitcoin RPC host, port, username, and password:

```json
{
  "listen_addr": "0.0.0.0:30006",
  "http_listen_addr": "0.0.0.0:30007",
  "external_ip": "",
  "bitcoin": {
    "host": "127.0.0.1",
    "port": 8332,
    "rpc_user": "bitcoinrpc",
    "password": "securepassword",
    "local_db_path": "/home/youruser/.bifrost/db"
  },
  "qbtc_grpc_address": "localhost:9090",
  "cometbft_rpc_address": "http://localhost:26657"
}
```

## Start the node

```bash
sudo systemctl start qbtcd
sudo systemctl start bifrost
```

Check status and follow logs:

```bash
sudo systemctl status qbtcd bifrost
sudo journalctl -u qbtcd -f
```

To start automatically on boot:

```bash
sudo systemctl enable qbtcd bifrost
```

## Ports

| Port | Process | Purpose |
|---|---|---|
| `26656` | `qbtcd` | CometBFT P2P. |
| `26657` | `qbtcd` | CometBFT RPC. |
| `9090` | `qbtcd` | Cosmos gRPC (bifrost connects here). |
| `30006` | `bifrost` | Bifrost P2P (block gossip between validators). |
| `30007` | `bifrost` | Bifrost HTTP. |
| `8332` | Bitcoin node | Bitcoin RPC (bifrost reads from here). |

Open `26656` and `30006` to peers so your node can sync and gossip Bitcoin blocks. Keep `26657`, `9090`, and the Bitcoin RPC port firewalled to localhost or trusted hosts.

## Building from source

If you would rather build the binaries yourself:

```bash
git clone https://github.com/btcq-org/qbtc.git
cd qbtc
make build
```

`make build` produces all of the chain binaries into `./build/`: `qbtcd`, `bifrost`, `zkprover` (the local ZK proof CLI — see [Claim Mechanism](/build/claim-mechanism)), `proof-service` (the optional hosted PLONK prover), and `utxo-indexer` (builds the genesis UTXO snapshot). Run the test suite with:

```bash
make test
go test -tags=testing ./x/qbtc/zk/...
```

For a throwaway local devnet, the repo includes a helper:

```bash
./scripts/start-node.sh
```

## Becoming a validator

A QBTC validator is a `qbtcd` node that has bonded stake and run `bifrost`. Validator onboarding (the `create-validator` flow, minimum self-bond, and slashing parameters) is finalized as the testnet stabilizes. Until those values are published, treat any validator setup as testnet-only and confirm the current procedure in the [chain repository](https://github.com/btcq-org/qbtc). See [Consensus & Validators](/build/consensus) for the economic model.

## See also

* [Architecture](/build/architecture), how `qbtcd`, `bifrost`, and the Bitcoin node fit together.
* [Consensus & Validators](/build/consensus), validator economics and emission.
* [Chain repository](https://github.com/btcq-org/qbtc), source of truth for versions and endpoints.
