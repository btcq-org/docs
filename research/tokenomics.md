# Tokenomics

QBTC's economic design rests on three invariants:

1. **Cap matches Bitcoin.** Total supply is 21 million QBTC, fixed for all time. No inflation.
2. **The claim mirror tracks Bitcoin 1:1, continuously.** Every Bitcoin UTXO that exists at any time has a corresponding QBTC entitlement of equal size.
3. **Validator security is funded by the Reserve Module**, not by minting new supply.

Forward-looking economic mechanisms attached to the post-MVP feature set (pool fees, pool-bonded validator economics) are covered in [Vision & Roadmap](vision-and-roadmap.md). This page covers the v1 economic engine.

## State locations

At any instant, every QBTC is in exactly one of three places.

| Location | What it holds |
|---|---|
| **Claim mirror** | QBTC entitlements tied 1:1 to currently-live Bitcoin UTXOs. Cannot be spent until claimed. |
| **Reserve Module** | A module account holding the remainder of the 21M cap that is not currently mirrored as claims. |
| **Circulation** | QBTC that has been claimed by a holder (out of the mirror) or paid to a validator (out of the Reserve). Freely transferable. |

The three sum to 21,000,000 QBTC. This invariant is preserved at every state transition.

## The Reserve Module

The Reserve Module is the central tokenomic engine. It has two outflows and one inflow.

### Outflow 1: Mirroring new Bitcoin coinbase outputs

When Bitcoin produces a new block, its coinbase output adds new BTC to the live UTXO set. To maintain the 1:1 mirror invariant, the chain releases QBTC of equal size from the Reserve Module into the claim mirror, as a new entitlement attached to the new BTC UTXO.

This means Bitcoin's tail emission directly drives drawdown of QBTC's Reserve.

### Outflow 2: Validator emission

Each block, a fraction of the Reserve balance is released to validators via the standard Cosmos `x/distribution` fee collector:

```
release_per_block = reserve_balance / (EmissionCurve × BlocksPerYear)
```

Constants in v1 (per `constants/constants.go`):

* `EmissionCurve = 5`
* `BlocksPerYear = 52,560,000` (~10 blocks per minute)

The shape is asymptotic. As the Reserve depletes, per-block emission decreases.

### Inflow: Governance reclamation of dormant exposed-key UTXOs

Bitcoin UTXOs that satisfy both of the following:

* Older than **17 years**.
* Public key is on-chain (P2PK outputs and reused-address outputs).

These coins are **structurally indefensible** against a quantum-capable attacker: their owners (if any) cannot move them faster than a Shor's-algorithm operator who can derive the private key directly from the exposed public key.

On Bitcoin Legacy, these coins will be captured by the first viable quantum attacker. The economic value will leave the network.

On QBTC, this value is reclaimed productively. Through standard on-chain governance, the QBTC entitlement attached to these UTXOs is removed from the claim mirror and returned to the Reserve Module. Two effects:

1. **The Reserve is replenished.** Validator emission can be sustained beyond the simple decay of the initial Reserve.
2. **The 1:1 mirror invariant is intentionally violated for this specific class of UTXO**, by design. The QBTC claim for these BTC outputs becomes permanently exhausted, even though the underlying BTC is still in Bitcoin's UTXO set.

The narrative: QBTC removes value from vulnerable circulation (BTC sitting in addresses that can no longer be secured) and redistributes it to a quantum-safe address (the Reserve, which secures the post-quantum chain).

## Allocation at genesis

* **Total cap**: 21,000,000 QBTC.
* **Initial claim mirror**: sized to match the Bitcoin UTXO set at QBTC genesis (~19.7 million BTC at current dates, growing toward 21M as Bitcoin's emission continues).
* **Initial Reserve Module**: 21,000,000 − initial claim mirror size.

There is no team allocation. No investor allocation. No premine. No reserved seats in the validator set.

## What this means for participants

### For BTC holders

* Your claim is 1:1 to your live BTC UTXOs, at any time.
* Claims do not expire.
* If you move your BTC to a new address, the new address holds the new claim.
* The exception: if you hold BTC in a P2PK output or in a reused-address output older than 17 years, that UTXO's QBTC entitlement is subject to reclamation by governance.

### For validators

* Rewards come from the Reserve Module via standard `x/distribution`.
* Long-term sustainability is supported by governance reclamation of dormant exposed-key UTXOs, which replenishes the Reserve.

### For institutions and researchers

* The 21M cap is enforced by construction. No inflationary leak.
* The economic engine is transparent and on-chain.
* The reclamation mechanism converts an existential threat (quantum-vulnerable dormant BTC) into a sustainable validator subsidy.

## Distribution of validator rewards

Once QBTC released from the Reserve hits the standard Cosmos fee collector, distribution follows standard `x/distribution` rules:

* A configurable percentage goes to the community pool.
* The remainder is distributed to validators in proportion to bonded stake.
* Each validator's commission is taken; the rest passes through to delegators.

No custom QBTC mechanism is layered on top of `x/distribution`.

## Out of scope for v1 economics

* No community tax mechanism beyond the standard `x/distribution` community pool.
* No custom vesting beyond what `x/auth/vesting` provides as a standard SDK feature.
* No feature-activation thresholds tied to economic state.
* No liquidity-pool fees (no pool in v1).

## Comparison to Bitcoin

| Property | Bitcoin | QBTC v1 |
|---|---|---|
| Supply cap | 21M BTC | 21M QBTC |
| Time to cap | ~2140 (asymptotic) | Asymptotic (Reserve depletion) |
| Block reward source | Newly minted (halving schedule) | Transferred from finite Reserve |
| Inflation | Decreasing, asymptotic to 0 | Strictly zero |
| Genesis distribution | Mining only | Claim mirror + Reserve |
| Privileged founder allocation | None | None |
| Recovery mechanism for quantum-lost coins | None | Governance reclamation of dormant exposed-key UTXOs |

## See also

* [Fair Launch Principles](../learn/fair-launch.md), the design philosophy in plain language.
* [Protocol Specification (v1)](protocol-spec.md), the canonical chain reference.
* [Vision & Roadmap](vision-and-roadmap.md), planned economic mechanisms tied to post-MVP features.
