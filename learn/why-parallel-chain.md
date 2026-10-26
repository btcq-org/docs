---
title: "Why a Parallel Chain"
description: "Soft fork, hard fork, bridge, wrapped asset, or parallel chain — five paths to post-quantum Bitcoin, and why QBTC takes the parallel-chain route."
---

Bitcoin faces an inevitable challenge: the arrival of quantum computers capable of breaking its ECDSA signatures. The only paths to survival are a protocol upgrade or a migration. Both are hard. Each existing option fails on at least one critical axis.

## The design space

There are five ways to give Bitcoin holders access to post-quantum signatures:

1. **Soft-fork Bitcoin** to add post-quantum signatures (e.g., a PQ-aware Taproot variant such as BIP-360).
2. **Hard-fork Bitcoin** to require post-quantum signatures for all spends and re-mine dormant exposed-key UTXOs.
3. **Bridge BTC** to another chain via a custodian or multisig.
4. **Wrap BTC** as a token on a smart-contract platform with post-quantum signatures.
5. **Mirror Bitcoin's UTXO set** on a parallel chain with post-quantum validator signatures, with claims gated by ZK proofs. **(QBTC's choice.)**

## Why not a soft fork

A soft fork is the more likely path for the Bitcoin community, embedding post-quantum verification into Taproot scripts. The approach has severe problems:

