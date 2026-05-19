# Why a Parallel Chain

QBTC is a separate chain that mirrors Bitcoin. It is not a fork, a bridge, a rollup, or a wrapped asset. Each of those alternatives was considered. None of them work for the specific problem QBTC solves. This page explains why.

## The design space

There are roughly five ways to give Bitcoin holders access to quantum-safe storage:

1. **Soft-fork Bitcoin** to add post-quantum signatures (e.g., a PQ-aware Taproot variant).
2. **Hard-fork Bitcoin** to require post-quantum signatures for all spends.
3. **Bridge BTC** to a quantum-safe chain via a custodian or multisig.
4. **Wrap BTC** as a token on a quantum-safe smart-contract platform.
5. **Mirror Bitcoin's UTXO set** on a quantum-safe parallel chain, with claims gated by ZK proofs. **(QBTC's choice.)**

## Why not a soft fork

Adding post-quantum signatures to Bitcoin via soft fork is the most "respectful" option and is actively being discussed in the Bitcoin developer community. It has serious problems:

* **Every user has to migrate to new addresses.** Old addresses with exposed public keys (P2PK, reused P2PKH) remain vulnerable forever. There is no mechanism to recover funds from an address whose owner cannot or will not move them.
* **Post-quantum signatures are large.** Even with aggregation, the bandwidth and storage cost is significant. Block-space economics shift.
* **Activation takes years.** BIP discussion, soft-fork signaling, miner activation, and user migration each compound. Realistic timelines run 5 to 10 years.
* **It does not protect dormant Satoshi-era coins.** Roughly 1 million BTC sits in P2PK outputs that have never moved. Those coins cannot defend themselves. Under any soft-fork scheme, they are still spendable by whoever runs Shor's algorithm first.

A soft fork buys safety for active users *eventually*, but does nothing for the largest pool of at-risk coins, and may not arrive in time.

## Why not a hard fork

A Bitcoin hard fork that requires post-quantum signatures for all future spends, and re-mines dormant exposed UTXOs into safe addresses, would technically solve the problem.

It will not happen. Bitcoin's social consensus does not accept hard forks that change the rules in ways that affect existing holders' coins, even to protect them. Every prior attempt has failed or split off. A hard fork that re-allocates dormant Satoshi-era UTXOs would be the most contentious change in Bitcoin's history.

QBTC accepts this reality. It performs the hard-fork-equivalent migration **on a separate chain**, so Bitcoin's consensus is never touched. Holders who want quantum safety opt in. Holders who don't, don't.

## Why not a bridge

A bridge moves BTC into a quantum-safe chain by locking it under a custodian or multisig. This has been done many times (wBTC, sBTC, tBTC, and others).

Bridges fail QBTC's requirements for several reasons:

* **They reintroduce custodial risk.** The thing protecting your BTC is now a multisig signed with, wait for it, ECDSA keys. The bridge custodians' keys are themselves quantum-vulnerable. Quantum capability that breaks Bitcoin breaks the bridge custodians' keys at the same moment.
* **They require an action from the holder.** Every BTC holder would have to actively bridge, paying fees and trusting the operator. Inactive holders, the largest category of at-risk coins, remain exposed.
* **They are not universal.** Bridges typically support a subset of address types and require interactive participation. They cannot protect dormant P2PK outputs whose owners are unreachable.

## Why not a wrapped asset

Wrapping BTC as a token on another chain (e.g., Ethereum, a Cosmos chain) has all the problems of bridges plus the additional problem that the wrapped token's security depends on the host chain's security model. It is not a serious candidate for a quantum-safety solution.

## What QBTC does instead: mirror, then claim

QBTC takes a different approach: **pre-allocate the claim at genesis, then let the holder exercise it whenever they choose.**

* At launch, QBTC mirrors the entire Bitcoin UTXO set. Every BTC address has a corresponding claim entry in QBTC's state, sized to match its BTC balance.
* The mirror is updated with every new Bitcoin block. New UTXOs become new claims. Spent UTXOs are reconciled. Coinbase outputs add to the claim pool.
* A holder converts their claim to spendable QBTC by submitting a **zero-knowledge proof** of ownership. The proof verifies that they control the BTC private key for a given address, without ever broadcasting the public key.
* Claims do not expire. Holders can wait years, decades, or forever.

This design has properties the alternatives don't:

| Property | Soft fork | Hard fork | Bridge | Wrapped | **QBTC** |
|---|---|---|---|---|---|
| Doesn't touch Bitcoin | Yes | No | Yes | Yes | **Yes** |
| Pre-allocates to every holder | No | Yes | No | No | **Yes** |
| Protects dormant coins automatically | No | Maybe | No | No | **Yes (claim waits)** |
| Migration is itself quantum-safe | Partial | Yes | No (ECDSA bridge keys) | No | **Yes (ZK proof)** |
| No custodian, no peg | Yes | Yes | No | No | **Yes** |
| Holder controls timing | Yes | No | Yes | Yes | **Yes** |
| Available before CRQC arrives | No (too slow) | No | Yes | Yes | **Yes** |

## The trade-off

QBTC is not Bitcoin. It is a separate ledger with its own validator set, its own block history, its own social contract. A QBTC unit and a BTC unit are not the same asset.

QBTC offers a credible safe harbor: a chain that already knows your balance, that you can move to on your schedule, that does not need Bitcoin to change, and that does not ask you to trust a custodian.

## Read next

* [Architecture](../build/architecture.md)
* [Claim Mechanism](../build/claim-mechanism.md)
* [Fair Launch Principles](fair-launch.md)
