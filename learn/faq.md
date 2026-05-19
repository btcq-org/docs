# FAQ

Common questions, answered briefly. For longer explanations, follow the links.

## The basics

### What is QBTC?

A quantum-resistant blockchain that mirrors Bitcoin's UTXO set. Every Bitcoin holder has a 1:1 claim of QBTC, exercisable by proving ownership of their Bitcoin address using a zero-knowledge proof. See [What is QBTC?](what-is-qbtc.md).

### Is QBTC a Bitcoin fork?

No. Bitcoin's chain is not touched. QBTC is a separate chain with its own genesis block, its own validator set, its own history. See [Why a Parallel Chain](why-parallel-chain.md).

### Is this a bridge?

No. No BTC is locked anywhere. There is no custodian. Your BTC stays on Bitcoin. QBTC is a parallel ledger that already knows your balance.

### Is QBTC a wrapped asset?

No. QBTC is a native token on its own chain.

## Claims

### Do I need to do anything now?

No. Claims do not expire. You can wait as long as you want, or never claim at all. Your BTC remains yours.

### How do I claim?

When mainnet is live, you'll use a quantum-safe wallet to generate a zero-knowledge proof of ownership of your Bitcoin address, then submit it to QBTC. See [For BTC Holders](for-btc-holders.md).

### What if I've already moved my BTC?

The QBTC chain continuously mirrors Bitcoin's UTXO set, not a frozen snapshot. Whoever currently controls a BTC UTXO controls the corresponding QBTC claim. If you sent your BTC to a new address (your own or someone else's), the new address holds the new claim. The mirror tracks live state, so moves on Bitcoin propagate to QBTC.

### What if I lose my BTC private key?

If you can't sign a proof of ownership, you can't claim. This is the same security model as Bitcoin itself: keys equal ownership.

### Can I claim multiple addresses at once?

Yes. A single transaction can claim up to 50 UTXOs from the same Bitcoin address. For different addresses, you submit one transaction per address (each requires its own ZK proof).

### Does claiming reveal my Bitcoin public key?

No. The ZK proof keeps your public key (and private key, and signature) entirely hidden. Only the Hash160 of the address and the destination QBTC address are revealed on-chain. The migration itself stays quantum-safe.

## Quantum threat

### How real is the quantum threat?

Real enough that NIST has standardized post-quantum signatures (FIPS 204 / ML-DSA) and is migrating federal infrastructure. Expert consensus places cryptographically-relevant quantum computers in the late 2020s to mid-2030s. See [The Quantum Threat to Bitcoin](quantum-threat.md).

### Why can't Bitcoin just upgrade itself?

It can in principle, via a soft fork. But: (1) post-quantum signatures are much larger than ECDSA, (2) every user has to migrate to new addresses, (3) dormant Satoshi-era P2PK coins cannot be defended this way, (4) timelines are years and may not arrive in time. See [Why a Parallel Chain](why-parallel-chain.md).

### What about a Bitcoin hard fork?

Bitcoin's social consensus does not accept hard forks that change rules affecting existing holders' coins. A hard fork to re-allocate dormant Satoshi-era UTXOs would be the most contentious change in Bitcoin's history. QBTC performs the equivalent migration on a separate chain so Bitcoin's consensus is never touched.

## Tokenomics

### What's the total supply?

21 million QBTC, matching Bitcoin's cap. Fixed for all time. No inflation.

### Is there a team allocation?

No. No team premine, no investor allocation, no advisor allocation. The entire claimable supply belongs to existing Bitcoin holders. See [Fair Launch Principles](fair-launch.md).

### Where do validator rewards come from?

From the **Reserve Module**, a module account on the chain. The Reserve is funded only when governance passes proposals to reclaim dormant exposed-key Bitcoin UTXOs (P2PK outputs and reused-address outputs older than 17 years). Each successful proposal mints QBTC into the Reserve equal to the reclaimed BTC value. Each block, a fraction of the Reserve's balance is released to validators via standard Cosmos `x/distribution`. See [Tokenomics](../research/tokenomics.md).

### Was there an ICO?

No. No public sale, no presale, no investor rounds. There is no way to buy QBTC from the project at any price.

## Technical

### What's QBTC built on?

The Cosmos SDK, with consensus on a forked CometBFT that uses ML-DSA (Dilithium / FIPS 204) signatures instead of Ed25519.

### Does QBTC use ECDSA anywhere?

No. ML-DSA throughout the consensus path. ECDSA is only the *thing being claimed against* (because Bitcoin uses it), and the ZK proof verifies ECDSA ownership without exposing the public key.

### Where can I read the code?

[github.com/btcq-org](https://github.com/btcq-org).

### Are there audits?

The most security-critical components (the ML-DSA integration, the PLONK verifier, the chain code) will receive multiple independent audits before mainnet. Reports will be published on the [Audits](../resources/glossary.md) page when they complete.

## Status

### Is QBTC live?

No. QBTC is pre-mainnet. The protocol is in active development. See [Roadmap](roadmap.md).

### When does mainnet ship?

A specific date will be announced when one is reliable. Follow [@qbtcnet on X](https://x.com/qbtcnet).

### What's actually in the code today vs. just specified?

See the [Roadmap](roadmap.md) page. Short version: the post-quantum consensus, the ZK claim verifier, the Bitcoin block ingestion, and the reserve-funded emission are all in code. The native liquidity pool, liquid staking, and the 17-year dormant-UTXO re-mining mechanism are part of the design vision but not in v1.
