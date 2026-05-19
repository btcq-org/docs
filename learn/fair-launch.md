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

## Where the supply comes from

Every unit of QBTC enters circulation through one of two mechanisms, both open to anyone.

### 1. Claims from the Bitcoin UTXO mirror

At genesis, QBTC's state contains a pre-allocated claim entry for every Bitcoin UTXO. Each entry is sized to match the BTC amount at that UTXO. A Bitcoin holder converts a claim into spendable QBTC by submitting a zero-knowledge proof of ownership for the corresponding BTC address. When a claim is exercised, it is deleted from the claim pool, preventing double-claims.

The total claim supply is fixed at the size of the Bitcoin UTXO set as of the mirror's reference height. No new claims are created over time.

### 2. Validator emission from a pre-allocated reserve

QBTC's validators receive rewards from a **pre-allocated reserve** held by the chain, not from inflationary minting. At genesis, the reserve is funded as part of the 21 million QBTC cap. Each block, a small fraction of the reserve is released to validators, on a schedule defined by two parameters:

* `EmissionCurve`, a divisor that controls how fast the reserve is drawn down.
* `BlocksPerYear`, the expected block count per year.

Specifically, the amount released per block is approximately:

```
release_per_block = reserve_balance / (EmissionCurve × BlocksPerYear)
```

Released QBTC flows into the standard Cosmos `x/distribution` fee collector, which pays validators and delegators according to standard proof-of-stake distribution.

Because emission comes from a finite reserve rather than from minting new supply, the total cap of 21 million QBTC is preserved. As the reserve depletes, per-block rewards decrease. There is no perpetual inflation.

This is materially different from typical proof-of-stake chains, which mint new supply each block. QBTC chose the reserve model so that the 21M cap holds for all time, matching Bitcoin's monetary policy.

### Also planned: re-mining dormant at-risk UTXOs (governance-driven)

The protocol specification defines a third source of validator rewards: re-mining the QBTC entitlement of **quantum-vulnerable dormant Bitcoin UTXOs older than 17 years**. The intent is to redirect the QBTC claim for such UTXOs back into the validator reward pool, on the principle that these coins would otherwise be the first stolen by a quantum-capable attacker on Bitcoin Legacy.

This mechanism is **governance-driven** rather than enforced in the v1 chain code. Validators will activate it through standard on-chain governance once mainnet is established. See the [Roadmap](roadmap.md) for status.

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
