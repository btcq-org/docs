# Security Model

QBTC's security rests on three independent foundations. A compromise in any one of them does not automatically compromise the others.

## 1. Post-quantum consensus

Every validator vote, every block-commit signature, every consensus message is signed with ML-DSA (FIPS 204). A quantum-capable adversary cannot forge validator signatures or rewrite chain history. See [Quantum Resistance (ML-DSA)](../build/quantum-resistance.md).

**Trust assumption:** ML-DSA is secure against both classical and quantum adversaries at NIST security level 3. This rests on the hardness of lattice problems, which has been the standard post-quantum assumption for over a decade and survived NIST's multi-year PQC standardization process.

## 2. ZK-gated claims

A claim is only accepted if the submitted PLONK proof verifies. The proof attests that the claimant controls a Bitcoin private key whose public-key Hash160 matches the claimed UTXO, without revealing the public key.

**Trust assumption:** PLONK's soundness rests on the discrete log assumption over a pairing-friendly elliptic curve, a pre-quantum assumption. For the lifetime of the migration window, a quantum attacker who can break the ZK proof can also derive the Bitcoin private key directly, so ZK soundness is not the bottleneck. Migration to a fully post-quantum SNARK is on the long-term research agenda.

## 3. Bitcoin attestation by 2/3+ of validators

Bitcoin blocks are not trusted from a single oracle. Each validator's `bifrost` independently watches Bitcoin, signs the block it sees with its ML-DSA consensus key, and gossips. The `ebifrost` module accepts a block only after more than 2/3 of bonded validator power has attested.

**Trust assumption:** At any given time, more than 1/3 of bonded validator power is honest. Standard Byzantine fault tolerance.

## Threat model

| Threat | Defense |
|---|---|
| Validator double-spends | `x/slashing` for double-signing. Standard Cosmos. |
| Validator collusion (>1/3) | Acceptable byzantine fraction is bounded by stake distribution. Slashing makes collusion economically expensive. |
| Quantum forgery of validator signatures | ML-DSA. |
| Quantum forgery of Bitcoin signatures during a claim | The ZK proof never broadcasts the BTC public key. Public key remains hidden inputs. |
| Double-claim of the same UTXO | `EntitledAmount` set to 0 after claim. Subsequent attempts fail. |
| Replay of a valid proof against a different destination | Destination address is a public input bound into the proof. A different destination produces a different proof. |
| Malicious proof-service operator | The proof service does not have power to forge claims (proof inputs are user-constructed). Multiple independent operators run proof services; users select from a decentralized provider set, plus local proving is always available. |
| Stolen or compromised user wallet | Same as Bitcoin: control of the BTC private key equals control of the claim. |
| Front-running of a claim transaction | Standard Cosmos mempool. Claims are not high-MEV (the same UTXO can only be claimed by the holder of the matching key). |

## Known weaknesses

* **PLONK is not post-quantum.** Bounded by Bitcoin's own pre-quantum nature. Migration to a fully post-quantum SNARK is a research direction.
* **The bifrost design assumes honest majority for Bitcoin block ingestion.** A coordinated attack by more than 1/3 of bonded validator power could feed a false Bitcoin block. Slashing applies, but only after detection.

## Audits

Audit reports will be linked here as they complete. The most security-critical components (the ML-DSA integration, the PLONK verifier, the `x/qbtc` module, and the ZK circuit) will receive multiple independent audits before mainnet.

## See also

* [Quantum Risk Assessment](quantum-risk-assessment.md)
* [Protocol Specification](protocol-spec.md)
