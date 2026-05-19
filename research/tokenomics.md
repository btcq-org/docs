# Tokenomics

QBTC's economic design rests on three invariants:

1. **Cap matches Bitcoin.** Total supply is hard-capped at 21,000,000 QBTC. Enforced because no Bitcoin UTXO can produce QBTC twice.
2. **Nothing is pre-minted.** No QBTC exists at genesis. Tokens come into existence only when a Bitcoin UTXO is claimed, by either a user or by governance.
3. **The claim mirror is a ledger of promises**, not a pool of tokens.

Forward-looking economic mechanisms attached to the post-MVP feature set are covered in [Vision & Roadmap](vision-and-roadmap.md).

## The claim mirror

QBTC's chain state contains a continuous mirror of Bitcoin's UTXO set. For each live Bitcoin UTXO, the mirror stores an **entitlement record** with the form:

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

On QBTC, governance reclaims it productively. Through standard `x/gov` proposals on a roughly two-week voting cadence:

1. A proposal identifies one or more UTXOs meeting the dormant exposed-key criteria.
2. Validators vote.
3. If the proposal passes, each referenced UTXO is marked as claimed (same `claimed_flag` as a user claim), and **QBTC equal to the BTC value is minted into the Reserve Module**.
4. The reclaimed UTXOs and any descendants are permanently ineligible for user claim (via the `claimed_flag` propagation in the mirror).

Value that would otherwise be captured by a quantum attacker is minted into a quantum-safe address (the Reserve Module), which funds the network securing the post-quantum migration.

Governance reclamation is the only inflow to the Reserve. There is no other source of validator emission funding.

## The Reserve Module

The Reserve Module is a module account on the chain. It holds QBTC tokens that have been minted via Path 2 (governance reclamation) but not yet paid out to validators.

**One inflow:**

* Governance reclamation of dormant exposed-key UTXOs (mint per passed proposal).

**One outflow:**

* Validator emission, per block. Per `x/qbtc/keeper/network_manager.go:24–47`:

```
release_per_block = reserve_balance / (EmissionCurve × BlocksPerYear)
```

Constants in v1 (per `constants/constants.go`):

* `EmissionCurve = 5`
* `BlocksPerYear = 52,560,000`

The released amount is transferred from the Reserve Module to the standard Cosmos fee collector, which distributes to validators and delegators via `x/distribution`.

The Reserve Module's balance evolves as a function of governance activity: it grows when reclamation proposals pass and decreases as validators are paid.

## Sustainability

Typical proof-of-stake chains fund validator emission via inflationary minting. The token loses value over time unless network activity grows fast enough to offset inflation.

QBTC funds validator emission by reclaiming value that Bitcoin would otherwise lose to quantum attackers, converting a one-time loss event (Q-day theft of dormant exposed-key coins) into a sustainable validator subsidy.

The dormant exposed-key pool is estimated at 1M+ BTC, so the reclamation runway is long. Transaction fees grow as a share of validator revenue with adoption, complementing the diminishing emission stream.

## Cap enforcement, in detail

At any point in time:

```
total_minted = (user claims to date) + (governance reclamations to date)
```

Each Bitcoin UTXO contributes to at most one of these (it's either user-claimed, governance-claimed, or unclaimed). The claimed flag in the mirror prevents double-claim across paths.

Since Bitcoin's supply is capped at 21M:

```
total_minted ≤ 21,000,000 QBTC
```

No inflationary minting exists anywhere in the chain code. The cap is enforced by construction.

## Distribution of validator rewards

Once QBTC released from the Reserve Module hits the standard Cosmos fee collector, distribution follows standard `x/distribution` rules:

* A configurable percentage goes to the community pool.
* The remainder is distributed to validators in proportion to bonded stake.
* Each validator's commission is taken; the rest passes through to delegators.

No custom QBTC mechanism is layered on top of `x/distribution`.

## What is not in v1 economics

* No community tax mechanism beyond the standard `x/distribution` community pool.
* No custom vesting beyond what `x/auth/vesting` provides as a standard SDK feature.
* No feature-activation thresholds tied to economic state.
* No liquidity-pool fees (no pool in v1).

## Comparison to Bitcoin

| Property | Bitcoin | QBTC v1 |
|---|---|---|
| Supply cap | 21M BTC | 21M QBTC |
| Block reward source | Newly minted (halving schedule) | Reserve Module (funded by governance reclamation) |
| Inflation | Decreasing, asymptotic to 0 | Strictly zero |
| Genesis premint | None | None |
| Privileged founder allocation | None | None |
| Recovery mechanism for quantum-lost coins | None | Governance reclamation into Reserve Module |

## See also

* [Fair Launch Principles](../learn/fair-launch.md), the design philosophy in plain language.
* [Protocol Specification (v1)](protocol-spec.md), the canonical chain reference.
* [Vision & Roadmap](vision-and-roadmap.md), planned economic mechanisms tied to post-MVP features.
