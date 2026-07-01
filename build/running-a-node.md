---
title: "Running a Node"
description: "Run a QBTC node and create a validator: install qbtcd + bifrost, the create-validator flow (ML-DSA keys, self-bond, bifrost peering), upgrading (minor swap vs Cosmovisor), and validator placement for large ML-DSA blocks. Testnet."
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
curl -sSL https://raw.githubusercontent.com/btcq-org/qbtc/main/scripts/install.sh | bash -s -- -v 1.0.22
```

or via environment variable:

```bash
QBTC_VERSION=1.0.22 bash -c "$(curl -sSL https://raw.githubusercontent.com/btcq-org/qbtc/main/scripts/install.sh)"
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

<Tip>
**Validators: set `external_ip` to your node's public IP.** Bifrost peers reach each other at `external_ip:30006`. If you leave it empty, your advertised peer address comes back as `0.0.0.0:30006`, which nobody can connect to. See [Register your bifrost peer address](#register-your-bifrost-peer-address).
</Tip>

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

## Keeping your node updated

New `qbtcd` / `bifrost` releases are published on the [releases page](https://github.com/btcq-org/qbtc/releases). There are two kinds of update, and they are handled differently.

<Warning>
Stay current. When the team schedules an on-chain upgrade, a node still running the old binary can halt or fall out of consensus at the upgrade height. Running behind also means missing blocks and risking downtime jailing if you validate.
</Warning>

### Minor / patch releases (no consensus break)

For a routine version bump, you **replace the binaries directly** — no governance proposal. The `qbtcd` binary lives in two places, and both must be updated so it does not matter whether `systemd` launches the daemon directly or through Cosmovisor:

1. `/usr/local/bin/qbtcd`
2. `~/.qbtc/cosmovisor/current/bin/qbtcd`

`bifrost` runs from `/usr/local/bin/bifrost`.

```bash
# stop services
sudo systemctl stop qbtcd bifrost

# download the release binaries (or build them), then replace both copies
sudo install -m 755 qbtcd  /usr/local/bin/qbtcd
sudo install -m 755 qbtcd  ~/.qbtc/cosmovisor/current/bin/qbtcd
sudo install -m 755 bifrost /usr/local/bin/bifrost

# restart
sudo systemctl start qbtcd bifrost
qbtcd version    # confirm the new version
```

### Major / consensus-breaking upgrades (governance)

Consensus-breaking upgrades ship through an on-chain **software-upgrade proposal** and are applied by **Cosmovisor** at the scheduled block height. Because the installer sets `DAEMON_ALLOW_DOWNLOAD_BINARIES=false`, Cosmovisor will not fetch the binary for you — stage it ahead of the upgrade height:

```bash
# <upgrade-name> is the name in the passed proposal
mkdir -p ~/.qbtc/cosmovisor/upgrades/<upgrade-name>/bin
install -m 755 qbtcd ~/.qbtc/cosmovisor/upgrades/<upgrade-name>/bin/qbtcd
```

At the upgrade height Cosmovisor stops the old binary, switches the `current` symlink, and (with `DAEMON_RESTART_AFTER_UPGRADE=true`) restarts automatically. Follow the release notes for the exact upgrade name and height.

## Chain ID for transactions

The live testnet reports its chain ID as **`qbtc`** (confirmed from `…/cosmos/base/tendermint/v1beta1/blocks/latest`). The installer's client config currently sets a different value, so if you sign and broadcast transactions, pass the chain ID explicitly to avoid a signature-mismatch error:

```bash
qbtcd tx ... --chain-id qbtc
```

Always confirm the current chain ID from a live block before broadcasting — it changes at mainnet relaunch.

## Querying without your own node

To read chain state without running a full node, use the public Cosmos REST gateway documented in the [API Reference](/build/api-reference#qbtc-chain-access). Note it proxies only standard `/cosmos/...` module queries — CometBFT RPC and custom `x/qbtc` routes are not exposed.

## Becoming a validator

Validator creation is the **standard Cosmos SDK `x/staking` flow** (`qbtcd tx staking create-validator`), with three QBTC-specific differences:

1. **Consensus keys are ML-DSA, not Ed25519.** The validator pubkey you submit has `@type` `/cosmos.crypto.mldsa.PubKey`. You get it from `qbtcd comet show-validator` exactly as on any Cosmos chain — the key material is just post-quantum.
2. **Account keys are also ML-DSA, not secp256k1.** `qbtcd keys add` generates a post-quantum account key. This is unusual (most Cosmos chains use secp256k1 accounts) and means generic secp256k1 tooling and hardware wallets will not sign QBTC transactions.
3. **A validator must also run `bifrost` and register it on-chain.** Block production depends on validators attesting Bitcoin blocks (see [Architecture](/build/architecture)). Beyond running the sidecar, you publish its peer address with a custom `x/qbtc` transaction so other validators can reach it — see [Register your bifrost peer address](#register-your-bifrost-peer-address). Skipping this leaves your validator unable to attest.

<Warning>
**You do not send tokens to anyone to create a validator.** `create-validator` bonds QBTC **from your own validator account** — it moves your own balance from liquid to bonded (self-delegation). There is no deposit address to pay into. To fund your account on the current private testnet (which has no public faucet), generate your validator account first and ask the team for testnet QBTC to **your** `qbtc1…` address (via [Discord](https://discord.gg/anMfAjtCPZ)).
</Warning>

### Network parameters (current testnet)

Verified live; all change at mainnet relaunch.

| Parameter | Value |
|---|---|
| Bond denom | `qbtc` (1 QBTC = 100,000,000 base units) |
| Unbonding period | 21 days (`1814400s`) |
| Max validators | 100 |
| Minimum self-delegation | operator-set, can be as low as `1` base unit |
| Inflation | none (no mint module) — rewards come from fees and Reserve emission; on testnet, with the Reserve empty, rewards are negligible |
| Downtime slashing | 1% + jail if you sign < 50% of the last 100 blocks; 10-minute jail |
| Double-sign slashing | 5% + permanent tombstone |

<Warning>
**Never run the same consensus key on two nodes.** Double-signing is slashed 5% and tombstones the validator permanently. For multiple validators, each needs its **own** node home, its **own** consensus key, its **own** `bifrost`, and its **own** funded account.
</Warning>

### Step by step

1. **Sync a full node and run `bifrost`** (sections above). Wait until `qbtcd` is caught up (`qbtcd status` → `sync_info.catching_up: false`).

2. **Create your validator account key** (this is an ML-DSA key):

   ```bash
   qbtcd keys add my-validator
   # note the qbtc1... address it prints
   ```

3. **Fund the account.** On testnet, send your `qbtc1…` address to the team and they fund it. Confirm the balance:

   ```bash
   qbtcd query bank balances "$(qbtcd keys show my-validator -a)"
   ```

4. **Get your consensus pubkey:**

   ```bash
   qbtcd comet show-validator
   # → {"@type":"/cosmos.crypto.mldsa.PubKey","key":"..."}
   ```

5. **Write `validator.json`** — paste the pubkey output verbatim into the `pubkey` field:

   ```json
   {
     "pubkey": {"@type":"/cosmos.crypto.mldsa.PubKey","key":"PASTE_FROM_STEP_4"},
     "amount": "1000000000qbtc",
     "moniker": "my-validator",
     "commission-rate": "0.1",
     "commission-max-rate": "0.2",
     "commission-max-change-rate": "0.01",
     "min-self-delegation": "1"
   }
   ```

   `amount` is your self-bond, in base units (`1000000000qbtc` = 10 QBTC). It must be ≤ your funded balance.

6. **Submit the transaction:**

   ```bash
   qbtcd tx staking create-validator validator.json \
     --from my-validator \
     --chain-id qbtc \
     --gas auto --gas-adjustment 1.3
   ```

7. **Verify** you are bonded:

   ```bash
   qbtcd query staking validator "$(qbtcd keys show my-validator --bech val -a)"
   ```

   or via the public gateway: `…/qbtc-rpc/cosmos/staking/v1beta1/validators`.

### Register your bifrost peer address

This is a QBTC-specific step with no Cosmos equivalent, and it comes **after** your validator is created and bonded — not before.

* **It is order-enforced.** The `set-node-peer-address` transaction is rejected unless the signer is an already-**bonded** validator (the handler requires `validator.Status == Bonded`, otherwise it returns `unauthorized: validator is not bonded`). Run it before `create-validator`, or while your validator is still unbonded or jailed, and it fails. Confirm `BOND_STATUS_BONDED` from the verify step above first.
* **Bonding alone is not enough.** Your validator's `bifrost` also has to be **discoverable** so other validators' `bifrost` processes can connect and exchange Bitcoin blocks. A bonded but unregistered validator cannot attest BTC blocks and risks downtime jailing.

1. **Set `external_ip` and restart bifrost.** Confirm `external_ip` in `~/.bifrost/config.json` is your node's public IP (see the [bifrost config](#configure-bifrost) tip), then:

   ```bash
   sudo systemctl restart bifrost
   ```

2. **Read your full peer address** from the bifrost HTTP API. It returns `<peerID>@<external_ip>:<p2p-port>` ready to use:

   ```bash
   curl http://127.0.0.1:30007/peerid
   # → 12D3KooWE2iVgm3YXDKwGX7Asqz7Q4JpoDZ12Vj8G6vVQMNVJEq9@149.28.169.249:30006
   ```

   If the IP comes back as `0.0.0.0`, `external_ip` is unset — fix step 1 first.

3. **Register it on-chain** with the custom `x/qbtc` message, signed by your validator account:

   ```bash
   qbtcd tx qbtc set-node-peer-address \
     --peer-address "12D3KooWE2iVgm3YXDKwGX7Asqz7Q4JpoDZ12Vj8G6vVQMNVJEq9@149.28.169.249:30006" \
     --chain-id qbtc \
     --from my-validator
   ```

4. **Verify** peering and the on-chain mapping:

   ```bash
   curl http://127.0.0.1:30007/connected-peers     # live bifrost connections
   curl http://127.0.0.1:30007/validator-peers      # validator peers seen
   qbtcd query qbtc all-node-peer-addresses          # the on-chain registry
   ```

   The custom `x/qbtc` queries are served by your own node, not the public REST gateway. If a subcommand differs on your build, check `qbtcd query qbtc --help`.

### Placement and latency

QBTC blocks are **large**, and this makes validator placement a real operational concern. ML-DSA consensus signatures are about 3.3 KB each (versus 64 bytes for Ed25519), and when a Bitcoin block is ingested it is shipped into a QBTC block that can be very large. A validator that is network-distant from the rest of the active set may not receive and precommit these large blocks within the consensus timeouts — so it **misses precommits and is jailed for downtime**, even while it keeps up fine on small blocks.

This is not hypothetical. A validator roughly **225 ms RTT** from the majority of voting power consistently missed precommits on the large blocks and was jailed; its small-block participation was unaffected.

* **Run close to the rest of the active set.** Minimize round-trip latency to the other validators. On the current testnet the majority of voting power runs in **Singapore** — place your validator in or near the region where the active set is concentrated (confirm the current location with the team) rather than across an ocean.
* **Measure before you commit to a region.** A few hundred milliseconds of RTT to your peers is enough to miss large blocks. Check latency first.
* **Do not change the consensus timeouts on your own.** `timeout_propose`, `timeout_commit`, and the related values in `config.toml` are effectively network-wide; the team may tune them for large post-quantum blocks, so follow the published values rather than diverging unilaterally.

### Running multiple validators

Repeat the whole flow per validator, on separate machines (or separate `--home` directories and ports), each with its own account, its own consensus key, and its own `bifrost`. Fund each account separately; each self-bonds independently.

<Info>
The exact subcommand names and flags above follow Cosmos SDK v0.53. If anything differs on your build, the binary is the source of truth — check `qbtcd tx staking create-validator --help` and `qbtcd comet --help`. See [Consensus & Validators](/build/consensus) for the economic model.
</Info>

## See also

* [Architecture](/build/architecture), how `qbtcd`, `bifrost`, and the Bitcoin node fit together.
* [Consensus & Validators](/build/consensus), validator economics and emission.
* [Chain repository](https://github.com/btcq-org/qbtc), source of truth for versions and endpoints.
