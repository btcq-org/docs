---
description: Quantum-safe Bitcoin. Claimable by every BTC holder, secured against the coming quantum threat.
---

# Welcome to QBTC

QBTC is a quantum-resistant chain that mirrors Bitcoin's UTXO set. Every Bitcoin holder has a 1:1 entitlement of QBTC waiting for them, claimable by proving ownership of their BTC without ever broadcasting their public key.

Bitcoin's signatures will eventually fall to quantum computers. QBTC is the safe harbor: a parallel ledger built on post-quantum cryptography from day one, so holders can move to safety on their own timeline without forking Bitcoin itself.

{% hint style="warning" %}
**Pre-mainnet.** The protocol is in active development. These docs describe the design and what is currently in the code. The [Roadmap](learn/roadmap.md) is honest about what is built and what is still planned.
{% endhint %}

## Choose your path

{% tabs %}
{% tab title="I hold BTC" %}
**Start with [Learn](learn/what-is-qbtc.md).**

Plain-English explanations of what QBTC is, why the quantum threat matters, and what your claim will look like.

[What is QBTC?](learn/what-is-qbtc.md) → [The Quantum Threat](learn/quantum-threat.md) → [For BTC Holders](learn/for-btc-holders.md)
{% endtab %}

{% tab title="I'm a developer" %}
**Start with [Build](build/README.md).**

Architecture, consensus, claim mechanism, APIs, and how to run a node.

[Architecture](build/architecture.md) → [Quantum Resistance](build/quantum-resistance.md) → [Claim Mechanism](build/claim-mechanism.md)
{% endtab %}

{% tab title="I'm a researcher or institution" %}
**Start with [Research](research/README.md).**

The formal protocol specification, the quantum risk assessment, the security model, and the tokenomics.

[Protocol Specification (v1)](research/protocol-spec.md) → [Quantum Risk Assessment](research/quantum-risk-assessment.md) → [Security Model](research/security-model.md)
{% endtab %}
{% endtabs %}

## The core idea, in three sentences

1. Bitcoin's signatures are not quantum-safe. A sufficiently advanced quantum computer can derive the private key from any Bitcoin address whose public key has been revealed on-chain.
2. QBTC is a separate chain that uses post-quantum signatures (ML-DSA / Dilithium) at the consensus layer and mirrors Bitcoin's UTXO set, so every BTC holder has a 1:1 claim of QBTC waiting for them.
3. To claim, you prove control of your BTC address using a zero-knowledge proof that verifies ownership without exposing the public key, so the migration itself is quantum-safe.

No bridge. No peg. No locked BTC. Your bitcoin stays on Bitcoin. QBTC is the safe harbor that exists in parallel.

## What QBTC is not

* **Not a fork of Bitcoin.** Bitcoin's chain is untouched.
* **Not a bridge.** No BTC is custodied or locked anywhere.
* **Not an ICO or pre-sale.** The entire supply is claimable by existing Bitcoin holders. No team premine, no investor allocation.
* **Not a wrapped asset.** QBTC is a native token on its own chain, secured by its own validator set.
