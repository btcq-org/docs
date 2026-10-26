---
title: "Protocol Specification"
description: "Canonical specification of the QBTC chain: state, ingestion, claim verification, taint propagation, emission, and governance."
---

Specification of the QBTC chain code for implementers and researchers. If this page and the code differ, the code is correct.

Citations refer to the QBTC source code at `github.com/btcq-org/qbtc`.

## 1. Consensus

QBTC consensus is **CometBFT, forked** to replace Ed25519 with ML-DSA (CRYSTALS-Dilithium, FIPS 204) throughout the consensus signing path.

* Source: `github.com/btcq-org/cometbft`.
* Replaces `crypto/ed25519` with `crypto/mldsa` for validator consensus keys, vote signing, and block-commit signatures.
* ML-DSA-44 parameter set (NIST security category 2).
* Signature size: 2420 bytes (~2.4 KB). Public key size: 1312 bytes (~1.3 KB). Per FIPS 204.

The consensus path has no ECDSA or Ed25519 dependency. Validators sign with ML-DSA from genesis.

### 1.1 Validator set

* Standard Cosmos `x/staking` for bonding and validator selection.
* Validator consensus key: ML-DSA.
* Account keys, including the validator operator key: ML-DSA, secp256k1, ed25519 or multisig. Post-quantum protection applies only to ML-DSA accounts.
* Maximum validator set size and unbonding period: genesis parameters. The test network uses 100 validators and 21 days. Mainnet sets its own values at genesis.

## 2. The custom module: `x/qbtc`

Single custom module covering everything QBTC-specific:

| Subfolder | Responsibility |
|---|---|
| `keeper/` | State and message handlers for claims, UTXO mirror, network rewards |
| `types/` | Protobuf message types, validation |
| `module/` | Cosmos module wiring, genesis state loader |
| `zk/` | PLONK circuits, on-chain verifier |
| `ebifrost/` | "Enshrined bifrost": accepts gossiped BTC blocks from validator sidecars |

### 2.1 The Bitcoin UTXO mirror

The chain state contains a mirror of the Bitcoin UTXO set:

* **Initial state**: the chain loads a bootstrap seed of the Bitcoin UTXO set (`genesis-954355.bin`), built by the `utxo-indexer` binary. The seed is not a snapshot for eligibility. Eligibility is live with no snapshot date: whoever controls an eligible unspent output at claim time can claim it.
* **Continuous updates**: each new Bitcoin block is ingested via `ebifrost` after validator attestation, and the mirror is updated (new outputs added, spent outputs reconciled).
* **Per-UTXO claim entry**: each UTXO has an `EntitledAmount` field representing its outstanding QBTC claim. Set at ingestion, decremented to 0 upon successful claim.

### 2.2 Block ingestion (ebifrost)

Each validator runs a `bifrost` sidecar that connects to a Bitcoin RPC, watches for new blocks, signs them with the validator's ML-DSA consensus key, and gossips them to peer validators via LibP2P.

The `ebifrost` module accepts these signed blocks via gRPC and aggregates attestations. A block is ingested into QBTC state once more than **2/3 of bonded validator power** has attested.

Per `x/qbtc/keeper/handler_msg_report_block.go:67–68`:

> `// require more than 2/3 of total staking power to attest the block`

The block is then injected as a special transaction in the next QBTC block via `PrepareProposal`/`ProcessProposal`.

### 2.3 Claim mechanism

A holder claims QBTC by submitting a `MsgClaimWithProof` transaction. Per `proto/qbtc/qbtc/v1/msg_claim_with_proof.proto:18–64`:

* The message contains a ZK PLONK proof attesting ownership of a Bitcoin address, plus a list of up to **50 UTXOs** belonging to that address, plus a destination QBTC address.
* The on-chain verifier checks the proof against the public inputs (Hash160 of the BTC address, destination QBTC address).
* For each referenced UTXO, the handler checks:
  1. The UTXO exists in QBTC's state.
  2. Its `EntitledAmount > 0` (not previously claimed).
  3. Its address matches the one proven.
  4. It has at least `MinUtxoConfirmationBlocks` Bitcoin confirmations (144, about one day).
* If all checks pass, the cumulative `EntitledAmount` is transferred to the destination QBTC address, and each UTXO's entry is set to 0.

The zero-knowledge self-claim supports P2PKH (`1…`) and P2WPKH (`bc1q…`) addresses today.

Per `x/qbtc/keeper/handle_msg_claim_with_proof.go`:

* Lines 59–169: claim verification and disbursement.
* Lines 172–183: atomic batch handling via cache context (all-or-nothing).

Public inputs to the ZK circuit reveal:

* Hash160 of the BTC address being claimed.
* Destination QBTC address.

Hidden inputs to the ZK circuit:

* BTC public key.
* ECDSA signature.

In the current clients, the wallet signs a digest with the Bitcoin key and sends the signature to a proving service. The service builds the zero-knowledge proof and broadcasts the claim. The Bitcoin public key never goes on chain.

### 2.4 Double-claim prevention and taint propagation

A claimed UTXO's `EntitledAmount` is set to 0. Subsequent attempts to claim the same UTXO fail at the validation step (line 66, 123 of `handle_msg_claim_with_proof.go`).

When the `ebifrost` module ingests a new Bitcoin block, the claimed status propagates to descendant UTXOs. If a transaction spends from any claimed UTXO, the outputs of that transaction inherit the claimed status in proportion to the value contributed by claimed inputs. A child of a fully-claimed parent has `EntitledAmount = 0` and cannot be claimed.

