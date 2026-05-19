# Quantum Resistance (ML-DSA)

QBTC achieves quantum resistance through two independent mechanisms operating on different layers of the chain.

## At the consensus layer: ML-DSA

The chain's consensus signing path uses **ML-DSA** (Module-Lattice-Based Digital Signature Algorithm), formerly known as CRYSTALS-Dilithium, standardized by NIST as **FIPS 204**.

Every validator's consensus key is an ML-DSA key. Every consensus vote, every block-commit signature, every gossip message is signed with ML-DSA. There is no ECDSA or Ed25519 dependency anywhere in the consensus path.

Implemented via a fork of CometBFT at `github.com/btcq-org/cometbft`, which adds a `crypto/mldsa` package and routes signing through it.

### Why it matters

A chain that exists to be quantum-safe cannot have any quantum-vulnerable cryptography in its consensus layer. If validators signed with Ed25519, a quantum-capable adversary could forge a validator signature and rewrite chain history. ML-DSA is lattice-based and is believed secure against both classical and quantum attacks at NIST security level 3 (ML-DSA-65).

### Trade-offs

ML-DSA signatures are larger than Ed25519:

* ML-DSA-65 signature: ~3.3 KB.
* ML-DSA-65 public key: ~2.0 KB.
* Ed25519 signature: 64 bytes.
* Ed25519 public key: 32 bytes.

Block size and bandwidth costs are higher accordingly. The chain absorbs the cost as part of the design.

## At the claim layer: ZK proofs

A user claiming QBTC submits a zero-knowledge proof that they control the private key for a Bitcoin address, **without** broadcasting the public key. Once a Bitcoin public key is broadcast (during a normal spend, for example), it becomes a target for Shor's algorithm.

The proof system is **PLONK**, a SNARK-style construction. The circuit verifies:

* Knowledge of a Bitcoin private key.
* That the corresponding public key hashes (via Hash160) to a specific Bitcoin address.
* Binding to a specific destination QBTC address (so a proof can't be replayed against a different destination).

Public inputs (revealed on-chain):

* Hash160 of the Bitcoin address.
* Destination QBTC address.

Hidden inputs (kept secret):

* Bitcoin public key.
* Bitcoin private key.
* ECDSA signature.

### Practical implications

The on-chain verifier is fast (~2–5 ms verification per proof, proof size ~1 KB). Verification cost is what matters for chain throughput.

Proof generation happens client-side. Wallets handle it natively. Independent operators also run hosted "proof service" endpoints that wallets can use to offload computation on constrained devices. The local CLI prover (`zkprover`) is available for users who want to generate proofs themselves.

The trusted setup for the PLONK circuit reuses the Hermez/Polygon Powers of Tau 2²¹ ceremony, an existing public ceremony with multiple participants.

## Why both layers

Either alone is insufficient. If only consensus were ML-DSA, the act of broadcasting your BTC public key during a claim would expose it to a quantum attacker who could race you for the BTC on Bitcoin Legacy before your QBTC claim settles. If only claims used ZK, validators could be quantum-attacked and the chain could be rewritten.

Together, the chain is post-quantum end to end.

## References

* NIST FIPS 204: ML-DSA specification.
* `github.com/btcq-org/cometbft`: the forked CometBFT.
* `x/qbtc/zk/`: PLONK circuits and on-chain verifier in the chain code.
* [Protocol Specification §1, §2.3](../research/protocol-spec.md).
