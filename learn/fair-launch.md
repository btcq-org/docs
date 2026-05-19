# Fair Launch Principles

QBTC is launched on terms that mirror Bitcoin's own. No pre-sale. No investor allocation. No team premine. The entire claimable supply belongs to people who already hold Bitcoin. The team earns rewards the same way anyone else does, by running infrastructure on the same terms as the public.

## What "fair launch" means here

A fair launch, in the sense QBTC uses the term, requires all of the following:

1. **No ICO, IDO, or pre-sale.** The token cannot be purchased from the project before launch. There is no fundraising round in which capital is exchanged for tokens at a discount.
2. **No investor allocation.** No venture capital, no strategic investors, no advisor allocation in token form.
3. **No team premine.** The team does not start with a private allocation of tokens unavailable to the public.
4. **Entitlement is determined by an external, immutable signal.** For QBTC, that signal is the Bitcoin UTXO set. Whoever holds BTC at the relevant block heights holds the claim. The team cannot change who gets what after the fact.
5. **The team earns by participating, not by being the team.** If the team wants tokens, they do what any other participant does: operate a node, accept the same risks, earn the same returns.

## Failure modes this avoids

The standard token-launch pattern (VC-backed pre-sales, team allocations vesting over multi-year cliffs, "ecosystem funds" controlled by a foundation) produces three predictable outcomes:

* **Concentrated supply.** Insiders control a large fraction of the float with information asymmetry over public holders.
* **Misaligned incentives.** The team's payoff is dominated by token price, not protocol utility, biasing decisions toward marketing over engineering.
* **Fragile launches.** Known vesting overhangs suppress price discovery and produce predictable sell pressure.

QBTC avoids all three. Entitlement is determined by an external population of Bitcoin holders. The team earns the same way anyone else does.

## How the supply works

QBTC has a hard cap of **21 million QBTC**, mirroring Bitcoin. No QBTC is pre-minted at genesis. Tokens are only created when one of two events happens: a user claim, or a successful governance reclamation. The cap is enforced because no Bitcoin UTXO can be claimed twice.

### The claim mirror

QBTC's chain state contains a continuous mirror of Bitcoin's UTXO set. For every live Bitcoin UTXO, the mirror records an **entitlement**: who can mint how much QBTC by proving ownership.

The mirror is a ledger of entitlements. QBTC tokens are minted only when an entitlement is exercised.

Whoever currently controls a Bitcoin UTXO controls the corresponding entitlement. If you spend your BTC on Bitcoin, the new outputs at the recipient addresses carry the entitlement instead.

### Path 1: A Bitcoin holder claims

A user submits a zero-knowledge proof of ownership of a Bitcoin address along with a list of UTXOs to claim and a destination QBTC address. The chain verifies the proof, marks the referenced UTXOs as claimed in the mirror, and mints QBTC into the user's account. The minted amount equals the sum of the claimed UTXOs' BTC values.

Claims do not expire. Holders can wait indefinitely. Holders can also choose never to claim.

### Path 2: Governance reclaims dormant exposed-key BTC

Bitcoin holds an estimated 1 million+ BTC in UTXOs older than 17 years whose public keys are exposed on-chain (P2PK outputs, reused-address outputs). On Bitcoin Legacy, these are the coins that will be stolen first by a quantum-capable attacker.

QBTC governance reclaims these UTXOs. Through standard `x/gov` proposals on a roughly two-week voting cadence, validators vote on which dormant exposed-key UTXOs to reclaim. When a proposal passes:

1. The referenced UTXOs are marked as claimed in the mirror, with the same flag a user claim would set.
2. QBTC equal to the reclaimed BTC value is minted into the **Reserve Module**.
3. The reclaimed UTXOs cannot be claimed by a user. Bitcoin spends out of these UTXOs propagate the claimed status to the resulting child outputs, so descendants are also ineligible to claim QBTC.

Value that would otherwise be captured by a quantum attacker on Bitcoin Legacy is minted into a quantum-safe address (the Reserve Module), which funds validator emission on the post-quantum chain.

Governance reclamation is the only inflow to the Reserve. There is no other source of validator emission funding.

### Validator emission, from the Reserve Module

The Reserve Module is a module account on the chain. Its balance accumulates from successful governance reclamations (Path 2 above).

Each block, a fraction of the Reserve's balance is released to validators via standard Cosmos `x/distribution`:

```
release_per_block = reserve_balance / (EmissionCurve × BlocksPerYear)
```

No new QBTC is minted to pay validators. The Reserve Module is the source.

### Cap enforcement

The 21M cap holds because:

* A Bitcoin UTXO can be claimed exactly once, by either a user or by governance, never both.
* A claim mints exactly the BTC amount of that UTXO into QBTC.
* Bitcoin's total supply is capped at 21M.
* Therefore total QBTC ever minted is at most 21M.

There is no other source of QBTC in the system.

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