* **Bitcoin's block space was not sized for PQ signatures.** ML-DSA-44 signatures are about 2.4 KB versus about 70 bytes for ECDSA. Adding them to Bitcoin means roughly a 34× expansion of signature data inside a block-space budget that has been politically immovable for a decade. QBTC uses ML-DSA from genesis. Large signatures and blocks still raise network latency requirements for validators.
* **Activation takes years Bitcoin may not have.** BIP discussion, soft-fork signaling, miner activation, and user migration each compound. Realistic timelines run 5 to 10 years, on a clock set by a CRQC arrival window that published assessments place between 2029 and 2035. QBTC ships its post-quantum chain on its own schedule, without needing Bitcoin's social consensus to move first.
* **The largest pool of at-risk BTC is structurally unfixable by soft fork.** Satoshi-era P2PK balances (~1.7M BTC that has never moved) and reused-address coins with on-chain public keys cannot defend themselves under any soft-fork scheme: there is no signer to migrate them. They remain spendable by whoever runs Shor's algorithm first. QBTC's governance reclamation addresses this category on a separate ledger: it sends the matching QBTC to the Reserve and the two funds. It does not protect the coins on Bitcoin, which stay where they are. Per-category breakdown: [indexer.qbtc.net](https://indexer.qbtc.net).
* **Consensus fractures.** A soft fork that quietly leaves dormant coins exposed will not satisfy the holders who want them protected; a soft fork that touches them will not pass. Either outcome fractures Bitcoin's social consensus. QBTC sidesteps the dilemma: Bitcoin's rules are unchanged, and holders who opt in claim on a separate chain.

A soft fork buys safety for active users *eventually*, does nothing for the largest pool of at-risk coins, and may not arrive in time. The fact that an active BTC holder must also take an action to claim QBTC is not a comparable cost: a QBTC claim is opt-in and does not require Bitcoin's protocol to change. A soft fork migration is opt-in only in the trivial sense that you can choose to leave your coins behind on a chain that has become unsafe for them.

## Why not a hard fork

A Bitcoin hard fork that requires post-quantum signatures for all future spends, and re-mines dormant exposed UTXOs into safe addresses, would technically solve the problem.

It will not happen on Bitcoin Legacy. The social consensus does not accept hard forks that change the rules in ways that affect existing holders' coins, even to protect them. Every prior attempt has failed or split off. A hard fork that re-allocates dormant Satoshi-era UTXOs would be the most contentious change in Bitcoin's history, and it would impose that change on every holder, including those who reject the migration.

QBTC performs the hard-fork-equivalent migration **on a separate chain**, so Bitcoin's consensus is never touched and no holder is forced to participate. Holders who want post-quantum signatures opt in. Holders who don't, don't. The reclamation of dormant exposed-key UTXOs happens only in QBTC's mirror; on Bitcoin, those coins remain exactly where they are, governed by exactly the rules they have today.

## Why not a bridge

A bridge moves BTC to another chain by locking it under a custodian or multisig. This has been done many times (wBTC, tBTC, and others).

Bridges fail for several reasons:

* **They reintroduce custodial risk, and the custody itself is quantum-vulnerable.** The thing protecting your BTC is now a multisig signed with ECDSA keys. Quantum capability that breaks Bitcoin breaks the bridge custodians' keys at the same moment. QBTC has no custodian and no peg: your BTC stays on Bitcoin, under your own keys, until you choose to exercise the entitlement with a ZK proof. There is no honeypot to attack.
* **They lock your BTC to use the destination chain.** A bridge requires you to surrender custody of the underlying BTC to mint the wrapped version. With QBTC, you keep your BTC on Bitcoin *and* hold QBTC after claiming. The claim does not move or lock the underlying coin.
* **They are not universal and cannot protect inactive holders.** Bridges typically support a subset of address types and require interactive participation, paying fees and trusting the operator. Dormant exposed-key UTXOs whose owners are unreachable cannot be bridged at all. QBTC's user claim is also opt-in, but the protocol additionally provides a *non-user* path (governance reclamation) for exactly the category of coins no opt-in mechanism can save.

## Why not a wrapped asset

Wrapping BTC as a token on another chain (Ethereum, a Cosmos chain, etc.) inherits all the problems of bridges. It adds another: the wrapped token's security depends on the host chain's security model, which may itself be quantum-vulnerable. QBTC is a sovereign chain with its own ML-DSA-secured validator set, mirroring Bitcoin's UTXO state without depending on any other chain's consensus.

## What QBTC does instead: mirror, then claim

QBTC executes the **Hard Fork now**, on a separate ledger. From genesis, QBTC uses ML-DSA signatures at the consensus layer. Every Bitcoin UTXO has a 1:1 entitlement in QBTC's mirror. The zero-knowledge self-claim supports P2PKH (`1…`) and P2WPKH (`bc1q…`) outputs today. A new output needs 144 Bitcoin confirmations (about one day) before it can claim.

* The mirror tracks Bitcoin's UTXO set continuously. Every live BTC UTXO has a corresponding QBTC entitlement of equal size.
* The mirror updates with every new Bitcoin block. New UTXOs add new entitlements. Spent UTXOs are reconciled. Whoever currently controls a Bitcoin UTXO controls the corresponding QBTC entitlement.
* A holder exercises an entitlement with a **zero-knowledge proof** of control. The wallet signs a digest with the Bitcoin key and sends the signature to a proving service. The service builds the proof and broadcasts the claim. The Bitcoin public key never goes on chain.
* Governance votes can reclaim dormant exposed-key BTC UTXOs that have not moved for more than 17 years. The cutoff is a Bitcoin block height written into each proposal. The matching QBTC goes 90% to the Reserve, 5% to a development fund and 5% to a marketing fund.

This design has properties the alternatives do not:

| Property | **QBTC** | Soft fork | Hard fork | Bridge | Wrapped |
|---|---|---|---|---|---|
| Does not touch Bitcoin | **Yes** | Yes | No | Yes | Yes |
| Allocates to every BTC UTXO | **Entitlement for every UTXO; self-claim for P2PKH and P2WPKH today** | No | Yes | No | No |
| Handles dormant exposed-key coins | **Reclaims the QBTC entitlement only** | No | Maybe | No | No |
| No custodian, no peg | **Yes** | Yes | Yes | No | No |
| Holder controls timing | **Yes** | Yes | No | Yes | Yes |

## The trade-off

QBTC is a separate ledger with its own validator set, its own block history, its own social contract. A QBTC unit and a BTC unit are not the same asset.

QBTC offers a separate chain with post-quantum validator signatures. It mirrors your Bitcoin balance, lets you claim on your own schedule, does not need Bitcoin to change, and does not hold your BTC.

## Read next

* [Architecture](/build/architecture)
* [Claim Mechanism](/build/claim-mechanism)
* [Fair Launch Principles](/learn/fair-launch)
