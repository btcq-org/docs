# Tokenomics

QBTC's economic design is governed by three principles:

1. **Cap matches Bitcoin.** Total supply is 21 million QBTC, fixed for all time. No inflation.
2. **Claimable by Bitcoin holders.** The bulk of the supply enters circulation through claims against the genesis UTXO mirror.
3. **Validator security is funded from a reserve, not from minting.** Validators earn from a pre-allocated reserve that depletes over time, preserving the cap.

This page describes how those principles are implemented in the v1 chain code. Forward-looking economic mechanisms (re-mining, pool fees, liquid staking) are covered in [Vision & Roadmap](vision-and-roadmap.md).

## Supply

* **Total supply cap**: 21,000,000 QBTC.
* **Denomination**: `qbtc` (smallest unit conventionally referred to as `uqbtc`, 1 QBTC = 10⁶ uqbtc, matching standard Cosmos decimal handling; subject to final parameter confirmation at mainnet).

The cap is enforced at genesis by allocating the entire supply across two pools (described below). No new QBTC is ever minted after genesis.

## Allocation at genesis

The 21M cap is divided between two pools. Both flow into circulation through activity, not through privileged unlocks.

### Pool A: Claim pool

* **Purpose.** Backs the per-UTXO claim entitlements for the Bitcoin UTXO set.
* **Size.** Determined by the Bitcoin UTXO snapshot at the mirror's reference height. In aggregate, this is the BTC supply at that height, scaled 1:1 to QBTC.
* **How it enters circulation.** Bitcoin holders submit ZK proofs of ownership; the corresponding entitlement is transferred from the claim pool to the holder's QBTC address. Unclaimed entries remain in the pool indefinitely and do not expire.

### Pool B: Validator reserve

* **Purpose.** Funds validator rewards over time.
* **Size.** The remainder of the 21M cap after the claim pool is allocated.
* **How it enters circulation.** Released per-block via the emission formula below, transferred into the standard Cosmos `x/distribution` fee collector for validator and delegator payment.

There is no third pool. No "foundation reserve." No "team treasury." No "ecosystem grants fund."

## Validator emission

Per `x/qbtc/keeper/network_manager.go:24–47`:

```
release_per_block = reserve_balance / (EmissionCurve × BlocksPerYear)
```

Where, per `constants/constants.go`:

* `EmissionCurve = 5`
* `BlocksPerYear = 52,560,000` (≈10 blocks per minute)

This yields a smooth exponential drawdown: the reserve depletes asymptotically, and per-block rewards decrease over time. The total released over the life of the chain converges to the initial reserve size.

This is materially different from typical proof-of-stake chains, which mint new supply each block. QBTC's emission is a *transfer* from a finite reserve, not creation of new supply.

### Why a reserve, not inflation

The reserve model preserves the 21M cap for all time, matching Bitcoin's monetary policy. The cost is that long-term security funding is bounded: as the reserve depletes, validator rewards converge toward transaction fees only.

Two mechanisms compensate for this in QBTC's design:

1. **Transaction fees**, which scale with network activity.
2. **Governance-driven re-mining of dormant at-risk UTXOs** (see [Vision & Roadmap](vision-and-roadmap.md)), which converts an existential threat (quantum-vulnerable dormant BTC) into a sustainable validator subsidy.

## Distribution of rewards

Once QBTC released from the reserve hits the standard Cosmos fee collector, distribution follows standard `x/distribution` rules:

* A percentage goes to the **community pool** (configurable via governance).
* The remainder is distributed to validators in proportion to bonded stake.
* Each validator's commission is taken; the rest passes through to that validator's delegators.

There is no custom QBTC mechanism layered on top of `x/distribution`.

## What is not in the v1 economics

* **No community tax mechanism** beyond the standard `x/distribution` community pool.
* **No custom vesting** beyond what `x/auth/vesting` provides as a standard SDK feature.
* **No DeFi activation thresholds** or feature gating tied to economic state.
* **No liquidity-pool fee accrual** (the pool doesn't exist in v1).

## What changes with the post-MVP feature set

When the native liquidity pool and related features ship (post-MVP, see [Vision & Roadmap](vision-and-roadmap.md)), the validator reward stream gains additional components:

* Swap fees from the BTC ↔ QBTC pool.
* Pool-bonded validator economics that tie validator entry to liquidity provision.

These are economic *additions*. They do not change the 21M cap or the basic claim model.

## Comparison to Bitcoin

| Property | Bitcoin | QBTC v1 |
|---|---|---|
| Supply cap | 21M BTC | 21M QBTC |
| Reaches cap | ~2140 (asymptotic) | Asymptotic (reserve drawdown) |
| Block reward source | Newly minted (halving schedule) | Transferred from finite reserve |
| Inflation rate | Decreasing, asymptotic to 0 | Same shape, different mechanism |
| Genesis distribution | Mining only | Claim pool + reserve |
| Privileged founder allocation | None | None |

QBTC's economic shape matches Bitcoin's by intent. The mechanism differs because QBTC is a proof-of-stake chain and Bitcoin is proof-of-work, but the monetary outcome (a finite cap reached asymptotically, with no founder shortcut) is the same.

## See also

* [Fair Launch Principles (Learn)](../learn/fair-launch.md), the design philosophy in plain language.
* [Protocol Specification (v1)](protocol-spec.md), the canonical reference.
* [Vision & Roadmap](vision-and-roadmap.md), planned economic mechanisms.
