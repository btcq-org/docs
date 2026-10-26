---
title: "FAQ"
description: "Common questions about QBTC, answered briefly: how to claim, what happens to dormant BTC, how the chain pays validators, and how it differs from a bridge."
---

Common questions, answered briefly. For longer explanations, follow the links.

## The basics

### What is QBTC?

A separate chain that mirrors Bitcoin's UTXO set. Its validators sign with ML-DSA, a NIST post-quantum signature scheme. Holders of P2PKH (`1…`) and P2WPKH (`bc1q…`) outputs can claim QBTC 1:1 with a zero-knowledge proof of control. See [What is QBTC?](/learn/what-is-qbtc).

### Is QBTC a Bitcoin fork?

No. Bitcoin's chain is not touched. QBTC is a separate chain with its own genesis block, its own validator set, its own history. See [Why a Parallel Chain](/learn/why-parallel-chain).

### Is this a bridge?

No. No BTC is locked anywhere. There is no custodian. Your BTC stays on Bitcoin. QBTC is a parallel ledger that already knows your balance.

### Is QBTC a wrapped asset?

No. QBTC is a native token on its own chain.

### Can claiming QBTC cost me any Bitcoin?

No. Nothing about claiming moves, spends, or locks your BTC. Your wallet signs a digest with your Bitcoin key. A proving service turns that signature into a zero-knowledge proof and broadcasts the claim. No Bitcoin transaction is ever sent. Your BTC sits on Bitcoin throughout the process, untouched.

## Custody

### What if my BTC is on an exchange (Coinbase, Binance, Kraken, etc.)?

The exchange controls the private keys, which means the exchange controls the claim. Whether they pass it on to you, sell it, or ignore it is up to them. Historical airdrop precedent is mixed: some exchanges credit users, others do not. Eligibility is live, with no snapshot date: whoever controls an eligible unspent output at the time of the claim can claim it. If you want to claim yourself, you must control the keys when you claim.

### What if my BTC is on a hardware wallet (Ledger, Trezor)?

You control your keys, so you control your claim. Claiming needs a wallet that supports QBTC claims. Check with your wallet provider for support.

### What if my BTC is in a paper wallet or seed phrase I have stored offline?

You control your keys. If you can access the private key and the output is a supported type (P2PKH or P2WPKH), you can claim.

### What if my BTC is in an ETF or other wrapped product (IBIT, GBTC, etc.)?

ETF and similar wrapped products do not pass through to the underlying holder. The custodian holds the BTC and thus holds the claim. Each issuer decides independently how to handle it.

### What if I lost my BTC private key?

If you can't sign a proof of ownership, you can't claim. This is the same security model as Bitcoin itself: keys equal ownership.

## Claims

### Do I need to do anything now?

No. Most holders can claim whenever they want, or never. The exception is **dormant exposed-key BTC**: outputs that have not moved for more than 17 years and whose public keys are already on chain (mostly Satoshi-era P2PK outputs). QBTC governance votes can reclaim those. The cutoff is a Bitcoin block height written into each proposal. If your BTC is not in that category, your claim is not affected by waiting.

### How do I claim?

You use a wallet that supports QBTC claims. The wallet signs a digest with your Bitcoin key and sends the signature to a proving service. The service builds the zero-knowledge proof and broadcasts the claim. The self-claim supports P2PKH and P2WPKH outputs today. A new output needs 144 Bitcoin confirmations (about one day) before it can claim. See [For BTC Holders](/learn/for-btc-holders).

### What if I've already moved my BTC?

The QBTC chain continuously mirrors Bitcoin's UTXO set, not a frozen snapshot. Whoever currently controls a BTC UTXO controls the corresponding QBTC claim. If you sent your BTC to a new address (your own or someone else's), the new address holds the new claim. The mirror tracks live state, so moves on Bitcoin propagate to QBTC. A claimed coin stays claimed after it moves.

### Can I claim multiple addresses at once?

Yes. A single transaction can claim up to 50 UTXOs from the same Bitcoin address. For different addresses, you submit one transaction per address (each requires its own ZK proof).

### Does claiming reveal my Bitcoin public key?

Not on chain. The proof keeps your public key and signature out of the transaction. Only the hash of the address and the destination QBTC address go on chain. The proving service receives your signed digest to build the proof.

### Will QBTC be tradeable at launch?

No exchange lists QBTC today. Exchange listings depend on third parties.

## Quantum threat

### How real is the quantum threat?

Real enough that the institutions with the most to lose are already moving.

