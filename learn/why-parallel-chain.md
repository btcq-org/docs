# Why a Parallel Chain

Bitcoin faces an inevitable challenge: the arrival of quantum computers capable of breaking its ECDSA signatures. The only paths to survival are a protocol upgrade or a migration. Both are hard. Each existing option fails on at least one critical axis.

## The design space

There are five ways to give Bitcoin holders access to quantum-safe storage:

1. **Soft-fork Bitcoin** to add post-quantum signatures (e.g., a PQ-aware Taproot variant such as BIP-360).
2. **Hard-fork Bitcoin** to require post-quantum signatures for all spends and re-mine dormant exposed-key UTXOs.
3. **Bridge BTC** to a quantum-safe chain via a custodian or multisig.
4. **Wrap BTC** as a token on a quantum-safe smart-contract platform.
5. **Mirror Bitcoin's UTXO set** on a quantum-safe parallel chain, with claims gated by ZK proofs. **(QBTC's choice.)**

## Why not a soft fork

A soft fork is the more likely path for the Bitcoin community, embedding post-quantum verification into Taproot scripts. The approach has severe problems:

* **Every user has to migrate on-chain to new addresses.** Old addresses with exposed public keys (P2PK, reused P2PKH) remain vulnerable forever. There is no mechanism to recover funds from an address whose owner cannot or will not move them.
* **Post-quantum signatures are large.** ML-DSA-65 signatures are about 3.3 KB versus 70 bytes for ECDSA, generating problematic scaling issues for Bitcoin's block space. Even with aggregation, the bandwidth and storage cost is significant.
* **Activation takes years.** BIP discussion, soft-fork signaling, miner activation, and user migration each compound. Realistic timelines run 5 to 10 years.
* **Entire categories of at-risk UTXOs would remain vulnerable.** Satoshi-era P2PK balances, roughly 1 million BTC that has never moved, cannot defend themselves under any soft-fork scheme. They are still spendable by whoever runs Shor's algorithm first.
* **Consensus fractures.** A subset of the community would inevitably push for a hard fork anyway, creating a messy and uncertain transition.

A soft fork buys safety for active users *eventually*, does nothing for the largest pool of at-risk coins, and may not arrive in time.

## Why not a hard fork

A Bitcoin hard fork that requires post-quantum signatures for all future spends, and re-mines dormant exposed UTXOs into safe addresses, would technically solve the problem.

It will not happen on Bitcoin Legacy. The social consensus does not accept hard forks that change the rules in ways that affect existing holders' coins, even to protect them. Every prior attempt has failed or split off. A hard fork that re-allocates dormant Satoshi-era UTXOs would be the most contentious change in Bitcoin's history.

QBTC performs the hard-fork-equivalent migration **on a separate chain**, so Bitcoin's consensus is never touched. Holders who want quantum safety opt in. Holders who don't, don't.

## Why not a bridge

A bridge moves BTC into a quantum-safe chain by locking it under a custodian or multisig. This has been done many times (wBTC, sBTC, tBTC, and others).

Bridges fail for several reasons:

* **They reintroduce custodial risk, and the custody itself is quantum-vulnerable.** The thing protecting your BTC is now a multisig signed with ECDSA keys. Quantum capability that breaks Bitcoin breaks the bridge custodians' keys at the same moment.
* **They require an action from the holder.** Every BTC holder would have to actively bridge, paying fees and trusting the operator. Inactive holders, the largest category of at-risk coins, remain exposed.
* **They are not universal.** Bridges typically support a subset of address types and require interactive participation. They cannot protect dormant P2PK outputs whose owners are unreachable.

## Why not a wrapped asset

Wrapping BTC as a token on another chain (Ethereum, a Cosmos chain, etc.) inherits all the problems of bridges. It adds another: the wrapped token's security depends on the host chain's security model, which may itself be quantum-vulnerable. Not a serious candidate.

## What QBTC does instead: mirror, then claim

QBTC executes the **Hard Fork now**, before quantum computers reach scale, on a separate ledger. From day one, QBTC uses ML-DSA signatures at the consensus layer. Every Bitcoin UTXO has a 1:1 entitlement in QBTC's mirror, claimable by zero-knowledge proof.

* The mirror tracks Bitcoin's UTXO set continuously. Every live BTC UTXO has a corresponding QBTC entitlement of equal size.
* The mirror updates with every new Bitcoin block. New UTXOs add new entitlements. Spent UTXOs are reconciled. Whoever currently controls a Bitcoin UTXO controls the corresponding QBTC entitlement.
* A holder exercises an entitlement by submitting a **zero-knowledge proof** of ownership, which verifies they control the BTC private key without ever broadcasting the public key.
* Governance, on a roughly two-week voting cadence, reclaims dormant exposed-key BTC UTXOs older than 17 years and redirects the corresponding QBTC into accounts that secure the migration.

This design has properties the alternatives do not:

| Property | Soft fork | Hard fork | Bridge | Wrapped | **QBTC** |
|---|---|---|---|---|---|
| Does not touch Bitcoin | Yes | No | Yes | Yes | **Yes** |
| Allocates to every BTC UTXO | No | Yes | No | No | **Yes** |
| Protects dormant exposed-key coins | No | Maybe | No | No | **Yes (reclaim)** |
| Migration is itself quantum-safe | Partial | Yes | No (ECDSA bridge keys) | No | **Yes (ZK proof)** |
| No custodian, no peg | Yes | Yes | No | No | **Yes** |
| Holder controls timing | Yes | No | Yes | Yes | **Yes** |
| Available before CRQC arrives | No (too slow) | No | Yes | Yes | **Yes** |

## The trade-off

QBTC is a separate ledger with its own validator set, its own block history, its own social contract. A QBTC unit and a BTC unit are not the same asset.

QBTC offers a credible safe harbor: a chain that already knows your balance, that you can move to on your schedule, that does not need Bitcoin to change, and that does not ask you to trust a custodian.

## Read next

* [Architecture](../build/architecture.md)
* [Claim Mechanism](../build/claim-mechanism.md)
* [Fair Launch Principles](fair-launch.md)
