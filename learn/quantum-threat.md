# The Quantum Threat to Bitcoin

> Quantum is coming.
>
> Bitcoin knows it.
>
> Today's signatures will not hold.
>
> The fix must exist before the math breaks.
>
> And it must still be Bitcoin.

**Roughly 1 million Bitcoin sits in addresses that can be stolen the moment a sufficiently large quantum computer exists.** Most of these are the oldest coins on the network, including a large portion of Satoshi-era holdings. Every actively-spent address is also exposed during the brief window when a transaction is broadcast.

Bitcoin needs to migrate before quantum computers reach that scale. The cryptography community, NIST, and a growing number of standards bodies broadly agree that this window arrives within the next decade. QBTC exists so Bitcoin holders have somewhere to migrate to, on their own schedule, before the window closes.

## How Bitcoin signatures work, and where they break

Bitcoin uses a signature scheme called **ECDSA** over a specific elliptic curve called **secp256k1**. To send Bitcoin, you sign a transaction with your private key. Anyone can verify the signature using your public key.

The security of this scheme rests on a one-way relationship: it's easy to derive a public key from a private key, but practically impossible to go the other way around — for a classical computer.

A sufficiently large quantum computer running **Shor's algorithm** can reverse that direction. Given your public key, it can derive your private key. Then it can sign whatever it wants on your behalf.

This is the threat. Not "quantum will break Bitcoin in general," but specifically: **any Bitcoin address whose public key has ever been revealed becomes spendable by a quantum attacker.**

## Which Bitcoin is exposed, and when

There are two distinct categories of risk. They materialize on different timelines.

### Category 1: Addresses with exposed public keys (immediate risk on Q-day)

A Bitcoin public key becomes visible on-chain in two situations:

1. **P2PK outputs** (pay-to-public-key). The public key is literally the output. Most of these are Satoshi-era coinbase outputs that have never moved. Over 1 million BTC is estimated to sit here.
2. **Reused addresses.** Any time a Bitcoin address spends from itself, its public key is published as part of the transaction's input script. Once an address has spent even once, its public key is permanent and public forever.

For both categories, the moment a quantum computer can run Shor's algorithm at the required scale, the funds can be stolen by deriving the private key from the exposed public key.

The owners of these coins, if any are still around, **cannot defend themselves**. To move the coins, they would have to broadcast a transaction — which broadcasts the public key — which is the very thing that lets the attacker race them. There is no way to win that race once a quantum-capable adversary exists.

### Category 2: Addresses with only hashed public keys (mempool risk)

Modern Bitcoin addresses (P2PKH, P2WPKH) store only the **hash** of the public key on-chain. The hash itself is quantum-resistant — Grover's algorithm only provides a quadratic speedup, leaving these addresses effectively safe.

But the moment such an address spends, the public key is broadcast in the transaction. While the transaction sits in the mempool waiting to be mined, a quantum-capable adversary could:

1. Read the public key from the broadcast transaction.
2. Derive the private key.
3. Construct a competing transaction sending the entire balance to the attacker, with a higher fee.
4. Have miners include the attacker's transaction in the next block instead.

This is the "**short-range attack**" or "**live key attack**." It threatens every modern Bitcoin user the moment they try to spend.

## How much Bitcoin is at risk

Published estimates converge in the same range:

* Over **1 million BTC** sits in P2PK and reused-address outputs whose public keys are permanently exposed. This includes most of the dormant Satoshi-era coins.
* **Effectively all actively-spent BTC** is exposed during the mempool window of each transaction.

The total economically exposed surface, depending on how you count reused addresses and the time horizon, is in the millions of BTC.

## The timeline is closer than most people think

