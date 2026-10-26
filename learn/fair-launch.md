---
title: "Fair Launch Principles"
description: "QBTC has no sale, no premine, no investor allocation and no vesting. Every QBTC entitlement belongs to people who already hold Bitcoin."
---

QBTC launches on terms that mirror Bitcoin's own. No sale. No investor allocation. No team premine. No vesting. The entire claimable supply belongs to people who already hold Bitcoin. Genesis has one mint: 50 QBTC for the first validator. In exchange, the block-9 Bitcoin coinbase output (50 BTC) cannot be claimed, so the cap stays the same.

## What "fair launch" means here

A fair launch, in the sense QBTC uses the term, requires all of the following:

1. **No ICO, IDO, or pre-sale.** The token cannot be purchased from the project before launch. There is no fundraising round in which capital is exchanged for tokens at a discount.
2. **No investor allocation.** No venture capital and no strategic investors in token form.
3. **No team premine.** No tokens are minted to founders or contributors at genesis. The only genesis mint is 50 QBTC for the first validator, offset by the unclaimable block-9 coinbase output.
4. **Entitlement is determined by an external, immutable signal.** For QBTC, that signal is the Bitcoin UTXO set. Whoever currently controls a Bitcoin UTXO controls the corresponding QBTC entitlement. The project cannot alter who gets what after the fact.
5. **Anything beyond Path 1 user claims requires governance.** Apart from the 50 QBTC genesis mint, every other path through which QBTC enters circulation is voted on on-chain.

## Failure modes this avoids

The standard token-launch pattern (VC-backed pre-sales, team allocations vesting over multi-year cliffs, "marketing funds" controlled by a foundation) produces three predictable outcomes:

* **Concentrated supply.** Insiders control a large fraction of the float with information asymmetry over public holders.
* **Misaligned incentives.** The team's payoff is dominated by token price, not protocol utility, biasing decisions toward marketing over engineering.
* **Fragile launches.** Known vesting overhangs suppress price discovery and produce predictable sell pressure.

QBTC avoids all three. Entitlement at genesis is determined entirely by an external population of Bitcoin holders.

## How the supply works

QBTC has a hard cap of **21 million QBTC**, mirroring Bitcoin. After the 50 QBTC genesis mint, tokens are created only when one of two events happens: a user claim, or a successful governance reclamation. The cap is enforced because no Bitcoin UTXO can be claimed twice.

### The claim mirror

The chain state contains a continuous mirror of Bitcoin's UTXO set. For every live Bitcoin UTXO, the mirror records an entitlement: who can mint how much QBTC by proving ownership.

The mirror is a ledger of entitlements. QBTC tokens are minted only when an entitlement is exercised.

Whoever currently controls a Bitcoin UTXO controls the corresponding entitlement. If an unclaimed coin moves on Bitcoin, its claim moves with it to the new outputs. A claimed coin stays claimed after it moves. Eligibility is live with no snapshot date.

### Path 1: A Bitcoin holder claims

A user submits a zero-knowledge proof of ownership of a Bitcoin address along with a list of UTXOs to claim and a destination QBTC address. The chain verifies the proof, marks the referenced UTXOs as claimed, and mints QBTC into the user's account. The minted amount equals the sum of the claimed UTXOs' BTC values.

The zero-knowledge self-claim supports P2PKH (`1…`) and P2WPKH (`bc1q…`) outputs today. A new output needs 144 Bitcoin confirmations (about one day) before it can claim.

A holder can claim today, in a decade, or never at all, with one exception described below.

### Path 2: Governance reclaims dormant exposed-key BTC

Bitcoin holds roughly 1.7M BTC in Satoshi-era P2PK outputs (public key permanently on-chain) plus additional BTC in reused-address outputs where the public key has been revealed. On Bitcoin Legacy, these are the coins that will be stolen first by a quantum-capable attacker. Per-category breakdown: [indexer.qbtc.net](https://indexer.qbtc.net).

QBTC governance can reclaim these UTXOs. Through standard `x/gov` proposals, validators vote on which dormant exposed-key UTXOs to reclaim. The target is outputs that have not moved for more than 17 years. The cutoff is a Bitcoin block height written into each proposal. Later votes can move it forward. When a proposal passes:

1. The referenced UTXOs are marked as claimed in the mirror, with the same flag a user claim would set.
2. QBTC equal to the reclaimed BTC value is minted on the chain and split 90 / 5 / 5 (described below).
3. The reclaimed UTXOs cannot be claimed by a user. Bitcoin spends out of these UTXOs propagate the claimed status to the resulting child outputs, so descendants are also ineligible to claim QBTC.

The reclaim does not protect the coins on Bitcoin. It sends the matching QBTC to the Reserve and the two project funds.

### How reclaimed QBTC is split

Every governance reclamation splits the minted QBTC 90 / 5 / 5:

| Destination | Share | What it funds |
|---|---|---|
| **Reserve Module** | 90% | Validator emission. The chain releases this to validators per-block. |
| **Development fund** | 5% | Continued protocol development. |
| **Marketing fund** | 5% | Adoption and education. |

The 5 + 5 share is the project's only share of QBTC. It does not exist at genesis. It accrues only when a reclamation proposal passes a validator vote.

This is materially different from a team premine or a vesting cliff:

* The only genesis mint is 50 QBTC for the first validator. The two funds start empty.
* Funding is tied to on-chain events (governance reclamations), not to time-based unlocks.
* Every reclamation is a public on-chain vote.

Bitcoin Core is funded by donations and corporate sponsorship. QBTC funds its development from a share of governance reclamations.

## What the project gets

The project starts with no QBTC. There is no founder wallet pre-loaded with tokens. Contributors who want QBTC can:

* Hold Bitcoin and claim, like anyone else.
* Operate validator nodes, providing the capital and infrastructure required.
* Receive QBTC from the development fund.

There is no special multiplier.

## What this rules out

* **Insider rounds at discounted prices.** No.
* **Genesis team allocation that vests into circulation.** No.
* **Pre-launch yield programs that allocate tokens to early participants on terms unavailable later.** No.

## What it does not rule out

Fair launch does not mean "no organization exists to maintain the protocol." A team and any associated foundation will exist, and will fundraise in conventional ways (fiat, equity in operating entities). The team also receives the development fund share.

It also does not mean QBTC will be evenly distributed at launch. The Bitcoin UTXO set is itself uneven; a small number of addresses hold a large fraction of supply. QBTC inherits Bitcoin's distribution, for better and worse. What it does not do is *worsen* that distribution by adding a layer of insider allocation on top.

## Read next

* [What is QBTC?](/learn/what-is-qbtc)
* [Roadmap](/learn/roadmap)
* [Tokenomics (Research)](/research/tokenomics)