Propagation makes governance reclamation (§2.5) permanent: once a UTXO is reclaimed, the Bitcoin holder cannot recover the QBTC entitlement by spending the UTXO through Bitcoin to a new address.

### 2.5 Minting paths, the Reserve Module, and validator emission

There is one mint at genesis and two minting paths after it.

**Genesis mint.** Genesis mints 50 QBTC for the first validator. In exchange, the block-9 Bitcoin coinbase output (50 BTC) cannot be claimed, so the cap stays the same.

**Path 1: User claim.** A successful `MsgClaimWithProof` mints QBTC into the claimer's account, equal to the sum of the referenced UTXOs' BTC values.

**Path 2: Governance reclamation.** Through standard `x/gov` proposals, validators vote on which dormant exposed-key UTXOs to reclaim. The design target is outputs that have not moved for more than 17 years and whose public key is visible on chain. The 17-year rule is a governance commitment: each proposal writes the cutoff as a Bitcoin block height, lists the outputs it reclaims, and needs a passing vote. Later votes can move the cutoff forward. The voting period is a governance parameter. When a proposal passes:

1. Each referenced UTXO is marked as claimed in the mirror (`EntitledAmount → 0`), identically to a user claim.
2. QBTC equal to the reclaimed BTC value is minted on the chain and split 90 / 5 / 5:
    * **90% → Reserve Module** (funds validator emission)
    * **5% → development fund**
    * **5% → marketing fund**

    The 5% shares are fixed in code. The two fund addresses are governance parameters (`DevFundAddress`, `MarketingFundAddress`). If a fund address is not set, its 5% goes to the Reserve.
3. Descendant UTXOs inherit the claimed status via the propagation described in §2.4.

The Reserve Module is the only direct source of per-block validator emission. The two funds are the only project share of QBTC.

#### Validator emission, from the Reserve Module

Per `x/qbtc/keeper/network_manager.go:24–47`:

* `ProcessNetworkReward()` is called per block.
* It computes:
  ```
  release = reserve_balance / (EmissionCurve × BlocksPerYear)
  ```
* The released amount is transferred from `ReserveModuleName` to the standard Cosmos fee collector, which then distributes to validators and delegators via `x/distribution`.

`EmissionCurve` and `BlocksPerYear` are on-chain parameters. A governance vote can change them. Mainnet sets their values at genesis.

The Reserve Module's balance evolves as a function of governance activity: it grows when reclamation proposals pass and decreases as validators are paid.

#### Cap invariant

At any time:

```
total_QBTC_minted = genesis mint (50) + sum(user claims) + sum(governance reclamations)
                  ≤ 21,000,000 QBTC
```

The cap holds because no Bitcoin UTXO can be claimed twice (the `claimed_flag` propagates per §2.4), each claim mints exactly the BTC amount of that UTXO, the block-9 coinbase output cannot be claimed, and Bitcoin's total supply is capped at 21M.

No inflationary minting exists anywhere in the chain code.

See [Tokenomics](/research/tokenomics) for the economic framing.

### 2.6 Governance

QBTC uses **standard Cosmos `x/gov`**. Proposals follow the standard voting period, deposit requirements, and threshold rules.

Dormant-UTXO reclamation proposals (§2.5 Path 2) are enacted through `x/gov` rather than as automatic chain rules. Each proposal lists the outputs it reclaims and its cutoff block height.

## 3. Tokenomics summary

* **Total supply cap**: 21 million QBTC.
* **Claim mirror**: tracks the live Bitcoin UTXO set. It starts from a bootstrap seed.
* **Reserve Module**: a module account that holds QBTC reclaimed by governance, drawn down per block to validators via the emission formula above.
* **Development fund** (5%) and **marketing fund** (5%) from each governance reclamation.
* One mint at genesis: 50 QBTC for the first validator. No sale, no premine, no investor allocation, no vesting.

See [Tokenomics](/research/tokenomics) for the full breakdown.

## 4. Modules in use (Cosmos SDK standard)

| Module | Purpose |
|---|---|
| `auth` | Accounts |
| `bank` | Native token transfers |
| `staking` | Validator bonding |
| `slashing` | Validator misbehavior penalties |
| `distribution` | Reward distribution |
| `gov` | On-chain governance |
| `upgrade` | Coordinated upgrades |
| `evidence` | Misbehavior evidence |
| `feegrant` | Fee delegation |
| `authz` | Authorization grants |
| `consensus` | Consensus parameters |
| `params` | Module parameters |
| `epochs` | Time-based triggers |
| `group` | Multi-account governance |
| `crisis` | Invariant checks |
| IBC v10 | Inter-Blockchain Communication |
| ICS-27 | Interchain accounts |
| IBC transfer | Cross-chain token transfers |
| `wasmd` (CosmWasm) | Smart contracts |
| `tokenfactory` | Token issuance |

Standard SDK semantics apply for all of these.

## 5. Binaries

| Binary | Purpose |
|---|---|
| `qbtcd` | Chain daemon |
| `bifrost` | Bitcoin block watcher sidecar |
| `proof-service` | PLONK prover (HTTP service) |
| `zkprover` | PLONK prover (CLI) |
| `utxo-indexer` | Builds the bootstrap seed of the UTXO mirror |

## References

* `github.com/btcq-org/qbtc` (chain implementation)
* `github.com/btcq-org/cometbft` (forked CometBFT)
* Standard Cosmos SDK documentation at `docs.cosmos.network`.
* NIST FIPS 204 (ML-DSA specification).
