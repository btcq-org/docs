# For BTC Holders

{% hint style="info" %}
**Pre-mainnet.** The claim flow described here goes live when QBTC mainnet ships. You do not need to take any action right now. Your BTC is yours. Your QBTC claim will be waiting.
{% endhint %}

## The short version

If you hold Bitcoin, you already have a claim on an equal amount of QBTC. Once mainnet is live, you can convert your claim into spendable QBTC by submitting a zero-knowledge proof of ownership of your Bitcoin address. The proof never reveals your public key, so the migration is itself quantum-safe.

You do not have to act now. Claims do not expire. You can wait years, or never claim at all. Your BTC stays on Bitcoin either way.

## What you need to know

* **You own the claim if you own the BTC.** The claim is computed from the Bitcoin UTXO set, not from a registration or signup. Whoever controls the private key for a Bitcoin address controls the corresponding QBTC claim.
* **You'll need a quantum-safe wallet.** A wallet that supports the QBTC chain (with ML-DSA signatures) and that can construct a ZK proof of BTC ownership for the claim. Wallet partners will be announced before mainnet.
* **Generating the proof is computationally expensive.** Roughly 60 seconds and 8 GB of RAM. You can either run a local prover or use a hosted "proof service." Multiple operators will host proof services.
* **The proof keeps your BTC public key hidden.** It reveals only the Hash160 of the address being claimed and the destination QBTC address. The BTC public key, private key, and signature are all hidden cryptographic inputs.
* **You can batch claims.** A single transaction can claim up to 50 UTXOs from the same Bitcoin address.

## What you should do now

Nothing required. If you want to be prepared:

1. **Make sure you control your BTC keys.** If your BTC is on an exchange, the exchange controls the claim. Whether they pass it on to you depends on the exchange. Self-custodial wallets are the cleanest path.
2. **Follow [@qbtcnet on X](https://x.com/qbtcnet)** for mainnet launch announcements and wallet support news.
3. **Read the [Quantum Threat](quantum-threat.md) page** so you understand why this matters even if you never plan to claim.

## Read next

* [What is QBTC?](what-is-qbtc.md), the full explanation.
* [The Quantum Threat to Bitcoin](quantum-threat.md), why this needs to exist.
* [Roadmap](roadmap.md), what's built and what's coming.
