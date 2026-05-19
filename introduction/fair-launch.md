# Fair Launch Principles

QBTC is launched on terms that mirror Bitcoin's own: no pre-sale, no investor allocation, no team premine. The entire supply is claimable by people who already hold Bitcoin. The team earns rewards the same way anyone else does — by running infrastructure and providing liquidity, on the same terms as the public.

This page explains what "fair launch" means concretely for QBTC and what it rules out.

## What "fair launch" means here

A fair launch, in the sense QBTC uses the term, requires all of the following:

1. **No ICO, IDO, or pre-sale.** The token cannot be purchased from the project before launch. There is no fundraising round in which capital is exchanged for tokens at a discount.
2. **No investor allocation.** No venture capital, no strategic investors, no advisor allocation in token form.
3. **No team premine.** The team does not start with a private allocation of tokens unavailable to the public.
4. **Entitlement is determined by an external, immutable signal.** For QBTC, that signal is the Bitcoin UTXO set: whoever holds BTC at the relevant block heights holds the claim. The team cannot change who gets what after the fact.
5. **The team earns by participating, not by being the team.** If the team wants tokens, they do what any other participant does — operate a node, provide liquidity, take the same risks, accept the same returns.

## Why this matters

The standard token-launch pattern — VC-backed pre-sales, team allocations vesting over multi-year cliffs, "ecosystem funds" controlled by a foundation — creates predictable outcomes:

- **Concentrated supply.** A handful of insiders control a large fraction of the float, with information asymmetry over public holders.
- **Misaligned incentives.** The team's payoff is dominated by token price, not by protocol utility. This biases decisions toward marketing over engineering.
- **Fragile launches.** The token launches with a known overhang of vesting cliffs, which suppresses price discovery and produces predictable sell pressure.

QBTC was designed to avoid all three. Because the supply is claimable by an external population — Bitcoin holders — the team has no privileged position. Because the team earns the same way anyone else does, the team's economic interest is aligned with the protocol's actual functioning.

## How the supply is allocated

Every unit of QBTC enters circulation through one of two mechanisms, both of which are open to anyone:

1. **Claims.** Bitcoin holders convert their pre-allocated claims into spendable QBTC by submitting a zero-knowledge proof of ownership of their BTC address. The total claim supply is sized to match Bitcoin's UTXO set as of the mirror's reference height.
2. **Validator emission.** Validators who secure the network earn newly-minted QBTC over time, on a schedule tied to block production. This is the standard proof-of-stake reward model. Anyone can become a validator subject to the protocol's bonding requirements.

There is no third bucket. No "foundation reserve," no "team treasury," no "ecosystem grants fund" allocated at genesis.

## What the team does (and doesn't) get

The team that built QBTC does not start the chain with QBTC. The team can earn QBTC the same way anyone can:

- By running validator nodes and providing the capital required to bond them.
- By providing liquidity to the protocol's native liquidity pool and accepting the impermanent-loss risk that comes with it.
- By being a Bitcoin holder and claiming the corresponding QBTC.

There is no special role, no special multiplier, no reserved seat in the validator set. If the team wants influence over QBTC's economic outcome, it has to take the same risks every other participant does.

## What this rules out

Some practices common to other launches are explicitly off the table for QBTC:

- **Insider rounds at discounted prices.** No.
- **Team tokens that vest into circulation.** No.
- **Pre-launch yield programs that allocate tokens to early participants on terms unavailable later.** No.
- **Retroactive airdrops to wallets that did specific things to qualify.** No — entitlement is determined by holding BTC, not by performing actions the project rewards.
- **Foundation control over a significant fraction of supply.** No.

## What it does not rule out

Fair launch does not mean "no organization exists to maintain the protocol." It means the organization does not have a privileged token position. The team and any associated foundation will exist, will fundraise in conventional ways (fiat, equity in operating entities), and will operate validator infrastructure on the same terms as anyone else.

It also does not mean QBTC will be cheap or evenly distributed at launch. The Bitcoin UTXO set is itself uneven — a small number of addresses hold a large fraction of supply. QBTC inherits Bitcoin's distribution, for better and worse. What it does not do is *worsen* that distribution by adding a layer of insider allocation on top.

## Read next

- [Tokenomics Overview](../tokenomics/README.md)
- [Supply & Distribution](../tokenomics/supply-and-distribution.md)
- [Validator Rewards & Emission](../tokenomics/rewards-and-emission.md)
