# For BTC Holders

{% hint style="success" %}
**1 BTC held = 1 QBTC claimable.** No signup. No time limit. No fees to the project.
{% endhint %}

{% hint style="info" %}
**Pre-mainnet, targeting Q3 2026.** The claim flow described here goes live when QBTC mainnet ships. You do not need to take any action right now. Your BTC is yours. Your QBTC claim will be waiting.
{% endhint %}

## The short version

If you hold Bitcoin, you have a claim on an equal amount of QBTC. When mainnet launches, you can convert your claim into spendable QBTC by submitting a zero-knowledge proof of ownership of your Bitcoin address. The proof never reveals your public key, so the migration is itself quantum-safe.

Holders can claim immediately at mainnet, wait years, or never claim. The only exception: **dormant exposed-key BTC** (UTXOs older than 17 years whose public keys are visible on-chain, overwhelmingly Satoshi-era P2PK outputs and ancient reused addresses) is subject to reclamation by on-chain governance. If your BTC is not in those categories, your claim is not affected.

**Claiming QBTC cannot cost you any Bitcoin.** Nothing about the process moves, spends, or locks your BTC. The ZK proof is generated locally from your Bitcoin private key and never sends a Bitcoin transaction.

## What you need to know

* **You own the claim if you own the BTC.** The claim is computed from the Bitcoin UTXO set, not from a registration or signup. Whoever controls the private key for a Bitcoin address controls the corresponding QBTC claim.
* **You will use a quantum-safe wallet.** An established multi-chain, self-custody wallet partner is implementing native post-quantum signing (ML-DSA) and QBTC claim-proof generation, with rollout planned at mainnet. The partner will be named ahead of launch. Claiming will be a normal in-wallet action.
* **The proof runs on the wallet side.** No Bitcoin transaction is sent. No public key is broadcast. Independent operators also run hosted "proof service" endpoints that wallets can use to offload computation if the device is constrained.
* **The proof keeps your BTC public key hidden.** It reveals only the hash of the address being claimed and the destination QBTC address. The BTC public key, private key, and signature are all hidden cryptographic inputs.
* **You can batch claims.** A single transaction can claim up to 50 UTXOs from the same Bitcoin address.

## Where do I hold my BTC?

The right action depends on how you currently custody your Bitcoin.

### On a self-custody wallet (Ledger, Trezor, Sparrow, Electrum, etc.)

You control your private keys. You will be able to claim directly using a QBTC-compatible wallet once mainnet ships. No action required now.

### On a hardware wallet

Same as above. You hold the keys. Wallet partners will publish hardware-wallet integration paths before mainnet.

### On a paper wallet or seed phrase you can still access

Same. You hold the keys. As long as you can access the private key when mainnet ships, you can claim.

### On an exchange (Coinbase, Binance, Kraken, etc.)

**The exchange controls the keys, which means the exchange controls the claim.** Whether they pass it on to you, sell it, or ignore it is up to them. This has been the pattern with prior airdrops: some exchanges credit users, others do not.

If you want certainty about your claim, the cleanest path is to **withdraw to self-custody** before mainnet. Standard caveats apply: only do this if you're comfortable managing your own keys.

### In a custodial product (Fidelity Wise Origin, BlackRock IBIT, etc.)

ETF and similar wrapped products do not pass through to the underlying holder. The custodian holds the BTC and thus holds the claim. Each issuer will decide independently whether and how to handle it.

## What you should do now

Nothing is required. If you want to be prepared:

1. **Make sure you control your BTC keys.** If you're on an exchange and want certainty about your claim, consider self-custody.
2. **Follow [@qbtcnet on X](https://x.com/qbtcnet)** for mainnet launch announcements and wallet support news.
3. **Read the [Quantum Threat](quantum-threat.md) page** so you understand why this matters even if you never plan to claim.

## Read next

* [What is QBTC?](what-is-qbtc.md), the full explanation.
* [The Quantum Threat to Bitcoin](quantum-threat.md), why this needs to exist.
* [Roadmap](roadmap.md), what's built and what's coming.
* [FAQ](faq.md), specific questions.
