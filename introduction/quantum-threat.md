# The Quantum Threat to Bitcoin

Bitcoin's security depends on ECDSA signatures over the secp256k1 elliptic curve. A sufficiently large quantum computer running **Shor's algorithm** can derive a private key from a public key on this curve in polynomial time. When that becomes practical, every Bitcoin address whose public key has ever been exposed becomes spendable by whoever runs the algorithm first.

This is not a hypothetical "post-2100" concern. It is the consensus view of cryptographers and quantum researchers that this capability will arrive within the next decade or so. Bitcoin must migrate before then.

## Which Bitcoin is exposed, and when

There are two distinct categories of risk, and they materialize on different timelines.

### Category 1: Addresses with exposed public keys (immediate risk on Q-day)

The Bitcoin public key for an address becomes visible on-chain in two situations:

1. **P2PK outputs** (pay-to-public-key) — the public key is literally the output. Most of these are Satoshi-era coinbase outputs that have never moved. Estimated to hold over 1 million BTC.
2. **Reused addresses** — any time a Bitcoin address spends from itself, its public key is published as part of the transaction's input script. Once an address has spent even once, its public key is permanent and public.

For both categories, the moment a quantum computer can run Shor's algorithm at the required scale, the funds can be stolen by deriving the private key from the exposed public key.

### Category 2: Addresses with hashed public keys (mempool risk)

Modern Bitcoin addresses (P2PKH, P2WPKH) store only the **hash** of the public key on-chain. The hash is quantum-resistant — Grover's algorithm only provides a quadratic speedup, leaving these addresses effectively safe.

But the moment such an address spends, the public key is broadcast in the transaction. While the transaction sits in the mempool waiting to be mined, a quantum-capable adversary could:

1. Read the public key from the broadcast transaction.
2. Derive the private key.
3. Construct a competing transaction sending the entire balance to the attacker, with a higher fee.
4. Have miners include the attacker's transaction in the next block instead.

This is the "**short-range attack**" or "**live key attack**." It threatens every modern Bitcoin user the moment they try to spend.

## How much Bitcoin is at risk

Published estimates of quantum-vulnerable Bitcoin vary by methodology, but consistently land in the same range:

- **Roughly 1 million+ BTC** sits in P2PK and reused-address outputs whose public keys are permanently exposed. This includes most of the dormant Satoshi-era coins.
- **Effectively all actively-spent BTC** is exposed during the mempool window of each transaction.

The total economically exposed surface, depending on how you count reused addresses and the time horizon, is in the millions of BTC.

## The expert consensus on timing

Public statements from cryptographers, quantum researchers, and standards bodies converge on a window in roughly the late 2020s to mid-2030s for cryptographically-relevant quantum computers (CRQCs) — machines capable of breaking 256-bit elliptic-curve cryptography.

NIST has already standardized post-quantum signatures (FIPS 204 / ML-DSA) on the assumption that migration of public infrastructure should be substantially complete well before that window.

For Bitcoin, the practical implication is straightforward: the migration path needs to exist and be usable *now*, so that holders can move on their own timeline rather than during a crisis.

## Why "harvest now, decrypt later" doesn't apply to signatures (but a related risk does)

For encryption, the "harvest now, decrypt later" attack means an adversary records ciphertext today and decrypts it once they have a quantum computer. For Bitcoin's signatures, the equivalent is subtler but real:

- An adversary doesn't need to "harvest" anything — every exposed public key is already public on the Bitcoin chain forever.
- The moment a CRQC exists, every exposed-public-key UTXO becomes spendable simultaneously.
- The first viable quantum attacker can sweep dormant Satoshi-era coins, and there is no defense for those addresses — their owners (if any are still around) cannot move the coins faster than the attacker, because moving requires broadcasting the public key, which is the very thing that lets the attacker race them.

## Why Bitcoin can't easily upgrade itself

Bitcoin can in principle add post-quantum signatures via a soft fork. This is being explored. But:

- **Post-quantum signatures are large.** ML-DSA signatures are ~2.5 KB, vs. ~70 bytes for ECDSA. Even with aggregation, this is a significant load on Bitcoin's block space.
- **Every user must migrate to new addresses.** Old addresses with exposed public keys remain vulnerable forever, including the Satoshi-era coins.
- **A subset of the community will push for a hard fork instead.** Soft-fork PQ migration of Bitcoin is contentious. There is real risk of a chain split.
- **The timeline is years.** BIP discussion, consensus, activation, and migration would each take years individually. The total likely runs longer than the window before quantum capability arrives.

This is the gap QBTC exists to fill: a parallel, quantum-safe ledger that every BTC holder can migrate to on their own schedule, without waiting for Bitcoin's consensus process to complete.

## Read next

- [Why a Parallel Chain](why-parallel-chain.md) — Why QBTC chose this design over alternatives.
- [Quantum Resistance (ML-DSA)](../protocol/quantum-resistance.md) — How QBTC's cryptography works.
- [Quantum Risk Assessment](../security/quantum-risk-assessment.md) — Detailed expert-panel timeline.
