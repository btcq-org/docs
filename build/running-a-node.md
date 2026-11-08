---
title: "Running a Node"
description: "Run a QBTC node and create a validator: install qbtcd, configure the built-in Bitcoin reader, the create-validator flow (ML-DSA-65 keys, self-bond), upgrading (minor swap vs Cosmovisor), and validator placement for large ML-DSA blocks."
---

<Info>
**Test network.** A test network has run since March 2026 and may be reset. Mainnet is a fresh genesis, planned for early 2027. The instructions below stand up a node against the current public **test network**. Endpoints, the chain ID, and the pinned version can change before mainnet — always cross-check the [chain repository](https://github.com/btcq-org/qbtc) for the latest values.
</Info>

<Warning>
**Launch build.** This page describes the launch build: ML-DSA-65 keys, and a Bitcoin reader built into `qbtcd`. The current test network runs an earlier build, and until the relaunch the install script installs that earlier build.
</Warning>

A QBTC node is one process, **`qbtcd`**: the chain daemon (Cosmos SDK with the ML-DSA CometBFT fork).

Validators also need a **Bitcoin full node** (Bitcoin Core with RPC enabled). The Bitcoin reader inside `qbtcd` reads new Bitcoin blocks from it, and the validator attests those blocks in its consensus votes. The Bitcoin node can run on the same machine or a separate one. See [Architecture](/build/architecture) for how the parts fit together.

## Prerequisites

* A Linux host (the installer targets `linux-amd64` release binaries and `systemd`).
* `curl`, `tar`, `sudo`, `sha256sum`, and `systemctl` available on the host.
* Validators only: a reachable Bitcoin Core node with RPC enabled (host, port, RPC username, and password).
* For building from source instead of using release binaries: **Go 1.26+** and **Make**.

## Quick install (recommended)

The chain repo ships an install script that downloads the `qbtcd` binary to `/usr/local/bin`, optionally sets up Cosmovisor for upgrade management, initializes the node home directory, downloads the genesis file, and installs a `systemd` service.

```bash
curl -sSL https://raw.githubusercontent.com/btcq-org/qbtc/main/scripts/install.sh | bash
```

To pin a specific version (recommended for reproducibility — check the [releases page](https://github.com/btcq-org/qbtc/releases) for the current version):

```bash
curl -sSL https://raw.githubusercontent.com/btcq-org/qbtc/main/scripts/install.sh | bash -s -- -v <version>
```

or via environment variable:

```bash
QBTC_VERSION=<version> bash -c "$(curl -sSL https://raw.githubusercontent.com/btcq-org/qbtc/main/scripts/install.sh)"
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
| `/usr/local/bin/qbtcd` | The chain binary. |
| `$HOME/.qbtc` | Chain daemon home (config, data, genesis). |
| `systemd` unit `qbtcd` | Service definition (auto-restart, raised file-descriptor limit). |

## Configure the Bitcoin reader (validators)

Validators must turn on the Bitcoin reader and point it at a Bitcoin Core node they trust. Edit the `[btc_reader]` section of `~/.qbtc/config/app.toml`:

```toml
[btc_reader]
# Read Bitcoin blocks and attest them in vote extensions
enable = true

# Bitcoin Core RPC host, port and credentials
bitcoin_host = "127.0.0.1"
bitcoin_port = 8332
bitcoin_rpc_user = "bitcoinrpc"
bitcoin_rpc_password = "securepassword"

# Confirmations a Bitcoin block needs before this node attests it
# (the block itself counts as one)
confirmation_depth = 6

poll_interval = "10s"
max_cached_blocks = 16
rpc_timeout = "30s"
```

The reader fetches each block from your Bitcoin node, checks its hash and merkle root, and caches it. Your validator then attests the cached blocks in its consensus votes. A full node that does not validate can leave `enable = false`.

## Start the node

```bash
sudo systemctl start qbtcd
```

Check status and follow logs:

```bash
sudo systemctl status qbtcd
sudo journalctl -u qbtcd -f
```

To start automatically on boot:

```bash
sudo systemctl enable qbtcd
```

## Ports

| Port | Process | Purpose |
|---|---|---|
| `26656` | `qbtcd` | CometBFT P2P. |
| `26657` | `qbtcd` | CometBFT RPC. |
| `9090` | `qbtcd` | Cosmos gRPC. |
| `8332` | Bitcoin node | Bitcoin RPC (the `qbtcd` Bitcoin reader reads from here). |

Open `26656` to peers so your node can sync. Keep `26657`, `9090`, and the Bitcoin RPC port firewalled to localhost or trusted hosts.

## State sync (fast bootstrap)

Syncing a QBTC node from genesis can take a long time — blocks contain ML-DSA signatures and Bitcoin block data, so the chain grows quickly. CometBFT **state sync** lets a new node download a recent state snapshot from peers and skip replaying history, reducing bootstrap time from hours to minutes.

### Configure state sync

1. **Get the current trust height and trust hash.** The [QBTC explorer statesync page](https://explorer.qbtc.net/qbtc/statesync) always shows fresh values. Copy them from there — they change as the chain advances and the values below will be stale by the time you read this.

2. **Edit `~/.qbtc/config/config.toml`** — find the `[state-sync]` section and fill in the values from the explorer:

   ```toml
   [state-sync]
   enable = true
   rpc_servers = "https://api.vultisig.com/qbtc-node"
   trust_height = 187000
   trust_hash = "7015658B389218B808D6DCCED74CDFED78A4E2D8686575723F1B6CCFB92D2741"
   trust_period = "168h"
   ```

   The height and hash above are illustrative — always use the current values from the explorer.

3. **Enable snapshots in `~/.qbtc/config/app.toml`** so your node can also serve state sync to others:

   ```toml
   # snapshot-interval must be a multiple of pruning-keep-every
   snapshot-interval = 1000
   # each snapshot is ~500 MiB; 2 is enough for most operators
   snapshot-keep-recent = 2
   ```

4. **Reset chain data** if the node has already started syncing from genesis:

   ```bash
   qbtcd unsafe-reset-all
   # or, if that subcommand is not found on your build:
   qbtcd tendermint unsafe-reset-all
   ```

5. **Start the node** and watch for state sync to kick in:

   ```bash
   sudo systemctl start qbtcd
   sudo journalctl -u qbtcd -f
   # look for: "Discovered new snapshot" and "Restored state sync snapshot"
   ```

<Warning>
State sync skips verifying the full block history — you are trusting that the snapshot is correct. Always use a trust height and hash from the official explorer or a validator you know personally. Do not copy values from anonymous posts.
</Warning>

## Building from source

If you would rather build the binaries yourself:

```bash
git clone https://github.com/btcq-org/qbtc.git
cd qbtc
make build
```

`make build` produces the chain binaries into `./build/`: `qbtcd`, `zkprover` (the local ZK proof CLI — see [Architecture](/build/architecture)), `proof-service` (the optional hosted PLONK prover), and `utxo-indexer` (builds the bootstrap UTXO seed). Run the test suite with:

```bash
make test
go test -tags=testing ./x/qbtc/zk/...
```

For a throwaway local devnet, the repo includes a helper:

```bash
./scripts/start-node.sh
```

## Keeping your node updated

New `qbtcd` releases are published on the [releases page](https://github.com/btcq-org/qbtc/releases). There are two kinds of update, and they are handled differently.

<Warning>
Stay current. When the team schedules an on-chain upgrade, a node still running the old binary can halt or fall out of consensus at the upgrade height. Running behind also means missing blocks and risking downtime jailing if you validate.
</Warning>

### Minor / patch releases (no consensus break)

For a routine version bump, you **replace the binaries directly** — no governance proposal. The `qbtcd` binary lives in two places, and both must be updated so it does not matter whether `systemd` launches the daemon directly or through Cosmovisor:

1. `/usr/local/bin/qbtcd`
2. `~/.qbtc/cosmovisor/current/bin/qbtcd`

```bash
# stop the service
sudo systemctl stop qbtcd

# download the release binary (or build it), then replace both copies
sudo install -m 755 qbtcd  /usr/local/bin/qbtcd
sudo install -m 755 qbtcd  ~/.qbtc/cosmovisor/current/bin/qbtcd

# restart
sudo systemctl start qbtcd
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

The live test network reports its chain ID as **`qbtc`** (confirmed from `…/cosmos/base/tendermint/v1beta1/blocks/latest`). The installer's client config currently sets a different value, so if you sign and broadcast transactions, pass the chain ID explicitly to avoid a signature-mismatch error:

```bash
qbtcd tx ... --chain-id qbtc
```

Always confirm the current chain ID from a live block before broadcasting — it changes at mainnet relaunch.

## Querying without your own node

To read chain state without running a full node, use the public Cosmos REST gateway documented in the [API Reference](/build/api-reference#qbtc-chain-access). It proxies the standard `/cosmos/...` module queries and the `x/qbtc` params route. CometBFT RPC is not exposed.

## Becoming a validator

Validator creation is the **standard Cosmos SDK `x/staking` flow** (`qbtcd tx staking create-validator`), with three QBTC-specific differences:

1. **Consensus keys are ML-DSA-65, not Ed25519.** `qbtcd init` creates an ML-DSA-65 consensus key by default. The validator pubkey you submit has `@type` `/cosmos.crypto.mldsa65.PubKey`. You get it from `qbtcd comet show-validator`, as on any Cosmos chain.
2. **Account keys are ML-DSA-65 only.** The chain rejects all other key types, including secp256k1, ed25519 and multisig. `qbtcd keys add` creates an ML-DSA-65 key by default (`--key-type ml_dsa_65`).
3. **A validator must also run the Bitcoin reader.** Validators attest Bitcoin blocks in their consensus votes (vote extensions). A Bitcoin block enters QBTC state only when validators with more than 2/3 of voting power attest it. Enable the reader before you bond (see [Configure the Bitcoin reader](#configure-the-bitcoin-reader-validators)).

<Warning>
**You do not send tokens to anyone to create a validator.** `create-validator` bonds QBTC **from your own validator account** — it moves your own balance from liquid to bonded (self-delegation). There is no deposit address to pay into. To fund your account on the current test network (which has no public faucet), generate your validator account first and ask the team for test-network QBTC to **your** `qbtc1…` address (via [Discord](https://discord.gg/anMfAjtCPZ)).
</Warning>

### Network parameters (current test network)

Verified live; all change at mainnet relaunch.

| Parameter | Value |
|---|---|
| Bond denom | `qbtc` (1 QBTC = 100,000,000 base units) |
| Unbonding period | 21 days (`1814400s`) |
| Max validators | 100 |
| Minimum self-delegation | operator-set, can be as low as `1` base unit |
| Inflation | none (no mint module) — rewards come from fees and Reserve emission |
| Downtime slashing | 1% + jail if you sign < 50% of the last 100 blocks; 10-minute jail |
| Double-sign slashing | 5% + permanent tombstone |

<Warning>
**Never run the same consensus key on two nodes.** Double-signing is slashed 5% and tombstones the validator permanently. For multiple validators, each needs its **own** node home, its **own** consensus key, its **own** Bitcoin reader configuration, and its **own** funded account.
</Warning>

### Step by step

1. **Sync a full node and enable the Bitcoin reader** (sections above). Wait until `qbtcd` is caught up (`qbtcd status` → `sync_info.catching_up: false`).

2. **Create your validator account key** (this is an ML-DSA-65 key):

   ```bash
   qbtcd keys add my-validator
   # note the qbtc1... address it prints
   ```

   <Tip>
   The HD derivation path for QBTC accounts is `m/44'/118'/0'/0/0`. QBTC derives a 32-byte seed on that path from your BIP-39 mnemonic and uses it to generate the ML-DSA-65 key. The same mnemonic therefore gives a different address on QBTC than on a secp256k1 Cosmos chain. `qbtcd keys add` handles this automatically.
   </Tip>

3. **Fund the account.** On the test network, send your `qbtc1…` address to the team and they fund it. Confirm the balance:

   ```bash
   qbtcd query bank balances "$(qbtcd keys show my-validator -a)"
   ```

4. **Get your consensus pubkey:**

   ```bash
   qbtcd comet show-validator
   # → {"@type":"/cosmos.crypto.mldsa65.PubKey","key":"..."}
   ```

5. **Write `validator.json`** — paste the pubkey output verbatim into the `pubkey` field:

   ```json
   {
     "pubkey": {"@type":"/cosmos.crypto.mldsa65.PubKey","key":"PASTE_FROM_STEP_4"},
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

### Placement and latency

QBTC blocks are **large**, and this makes network latency a real operational consideration. ML-DSA-65 consensus signatures are about 3.3 KB each (versus 64 bytes for Ed25519), and when a Bitcoin block is ingested it is shipped into a QBTC block that can be very large. A validator that is network-distant from the rest of the active set may not receive and precommit these large blocks within the consensus timeouts — so it **misses precommits and is jailed for downtime**, even while it keeps up fine on small blocks.

This has been observed in practice: a validator with roughly **225 ms RTT** to the majority of voting power consistently missed precommits on large blocks and was jailed, while its small-block participation was unaffected. ML-DSA block sizes magnify latency problems that would be invisible on a standard Cosmos chain.

When choosing where to run your validator, the factors to weigh are:

* **RTT to the current active set.** Query `qbtcd query staking validators` (or the [chain gateway](/build/api-reference#qbtc-chain-access)) to see which validators are active, find where they are hosted, and measure round-trip latency from your intended machine before committing to a region. A few hundred milliseconds is enough to miss large blocks during Bitcoin ingestion events.
* **Active set distribution changes over time.** As more validators join, the geographic concentration of voting power may shift. A region that gives low latency today might become higher-latency relative to a future set.
* **Network decentralisation.** A geographically distributed active set is more resilient — geographic diversity has value for the network as a whole, even if it means some individual validators accept higher latency variance.

There is no single right answer here. What matters is that you understand your latency to the peers that hold the majority of voting power before you go live, and that you monitor it as the validator set evolves.

* **Do not change the consensus timeouts on your own.** `timeout_propose`, `timeout_commit`, and related values in `config.toml` are effectively network-wide; the team may tune them to accommodate large post-quantum blocks, so follow the published values rather than diverging unilaterally.

### Running multiple validators

Repeat the whole flow per validator, on separate machines (or separate `--home` directories and ports), each with its own account, its own consensus key, and its own Bitcoin reader configuration. Fund each account separately; each self-bonds independently.

<Info>
The exact subcommand names and flags above follow Cosmos SDK v0.55. If anything differs on your build, the binary is the source of truth — check `qbtcd tx staking create-validator --help` and `qbtcd comet --help`. See [Consensus & Validators](/build/consensus) for the economic model.
</Info>

## See also

* [Architecture](/build/architecture), how `qbtcd`, its Bitcoin reader, and the Bitcoin node fit together.
* [Consensus & Validators](/build/consensus), validator economics and emission.
* [Chain repository](https://github.com/btcq-org/qbtc), source of truth for versions and endpoints.