NIST standardized post-quantum signatures (FIPS 204 / ML-DSA) and is migrating federal infrastructure. Google shipped ML-DSA-65 in [Cloud KMS](https://cloud.google.com/blog/products/identity-security/announcing-quantum-safe-digital-signatures-in-cloud-kms). The US government set a [2035 transition target](https://bidenwhitehouse.archives.gov/briefing-room/statements-releases/2022/05/04/national-security-memorandum-on-promoting-united-states-leadership-in-quantum-computing-while-mitigating-risks-to-vulnerable-cryptographic-systems/) (NSM-10).

Then in March 2026, a [Google Quantum AI paper](https://arxiv.org/abs/2603.28846) cut the qubit count needed to break Bitcoin's curve from ~7 million to under 500 thousand, with runtime in minutes. Google's own internal target for post-quantum readiness is **2029**, [reported by Bloomberg](https://www.bloomberg.com/news/articles/2026-03-31/google-paper-warns-crypto-on-quantum-risk-ahead-of-2029-timeline) and [CoinDesk](https://www.coindesk.com/tech/2026/03/31/bitcoin-bulls-scramble-for-post-quantum-protection-as-google-drops-bombshell-paper).

See [The Quantum Threat to Bitcoin](/learn/quantum-threat) for the full picture.

### Why can't Bitcoin just upgrade itself?

It can in principle, via a soft fork. But: (1) post-quantum signatures are much larger than ECDSA, (2) every user has to migrate to new addresses, (3) dormant Satoshi-era P2PK coins cannot be defended this way, (4) timelines are years and may not arrive in time. See [Why a Parallel Chain](/learn/why-parallel-chain).

### Will QBTC become redundant if Bitcoin ships a post-quantum upgrade?

No. QBTC and a Bitcoin soft fork (such as BIP-360) solve different problems and can coexist indefinitely. The soft fork, if and when Bitcoin Core ships it, gives holders a new post-quantum output type they can voluntarily migrate to. QBTC is a separate chain with post-quantum signatures at consensus, a zero-knowledge claim that keeps your public key off chain, and a governance mechanism for the dormant-coin problem that no soft fork can address (the holders aren't there to migrate). The two paths can coexist: claim QBTC at mainnet, hold BTC on Bitcoin, and migrate through a soft fork later. Both options stay open.

### What about a Bitcoin hard fork?

Bitcoin's social consensus does not accept hard forks that change rules affecting existing holders' coins. A hard fork to re-allocate dormant Satoshi-era UTXOs would be the most contentious change in Bitcoin's history. QBTC performs the equivalent migration on a separate chain so Bitcoin's consensus is never touched.

## Tokenomics

### What's the total supply?

21 million QBTC, matching Bitcoin's cap. Fixed for all time. No inflation.

### Is there a team allocation?

No sale, no premine, no investor allocation, no vesting. The entire **claimable** supply belongs to existing Bitcoin holders (1:1 with BTC). Each governance reclaim of dormant exposed-key BTC splits 90 / 5 / 5: 90% to the Reserve, 5% to a development fund and 5% to a marketing fund. The two funds are the only project share. One mint at genesis: 50 QBTC for the first validator. In exchange, the block-9 Bitcoin coinbase output (50 BTC) cannot be claimed, so the cap stays the same. See [Fair Launch Principles](/learn/fair-launch) for the full disclosure.

### Where do validator rewards come from?

From the **Reserve Module**, a module account on the chain. The Reserve starts empty and is funded only when governance passes proposals to reclaim dormant exposed-key Bitcoin outputs (not moved for more than 17 years, public key visible on chain). Each successful proposal sends 90% of the reclaimed value to the Reserve. Each block, a fraction of the Reserve's balance is released to validators via standard Cosmos `x/distribution`. See [Tokenomics](/research/tokenomics).

### Was there an ICO?

No. No public sale, no presale, no investor rounds. There is no way to buy QBTC from the project at any price.

## Technical

### What's QBTC built on?

The Cosmos SDK, with consensus on a forked CometBFT that uses ML-DSA-44 (Dilithium / FIPS 204) signatures instead of Ed25519.

### Does QBTC use ECDSA anywhere?

Yes, at the account level. Validators sign consensus messages with ML-DSA. Accounts accept ML-DSA, secp256k1, ed25519 and multisig keys. Post-quantum protection applies only to accounts that use ML-DSA keys. The claim also checks a Bitcoin ECDSA signature inside the zero-knowledge proof.

### Where can I read the code?

[github.com/btcq-org](https://github.com/btcq-org).

### Where can I look up QBTC transactions, blocks, and balances?

The QBTC block explorer is at [explorer.qbtc.net](https://explorer.qbtc.net). For aggregate stats on Bitcoin's quantum-vulnerable UTXO surface (per-script-type breakdowns of P2PK, reused P2PKH/P2WPKH, etc.) see the risk indexer at [indexer.qbtc.net](https://indexer.qbtc.net).

### Is there a security review?

A pre-launch security review is in progress. Mainnet follows after it closes.

## Status

### Is QBTC live?

A test network has run since March 2026. It is public and may be reset. Mainnet is not live yet. See [Roadmap](/learn/roadmap).

### When does mainnet ship?

**Planned for Q4 2026.** Mainnet is a fresh genesis. It follows after the pre-launch security review closes. Follow [@qbtc_net on X](https://x.com/qbtc_net) or join the [Discord](https://discord.gg/anMfAjtCPZ).

### What's actually in the code today vs. just specified?

See the [Roadmap](/learn/roadmap) status table. Short version: the post-quantum consensus, the ZK claim verifier, the Bitcoin block ingestion, the user claim mechanism, the Reserve Module, and Cosmos `x/gov` are all in code and run on the test network.
