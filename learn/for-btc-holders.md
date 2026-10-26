---
title: "For BTC Holders"
description: "What Bitcoin holders need to know about claiming QBTC: 1:1 for eligible outputs, supported address types, no fees to the project, no signup, and a claim that keeps your Bitcoin public key off chain."
---

<Check>
**1 BTC in an eligible output = 1 QBTC claimable.** Supported today: P2PKH (`1…`) and P2WPKH (`bc1q…`). No signup. No fees to the project.
</Check>

<Info>
**Pre-mainnet.** A test network has run since March 2026 and may be reset. Mainnet is a fresh genesis, planned for Q4 2026. You do not need to take any action right now. Your BTC is yours.
</Info>

## The short version

If you control Bitcoin in an eligible output, you can claim an equal amount of QBTC. You claim with a zero-knowledge proof of control of your Bitcoin address. The claim does not publish your Bitcoin public key on chain.

Eligibility is live, with no snapshot date: whoever controls an eligible unspent output at the time of the claim can claim it. A new output needs 144 Bitcoin confirmations (about one day) before it can claim. Holders can claim at mainnet, wait years, or never claim. The only exception: **dormant exposed-key BTC** (outputs that have not moved for more than 17 years and whose public keys are visible on chain, mostly Satoshi-era P2PK outputs) can be reclaimed by on-chain governance votes. The cutoff is a Bitcoin block height written into each proposal. If your BTC is not in those categories, your claim is not affected.

**Claiming QBTC cannot cost you any Bitcoin.** Nothing about the process moves, spends, or locks your BTC. The claim never sends a Bitcoin transaction.

## What you need to know

* **You own the claim if you own the BTC.** The claim is computed from the Bitcoin UTXO set, not from a registration or signup. Whoever controls the private key for a Bitcoin address controls the corresponding QBTC claim.
* **You claim from a wallet that supports QBTC claims.** The wallet signs a digest with your Bitcoin key and sends the signature to a proving service. The service builds the zero-knowledge proof and broadcasts the claim. No Bitcoin transaction is sent.
* **Your BTC public key does not go on chain.** The claim transaction shows only the hash of the address being claimed and the destination QBTC address.
* **Use an ML-DSA account for post-quantum protection.** QBTC accounts accept ML-DSA, secp256k1, ed25519 and multisig keys. Post-quantum protection applies only to accounts that use ML-DSA keys.
* **You can batch claims.** A single transaction can claim up to 50 UTXOs from the same Bitcoin address.

## Where do I hold my BTC?

The right action depends on how you currently custody your Bitcoin.

### On a software self-custody wallet

You control your private keys. You can claim with a wallet that supports QBTC claims, if your output is P2PKH or P2WPKH. No action required now.

### On a hardware wallet (Ledger, Trezor, etc.)

You control your keys, so you control your claim. Claiming needs a wallet that supports QBTC claims. Check with your wallet provider for support.

### On a paper wallet or seed phrase you can still access

You hold the keys. If you can access the private key and the output is a supported type, you can claim.

### On an exchange (Coinbase, Binance, Kraken, etc.)

**The exchange controls the keys, which means the exchange controls the claim.** Whether they pass it on to you, sell it, or ignore it is up to them. This has been the pattern with prior airdrops: some exchanges credit users, others do not.

Eligibility is live: whoever controls the output at the time of the claim can claim it. To claim yourself, you must control the keys when you claim. Standard caveats apply: only self-custody if you're comfortable managing your own keys.

### In a custodial product (Fidelity Wise Origin, BlackRock IBIT, etc.)

ETF and similar wrapped products do not pass through to the underlying holder. The custodian holds the BTC and thus holds the claim. Each issuer will decide independently whether and how to handle it.

## What you should do now

Nothing is required. If you want to be prepared:

1. **Make sure you control your BTC keys.** To claim yourself, you must control the keys when you claim.
2. **Follow [@qbtc_net on X](https://x.com/qbtc_net)** for mainnet launch announcements and wallet support news, or join the [Discord](https://discord.gg/anMfAjtCPZ).
3. **Read the [Quantum Threat](/learn/quantum-threat) page** so you understand why this matters even if you never plan to claim.

## Read next

* [What is QBTC?](/learn/what-is-qbtc), the full explanation.
* [The Quantum Threat to Bitcoin](/learn/quantum-threat), why this needs to exist.
* [Roadmap](/learn/roadmap), what's built and what's coming.
* [FAQ](/learn/faq), specific questions.
