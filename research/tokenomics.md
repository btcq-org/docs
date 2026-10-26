---
title: "Tokenomics"
description: "QBTC's economic design: 21M supply cap, no sale, governance reclamation of dormant exposed-key BTC into the Reserve Module funding validator emission."
---

QBTC's economic design rests on three invariants. There is no sale, no premine, no investor allocation, no vesting and no inflation.

1. **Cap matches Bitcoin.** Total supply is hard-capped at 21,000,000 QBTC.
2. **One mint at genesis, then claims only.** Genesis mints 50 QBTC for the first validator. In exchange, the block-9 Bitcoin coinbase output (50 BTC) cannot be claimed, so the cap stays the same. After genesis, tokens come into existence only when a Bitcoin UTXO is claimed, by either a user or by governance.
3. **The claim mirror is a ledger of entitlements**, not a pool of tokens. Tokens are minted only when an entitlement is exercised.

## The claim mirror

The chain state contains a continuous mirror of Bitcoin's UTXO set. For each live Bitcoin UTXO, the mirror stores an entitlement record:

```
(BTC_UTXO_id, Hash160(address), BTC_amount, claimed_flag)
```

The mirror is a record of who is *allowed* to mint QBTC against which Bitcoin UTXOs. Tokens are minted only when an entitlement is exercised.

The mirror updates with every new Bitcoin block:

* New BTC outputs (including coinbase rewards) add new entitlement entries.
* Spent BTC outputs are reconciled. The `claimed_flag` propagates to descendant UTXOs: any output of a transaction whose inputs include claimed UTXOs inherits the claimed status, in proportion to the inherited value. A child of a fully-claimed parent cannot be claimed.

Propagation makes governance reclamation permanent: once reclaimed, value cannot re-enter the claimable pool by being spent through Bitcoin.

Eligibility is live with no snapshot date. Whoever controls an eligible unspent output at claim time can claim it. A new output needs 144 Bitcoin confirmations (about one day) before it can claim.

## Two minting paths

### Path 1: User claim

A holder submits `MsgClaimWithProof` with a ZK proof of ownership over a BTC address, a destination QBTC address, and a list of UTXOs to claim (up to 50).

If the proof verifies and the referenced UTXOs are unclaimed, the chain:

1. Marks each referenced UTXO as claimed.
2. **Mints** the sum of the claimed UTXOs' BTC amounts as QBTC into the destination QBTC address.

Before this step, the entitlement is a record in the mirror. After this step, the QBTC tokens exist as native chain state.

### Path 2: Governance reclamation of dormant exposed-key UTXOs

Bitcoin holds a large pool of value in UTXOs that satisfy both:

* Not moved for more than 17 years.
* Public key is on-chain (P2PK outputs or reused-address outputs).

The 17-year rule is a governance commitment. Each proposal writes the cutoff as a Bitcoin block height, lists the outputs it reclaims, and needs a passing vote. Later votes can move the cutoff forward as more outputs pass 17 years.

These UTXOs are structurally indefensible against a quantum-capable attacker: a CRQC operator can derive the private key from the exposed public key faster than the owner (if any) can move the coin.

On Bitcoin Legacy, this value will be captured by the first viable quantum attacker. It is economically lost.

On QBTC, governance reclaims it productively. Through standard `x/gov` proposals (the voting period is a governance parameter):

1. A proposal identifies one or more UTXOs meeting the dormant exposed-key criteria.
2. Validators vote.
3. If the proposal passes, each referenced UTXO is marked as claimed (same `claimed_flag` as a user claim), and **QBTC equal to the reclaimed BTC value is minted on the QBTC chain**.
4. The reclaimed UTXOs and any descendants are permanently ineligible for user claim.

The reclaim does not protect the coins on Bitcoin. It sends the matching QBTC to the Reserve and the two funds, which fund the network.

### How reclaimed QBTC is distributed

