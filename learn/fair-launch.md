---
title: "Fair Launch Principles"
description: "QBTC has no pre-sale, no investor allocation, no advisor allocation. Every QBTC entitlement belongs to people who already hold Bitcoin."
---

QBTC launches on terms that mirror Bitcoin's own. No pre-sale. No investor allocation. No team premine. The entire claimable supply belongs to people who already hold Bitcoin. There is no genesis allocation to anyone.

## What "fair launch" means here

A fair launch, in the sense QBTC uses the term, requires all of the following:

1. **No ICO, IDO, or pre-sale.** The token cannot be purchased from the project before launch. There is no fundraising round in which capital is exchanged for tokens at a discount.
2. **No investor allocation.** No venture capital, no strategic investors, no advisor allocation in token form.
3. **No team premine.** The chain ships with zero QBTC in circulation. No tokens are minted to founders, contributors, or any privileged wallet at genesis.
4. **Entitlement is determined by an external, immutable signal.** For QBTC, that signal is the Bitcoin UTXO set. Whoever currently controls a Bitcoin UTXO controls the corresponding QBTC entitlement. The project cannot alter who gets what after the fact.
5. **Anything beyond Path 1 user claims requires governance.** Every other path through which QBTC enters circulation is voted on by the validator set on-chain.

## Failure modes this avoids

The standard token-launch pattern (VC-backed pre-sales, team allocations vesting over multi-year cliffs, "ecosystem funds" controlled by a foundation) produces three predictable outcomes:

* **Concentrated supply.** Insiders control a large fraction of the float with information asymmetry over public holders.
* **Misaligned incentives.** The team's payoff is dominated by token price, not protocol utility, biasing decisions toward marketing over engineering.
* **Fragile launches.** Known vesting overhangs suppress price discovery and produce predictable sell pressure.

QBTC avoids all three. Entitlement at genesis is determined entirely by an external population of Bitcoin holders.

## How the supply works

QBTC has a hard cap of **21 million QBTC**, mirroring Bitcoin. Tokens are created only when one of two events happens: a user claim, or a successful governance reclamation. The cap is enforced because no Bitcoin UTXO can be claimed twice.

### The claim mirror

The chain state contains a continuous mirror of Bitcoin's UTXO set. For every live Bitcoin UTXO, the mirror records an entitlement: who can mint how much QBTC by proving ownership.

The mirror is a ledger of entitlements. QBTC tokens are minted only when an entitlement is exercised.

Whoever currently controls a Bitcoin UTXO controls the corresponding entitlement. If you spend your BTC on Bitcoin, the new outputs at the recipient addresses carry the entitlement instead.

### Path 1: A Bitcoin holder claims

A user submits a zero-knowledge proof of ownership of a Bitcoin address along with a list of UTXOs to claim and a destination QBTC address. The chain verifies the proof, marks the referenced UTXOs as claimed, and mints QBTC into the user's account. The minted amount equals the sum of the claimed UTXOs' BTC values.

A holder can claim today, in a decade, or never at all, with one exception described below.

### Path 2: Governance reclaims dormant exposed-key BTC

Bitcoin holds roughly 1.7M BTC in Satoshi-era P2PK outputs (public key permanently on-chain) plus additional BTC in reused-address outputs where the public key has been revealed. On Bitcoin Legacy, these are the coins that will be stolen first by a quantum-capable attacker. Per-category breakdown: [indexer.qbtc.net](https://indexer.qbtc.net).

QBTC governance reclaims these UTXOs. Through standard `x/gov` proposals on a roughly two-week voting cadence, validators vote on which dormant exposed-key UTXOs to reclaim. When a proposal passes:

1. The referenced UTXOs are marked as claimed in the mirror, with the same flag a user claim would set.
2. QBTC equal to the reclaimed BTC value is minted on the chain and distributed across three on-chain accounts (described below).
3. The reclaimed UTXOs cannot be claimed by a user. Bitcoin spends out of these UTXOs propagate the claimed status to the resulting child outputs, so descendants are also ineligible to claim QBTC.

Value that would otherwise be captured by a quantum attacker is instead distributed to addresses that secure the post-quantum migration.

### How reclaimed QBTC is split

Every governance reclamation distributes the minted QBTC across three on-chain accounts at a fixed ratio:

| Destination | Share | What it funds |
|---|---|---|
| **Reserve Module** | 90% | Validator emission. The chain releases this to validators per-block. |
| **Development Fund** | 5% | Continued protocol development. Spends from this fund require `x/gov` approval. |
| **Ecosystem Fund** | 5% | Adoption, education, ecosystem growth. Spends require `x/gov` approval. |

The 5+5 share is the project's funding mechanism. It does not exist at genesis. It accrues only when a reclamation proposal passes a validator vote, and every spend from these funds is itself subject to a separate governance vote. The amounts, the split, and the existence of the funds can all be changed by future governance.

This is materially different from a team premine or a vesting cliff:

* Nothing is allocated at genesis.
* Funding is tied to real on-chain economic events (governance reclamations), not to time-based unlocks.
* The funds are on-chain treasuries, not private wallets. Every disbursement is publicly recorded.
* If validators decide the project no longer warrants funding, they can vote to stop.

QBTC funds its own continued development out of value that would otherwise be lost to a quantum attacker, on terms set by the validator set. Bitcoin Core is funded by donations and corporate sponsorship; QBTC is funded by a transparent on-chain mechanism gated by governance.

## What the project gets

The project that built QBTC starts with zero QBTC. There is no founder wallet pre-loaded with tokens. Contributors who want QBTC can:

* Hold Bitcoin and claim, like anyone else.
* Operate validator nodes, providing the capital and infrastructure required.
* Receive disbursements from the Development Fund through governance-approved spends, on terms transparent to the entire network.

There is no special role, no special multiplier, no reserved seat in the validator set.

## What this rules out

* **Insider rounds at discounted prices.** No.
* **Genesis team allocation that vests into circulation.** No.
* **Pre-launch yield programs that allocate tokens to early participants on terms unavailable later.** No.
* **Foundation control over a significant fraction of supply.** No. The Development and Ecosystem funds are governance-gated, not foundation-controlled.

## What it does not rule out

Fair launch does not mean "no organization exists to maintain the protocol." A team and any associated foundation will exist, will fundraise in conventional ways (fiat, equity in operating entities), and will operate validator infrastructure on the same terms as anyone else. The team also accesses the Development Fund through governance-approved proposals.

It also does not mean QBTC will be evenly distributed at launch. The Bitcoin UTXO set is itself uneven; a small number of addresses hold a large fraction of supply. QBTC inherits Bitcoin's distribution, for better and worse. What it does not do is *worsen* that distribution by adding a layer of insider allocation on top.

## Read next

* [What is QBTC?](/learn/what-is-qbtc)
* [Roadmap](/learn/roadmap)
* [Tokenomics (Research)](/research/tokenomics)