In March 2026, a paper from Google Quantum AI ([arXiv:2603.28846](https://arxiv.org/abs/2603.28846)) showed that breaking 256-bit elliptic-curve cryptography requires fewer than 500,000 superconducting qubits, with a runtime measured in **minutes**. The earlier estimate was 7 million qubits. The resource curve has bent sharply.

Coverage from the major business press anchored quickly to a 2029 timeline:

* [Bloomberg, Mar 31 2026](https://www.bloomberg.com/news/articles/2026-03-31/google-paper-warns-crypto-on-quantum-risk-ahead-of-2029-timeline) — "Google Paper Warns Crypto on Quantum Risk Ahead of 2029 Timeline."
* [CoinDesk, Mar 31 2026](https://www.coindesk.com/tech/2026/03/31/bitcoin-bulls-scramble-for-post-quantum-protection-as-google-drops-bombshell-paper) — "Bitcoin cracked in 9 minutes."
* [The Block, Mar 31 2026](https://www.theblock.co/post/395814/google-quantum-computing-earlier) — "Google warns quantum computing may break bitcoin earlier than thought."

Google itself, per the same paper, treats **2029** as the internal target for being post-quantum-ready across its own infrastructure. Google Cloud has shipped ML-DSA-65 in [Cloud KMS](https://cloud.google.com/blog/products/identity-security/announcing-quantum-safe-digital-signatures-in-cloud-kms) already. The US federal government has a [2035 transition target](https://bidenwhitehouse.archives.gov/briefing-room/statements-releases/2022/05/04/national-security-memorandum-on-promoting-united-states-leadership-in-quantum-computing-while-mitigating-risks-to-vulnerable-cryptographic-systems/) (NSM-10), with NIST's [IR 8547](https://nvlpubs.nist.gov/nistpubs/ir/2024/NIST.IR.8547.ipd.pdf) anchoring the schedule for federal systems.

Independent expert surveys (the Mosca / Global Risk Institute annual survey, IBM and PsiQuantum public roadmaps) place median estimates in the early-to-mid 2030s, with substantial dispersion. The Google paper has pulled the lower bound forward materially.

NIST has already standardized post-quantum signatures (FIPS 204 / ML-DSA) on the assumption that migration of public infrastructure should be substantially complete well before quantum computers can break elliptic-curve cryptography.

For Bitcoin, the practical implication is straightforward. The migration path needs to exist and be usable *now*, so holders can move on their own timeline rather than after the fact.

## Why "harvest now, decrypt later" doesn't apply to signatures (but a related risk does)

For encryption, "harvest now, decrypt later" means an adversary records ciphertext today and decrypts it once they have a quantum computer. For Bitcoin signatures, the equivalent is subtler but real:

* An adversary doesn't need to "harvest" anything. Every exposed public key is already public on the Bitcoin chain forever.
* The moment a CRQC exists, every exposed-public-key UTXO becomes spendable simultaneously.
* The first viable quantum attacker can sweep dormant Satoshi-era coins. The owners cannot defend themselves: moving requires broadcasting the public key, which is the very thing that lets the attacker race them.

## Why Bitcoin can't easily upgrade itself

Bitcoin can in principle add post-quantum signatures via a soft fork. This is being explored. But:

* **Post-quantum signatures are large.** ML-DSA-65 signatures are roughly 3.3 KB (3309 bytes per FIPS 204), vs. roughly 70 bytes for ECDSA. Even with aggregation, the load on Bitcoin's block space is significant.
* **Every user must migrate to new addresses.** Old addresses with exposed public keys remain vulnerable forever, including the Satoshi-era coins.
* **A subset of the community will push for a hard fork instead.** Soft-fork PQ migration of Bitcoin is contentious. There is real risk of a chain split.
* **The timeline is years.** BIP discussion, consensus, activation, and migration each take years individually. The total likely runs longer than the window before quantum capability arrives.

QBTC fills this gap: a parallel quantum-safe ledger that every BTC holder can migrate to on their own schedule, without waiting for Bitcoin's consensus process to complete.

## Read next

* [Why a Parallel Chain](why-parallel-chain.md), why QBTC chose this design over alternatives.
* [Quantum Resistance (ML-DSA)](../build/quantum-resistance.md), how QBTC's cryptography works.
* [Quantum Risk Assessment](../research/quantum-risk-assessment.md), the detailed expert-panel timeline.
