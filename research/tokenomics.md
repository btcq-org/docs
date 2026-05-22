---
title: "Tokenomics"
description: "QBTC's economic design: 21M supply cap, no premine, governance reclamation of dormant exposed-key BTC into the Reserve Module funding validator emission."
---

QBTC's economic design rests on three invariants:

1. **Cap matches Bitcoin.** Total supply is hard-capped at 21,000,000 QBTC.
2. **Nothing is pre-minted.** No QBTC exists at genesis. Tokens come into existence only when a Bitcoin UTXO is claimed, by either a user or by governance.
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

## Two minting paths

### Path 1: User claim

A holder submits `MsgClaimWithProof` with a ZK proof of ownership over a BTC address, a destination QBTC address, and a list of UTXOs to claim (up to 50).

If the proof verifies and the referenced UTXOs are unclaimed, the chain:

1. Marks each referenced UTXO as claimed.
2. **Mints** the sum of the claimed UTXOs' BTC amounts as QBTC into the destination QBTC address.

Before this step, the entitlement is a record in the mirror. After this step, the QBTC tokens exist as native chain state.

### Path 2: Governance reclamation of dormant exposed-key UTXOs

Bitcoin holds a large pool of value in UTXOs that satisfy both:

* Older than 17 years.
* Public key is on-chain (P2PK outputs or reused-address outputs).

These UTXOs are structurally indefensible against a quantum-capable attacker: a CRQC operator can derive the private key from the exposed public key faster than the owner (if any) can move the coin.

On Bitcoin Legacy, this value will be captured by the first viable quantum attacker. It is economically lost.

On QBTC, governance reclaims it productively. Through standard `x/gov` proposals (default Cosmos voting period is ~2 weeks; the period is itself a governance parameter):

1. A proposal identifies one or more UTXOs meeting the dormant exposed-key criteria.
2. Validators vote.
3. If the proposal passes, each referenced UTXO is marked as claimed (same `claimed_flag` as a user claim), and **QBTC equal to the reclaimed BTC value is minted on the QBTC chain**.
4. The reclaimed UTXOs and any descendants are permanently ineligible for user claim.

Value that would otherwise be captured by a quantum attacker is minted into a quantum-safe address structure, which funds the network securing the post-quantum migration.

### How reclaimed QBTC is distributed

Each successful reclamation proposal mints QBTC and splits it across three on-chain accounts at a fixed ratio:

| Destination | Share | Purpose |
|---|---|---|
| **Reserve Module** | 90% | Funds validator emission (the main use of QBTC reclaimed by governance). |
| **Development Fund** | 5% | Funds continued protocol development. Spends require governance approval. |
| **Ecosystem Fund** | 5% | Funds adoption, education, and ecosystem growth. Spends require governance approval. |

The Development and Ecosystem funds are on-chain accounts. They are not controlled by any private wallet. Every disbursement passes through `x/gov` and is publicly recorded. Validators set the split parameters and can modify them through governance.

Each governance reclamation is a public, recorded event: the proposal identifies the UTXOs, validators vote, the chain executes the split. There is no off-chain step, no privileged team unlock, no vesting cliff.

## The Reserve Module

The Reserve Module is a module account on the chain. It holds QBTC that has been minted via governance reclamation (90% share above) but not yet paid out to validators.

**One inflow:**

* Governance reclamation of dormant exposed-key UTXOs.

**One outflow:**

* Validator emission, per block. Per `x/qbtc/keeper/network_manager.go:24–47`:

```
release_per_block = reserve_balance / (EmissionCurve × BlocksPerYear)
```

Constants (per `constants/constants.go`):

* `EmissionCurve = 5`
* `BlocksPerYear = 5,256,000` (10 × 60 × 24 × 365, i.e. 10 blocks per minute)

The released amount is transferred from the Reserve Module to the standard Cosmos fee collector, which distributes to validators and delegators via `x/distribution`.

## Sustainability

Typical proof-of-stake chains fund validator emission via inflationary minting. The token loses value over time unless network activity grows fast enough to offset inflation.

QBTC funds validator emission by reclaiming value that Bitcoin would otherwise lose to quantum attackers, converting a one-time loss event (Q-day theft of dormant exposed-key coins) into a sustainable validator subsidy.

The dormant exposed-key pool is several million BTC across Satoshi-era P2PK (~1.7M) and aged reused addresses (multi-million), so the reclamation runway is long. Per-category breakdown: [explorer.qbtc.net](https://explorer.qbtc.net). Transaction fees grow as a share of validator revenue with adoption, complementing the emission stream.

## Cap enforcement

At any time:

```
total_QBTC_minted = sum(user claims) + sum(governance reclamations)
                  ≤ 21,000,000 QBTC
```

The cap holds because no Bitcoin UTXO can be claimed twice. The `claimed_flag` propagates through Bitcoin spends, so a reclaimed UTXO and its descendants are permanently ineligible. Each claim mints exactly the BTC amount of that UTXO. Bitcoin's total supply is capped at 21M, so QBTC's total minted supply is bounded by the same number.

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
| Genesis premint | None | None |
| Privileged founder allocation | None | None |
| Recovery mechanism for quantum-lost coins | None | Governance reclamation into Reserve Module |
| Funding for ongoing development | None on-chain (Bitcoin Core funded by donations/firms) | 5% of governance reclamations (on-chain Development Fund, gov-controlled) |

## See also

* [Fair Launch Principles](../learn/fair-launch.md), the design philosophy in plain language.
* [Protocol Specification](protocol-spec.md), the canonical chain reference.
