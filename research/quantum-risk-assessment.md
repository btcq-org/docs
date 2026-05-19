# Quantum Risk Assessment

{% hint style="info" %}
**Coming soon.** A published expert-panel assessment will be hosted here.
{% endhint %}

## Summary of published findings

Current published assessments converge on a window of roughly **2029 to 2035** for the arrival of cryptographically-relevant quantum computers (CRQCs), defined as quantum computers capable of breaking 256-bit elliptic-curve cryptography in practical time. This is the cryptography behind Bitcoin's ECDSA signatures.

Methodologies vary across published assessments:

* Some weight experimental progress on logical-qubit error rates.
* Some weight observed scaling trends in physical-qubit counts.
* Some weight institutional milestones (NIST PQC standardization, federal infrastructure migration mandates).

The convergence across methodologies is the signal.

## Implications

* **Dormant exposed-key UTXOs are at risk first.** Roughly 1 million+ BTC in P2PK outputs and reused-address outputs have publicly visible public keys. These become spendable by whoever runs Shor's algorithm first.
* **Live spending is at risk via the mempool window.** Any Bitcoin spend reveals the public key. A CRQC operator could race the spender to a competing transaction.
* **The migration window is now.** Migrations of large-scale infrastructure take years. NIST has standardized post-quantum signatures (FIPS 204 / ML-DSA) on the assumption that public infrastructure should be substantially migrated well before CRQC arrival.

## See also

* [The Quantum Threat to Bitcoin](../learn/quantum-threat.md), plain-language explainer.
* [Quantum Resistance (ML-DSA)](../build/quantum-resistance.md), QBTC's cryptographic response.
