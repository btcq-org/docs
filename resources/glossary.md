# Glossary

Terms used throughout the QBTC documentation.

* **bifrost** — Per-validator sidecar daemon that watches a Bitcoin full node and gossips signed blocks to peers via LibP2P.
* **Claim** — A QBTC entitlement tied 1:1 to a live Bitcoin UTXO in the chain's claim mirror. Exercisable by the holder of the corresponding BTC private key via a ZK proof.
* **Claim mirror** — The set of all outstanding QBTC entitlements, each tied to a currently-live Bitcoin UTXO. Tracks Bitcoin's UTXO set continuously.
* **CometBFT** — The BFT consensus engine used by Cosmos chains. QBTC uses a [forked CometBFT](https://github.com/btcq-org/cometbft) with ML-DSA signatures.
* **Cosmos SDK** — The framework QBTC is built on. Provides standard modules for staking, governance, IBC, and others.
* **CRQC** — Cryptographically-Relevant Quantum Computer. A quantum computer capable of breaking 256-bit elliptic-curve cryptography in practical time.
* **DKLS24** — A threshold ECDSA signature scheme. Not in QBTC v1; part of the post-MVP cross-chain vault design. See [Vision & Roadmap](../research/vision-and-roadmap.md).
* **ebifrost** — The "enshrined bifrost." The in-chain module that aggregates validator attestations on Bitcoin blocks and ingests them into QBTC state.
* **ECDSA** — Elliptic Curve Digital Signature Algorithm. Bitcoin's signature scheme. Quantum-vulnerable.
* **EmissionCurve** — A constant in `constants/constants.go` controlling how fast the validator reserve is drawn down. Set to 5 in v1.
* **EntitledAmount** — The remaining QBTC claim amount for a given UTXO. Set at ingestion. Decremented to 0 after claim.
* **FIPS 204** — The NIST standard for ML-DSA, published 2024.
* **Hash160** — The 20-byte hash (RIPEMD-160 of SHA-256) of a Bitcoin public key. Encodes a Bitcoin address.
* **ML-DSA** — Module-Lattice-Based Digital Signature Algorithm. NIST-standardized lattice signature scheme. Formerly CRYSTALS-Dilithium. QBTC's consensus signature scheme.
* **P2PK** — Pay-to-Public-Key. An early Bitcoin output format that places the public key directly on-chain. Quantum-vulnerable.
* **P2PKH / P2WPKH** — Pay-to-Public-Key-Hash. Modern Bitcoin output formats that store only the hash of the public key. Quantum-resistant until spent.
* **PLONK** — A zero-knowledge SNARK proof system. QBTC's claim circuit is a PLONK circuit.
* **proof-service** — A standalone HTTP service that generates ZK claim proofs on behalf of users.
* **Q-day** — The day on which a CRQC capable of breaking Bitcoin's ECDSA becomes operational.
* **Quantum-safe wallet** — A wallet that can construct a QBTC claim proof and sign QBTC transactions with ML-DSA keys.
* **Reserve Module** — A module account on the QBTC chain that funds validator emission. Has one inflow (governance reclamation of dormant exposed-key BTC UTXOs mints QBTC into the Reserve) and one outflow (per-block release to validators via `x/distribution`).
* **Shor's algorithm** — A quantum algorithm that solves the discrete logarithm problem efficiently. Breaks Bitcoin's ECDSA signatures (given a CRQC).
* **UTXO** — Unspent Transaction Output. The unit of Bitcoin balance. QBTC mirrors Bitcoin's UTXO set.
* **utxo-indexer** — A CLI tool that crawls a Bitcoin node and produces the genesis UTXO snapshot file.
* **zkprover** — A CLI tool for generating QBTC claim proofs locally.
* **ZK proof** — Zero-knowledge proof. A cryptographic proof that reveals only the validity of a stated claim, not the supporting data.