Each successful reclamation proposal mints QBTC and splits it 90 / 5 / 5:

| Destination | Share | Purpose |
|---|---|---|
| **Reserve Module** | 90% | Funds validator emission (the main use of QBTC reclaimed by governance). |
| **Development fund** | 5% | Funds continued protocol development. |
| **Marketing fund** | 5% | Funds adoption and education. |

The two funds are the only project share of QBTC.

Each governance reclamation is a public, recorded event: the proposal identifies the UTXOs, validators vote, the chain executes the split.

## The Reserve Module

The Reserve Module is a module account on the chain. It holds QBTC that has been minted via governance reclamation (90% share above) but not yet paid out to validators.

**One inflow:**

* Governance reclamation of dormant exposed-key UTXOs.

**One outflow:**

* Validator emission, per block. Per `x/qbtc/keeper/network_manager.go:24–47`:

```
release_per_block = reserve_balance / (EmissionCurve × BlocksPerYear)
```

`EmissionCurve` and `BlocksPerYear` are on-chain parameters. A governance vote can change them. Mainnet sets their values at genesis. Payouts fall as the Reserve shrinks, and new reclaims top it up.

The released amount is transferred from the Reserve Module to the standard Cosmos fee collector, which distributes to validators and delegators via `x/distribution`.

## Sustainability

Typical proof-of-stake chains fund validator emission via inflationary minting. The token loses value over time unless network activity grows fast enough to offset inflation.

QBTC funds validator emission by reclaiming value that Bitcoin would otherwise lose to quantum attackers, converting a one-time loss event (Q-day theft of dormant exposed-key coins) into a sustainable validator subsidy.

Each proposal sets its own cutoff block height, so a later first vote reclaims more outputs. A vote in November 2026 would reclaim about 983,000 BTC (4.7% of the 21M cap). The exact list is built at launch. Per-category breakdown: [indexer.qbtc.net](https://indexer.qbtc.net). Transaction fees grow as a share of validator revenue with adoption, complementing the emission stream.

## Cap enforcement

At any time:

```
total_QBTC_minted = genesis mint (50) + sum(user claims) + sum(governance reclamations)
                  ≤ 21,000,000 QBTC
```

The cap holds because no Bitcoin UTXO can be claimed twice. The `claimed_flag` propagates through Bitcoin spends, so a reclaimed UTXO and its descendants are permanently ineligible. Each claim mints exactly the BTC amount of that UTXO. The block-9 coinbase output, which offsets the genesis mint, cannot be claimed. Bitcoin's total supply is capped at 21M, so QBTC's total minted supply is bounded by the same number.

No inflationary minting exists anywhere in the chain code.

## Distribution of validator rewards

Once QBTC released from the Reserve Module hits the standard Cosmos fee collector, distribution follows standard `x/distribution` rules:

* A configurable percentage goes to the community pool.
* The remainder is distributed to validators in proportion to bonded stake.
* Each validator's commission is taken; the rest passes through to delegators.

No custom QBTC mechanism is layered on top of `x/distribution`.

## Comparison to Bitcoin

| Property | Bitcoin | QBTC |
|---|---|---|
| Supply cap | 21M BTC | 21M QBTC |
| Block reward source | Newly minted (halving schedule) | Reserve Module (funded by governance reclamation) |
| Inflation | Decreasing, asymptotic to 0 | Strictly zero |
| Genesis mint | None | 50 QBTC for the first validator (offset by the unclaimable block-9 coinbase output) |
| Sale or investor allocation | None | None |
| Recovery mechanism for quantum-lost coins | None | Governance reclamation into Reserve Module |
| Funding for ongoing development | None on-chain (Bitcoin Core funded by donations/firms) | 5% of governance reclamations (development fund) |

## See also

* [Fair Launch Principles](/learn/fair-launch), the design philosophy in plain language.
* [Protocol Specification](/research/protocol-spec), the canonical chain reference.
