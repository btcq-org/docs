# Fair Launch Principles

QBTC is launched on terms that mirror Bitcoin's own. No pre-sale. No investor allocation. No team premine. The entire claimable supply belongs to people who already hold Bitcoin. The team earns rewards the same way anyone else does, by running infrastructure on the same terms as the public.

## What "fair launch" means here

A fair launch, in the sense QBTC uses the term, requires all of the following:

1. **No ICO, IDO, or pre-sale.** The token cannot be purchased from the project before launch. There is no fundraising round in which capital is exchanged for tokens at a discount.
2. **No investor allocation.** No venture capital, no strategic investors, no advisor allocation in token form.
3. **No team premine.** The team does not start with a private allocation of tokens unavailable to the public.
4. **Entitlement is determined by an external, immutable signal.** For QBTC, that signal is the Bitcoin UTXO set. Whoever holds BTC at the relevant block heights holds the claim. The team cannot change who gets what after the fact.
5. **The team earns by participating, not by being the team.** If the team wants tokens, they do what any other participant does: operate a node, accept the same risks, earn the same returns.

## Why this matters

The standard token-launch pattern (VC-backed pre-sales, team allocations vesting over multi-year cliffs, "ecosystem funds" controlled by a foundation) creates predictable outcomes:

* **Concentrated supply.** A handful of insiders control a large fraction of the float, with information asymmetry over public holders.
* **Misaligned incentives.** The team's payoff is dominated by token price, not by protocol utility. This biases decisions toward marketing over engineering.
* **Fragile launches.** The token launches with a known overhang of vesting cliffs, which suppresses price discovery and produces predictable sell pressure.

QBTC was designed to avoid all three. Because entitlement is determined by an external population of Bitcoin holders, the team has no privileged position. Because the team earns the same way anyone else does, the team's economic interest aligns with the protocol's actual functioning.

## How the supply works

The 21 million QBTC cap is fixed at genesis. Every QBTC in existence flows through one of two state locations: the **claim mirror** (entitlements tied 1:1 to live Bitcoin UTXOs) and the **Reserve Module** (a module account holding everything else).

The Reserve Module is the engine. Two flows out, one flow in.

### The claim mirror

QBTC tracks Bitcoin's UTXO set continuously, not as a frozen snapshot. Every Bitcoin UTXO that exists right now has a corresponding QBTC entitlement of equal size in the mirror. When Bitcoin produces a new block, the mirror updates:

* New UTXOs (including coinbase rewards) get new claim entries. The QBTC for these new entries is drawn from the Reserve Module, preserving the 21M cap.
* Spent UTXOs are reconciled.
* Whoever currently controls a Bitcoin UTXO controls its QBTC claim. If you move your BTC, the new address holds the new claim.

A Bitcoin holder converts a claim into spendable QBTC by submitting a zero-knowledge proof of ownership for their Bitcoin address. The claim is then exhausted on QBTC, preventing double-claims. The BTC itself is untouched.

### Validator emission, from the Reserve Module

Validators are paid from the Reserve Module. Each block, a small fraction of the Reserve's balance is released to validators via the standard Cosmos `x/distribution` flow:

```
release_per_block = reserve_balance / (EmissionCurve × BlocksPerYear)
```

This is materially different from typical proof-of-stake chains, which mint *new* supply each block to fund validators. QBTC does not mint. The 21M cap holds for all time.

### Replenishment, via governance reclaiming dormant exposed-key BTC

Bitcoin holds an estimated 1 million+ BTC in UTXOs older than 17 years whose public keys are exposed on-chain (P2PK outputs, reused-address outputs). On Bitcoin Legacy, these coins will be the first stolen the moment a cryptographically-relevant quantum computer exists.

QBTC's tokenomics use this asymmetry productively. Through on-chain governance, the QBTC entitlement of these quantum-vulnerable dormant UTXOs is **reclaimed**: removed from the claim mirror and returned to the Reserve Module. The economic value that would otherwise be captured by a quantum attacker is instead recycled into the QBTC validator reward pool.

The framing is straightforward. Bitcoin holds a pool of value sitting in addresses that can no longer be secured. QBTC removes that value from vulnerable circulation and redistributes it to a quantum-safe address: the Reserve, which secures the post-quantum migration.

This is a structural part of the tokenomic design, not an optional add-on. It is governed by the validator set through standard on-chain governance, with no privileged path.

### The aggregate picture

| State | Holds | Changes |
|---|---|---|
| Claim mirror | QBTC entitlements tied 1:1 to live BTC UTXOs | Grows as new BTC is mined. Shrinks as users claim, or as governance reclaims dormant exposed-key UTXOs. |
| Reserve Module | The non-circulating remainder of the 21M cap | Decreases as new BTC is mirrored and as validators are paid. Increases as governance reclaims dormant exposed-key UTXOs. |
| Circulation | QBTC that holders have actually claimed and validators have actually earned | Grows monotonically. |

The cap is preserved by construction: the three state locations always sum to 21 million QBTC.

## What the team gets

The team that built QBTC does not start the chain with QBTC. The team earns QBTC the same way anyone else can:

* By running validator nodes and providing the capital required to bond them.
* By being a Bitcoin holder and claiming the corresponding QBTC.

There is no special role, no special multiplier, no reserved seat in the validator set.

## What this rules out

* **Insider rounds at discounted prices.** No.
* **Team tokens that vest into circulation.** No.
* **Pre-launch yield programs that allocate tokens to early participants on terms unavailable later.** No.
* **Retroactive airdrops to wallets that did specific things to qualify.** No. Entitlement is determined by holding BTC, not by performing actions the project rewards.
* **Foundation control over a significant fraction of supply.** No.

## What it does not rule out

Fair launch does not mean "no organization exists to maintain the protocol." It means the organization does not have a privileged token position. The team and any associated foundation will exist, will fundraise in conventional ways (fiat, equity in operating entities), and will operate validator infrastructure on the same terms as anyone else.

It also does not mean QBTC will be evenly distributed at launch. The Bitcoin UTXO set is itself uneven; a small number of addresses hold a large fraction of supply. QBTC inherits Bitcoin's distribution, for better and worse. What it does not do is *worsen* that distribution by adding a layer of insider allocation on top.

## Read next

* [What is QBTC?](what-is-qbtc.md)
* [Roadmap](roadmap.md)
* [Tokenomics (Research)](../research/tokenomics.md)
