# Vision & Roadmap

Features here are part of the QBTC design vision but not part of the v1 chain code. The canonical "what is built" surface is the [Protocol Specification (v1)](protocol-spec.md).

QBTC's original whitepaper described an ambitious end-state: a quantum-safe chain with a native liquidity pool, a cross-chain threshold-signature vault, liquid staking, and bonded validator economics linked to pool liquidity. Building all of that into v1 would have shipped a much larger attack surface before the network has users.

The v1 chain is the substrate. The economic and DeFi layer activates later, through governance, once the network has the participants and the float to support it.

## Status by feature

### Part of v1 tokenomics, governance-activated

**Reclamation of dormant exposed-key BTC into the Reserve Module**

Part of QBTC's v1 tokenomic design, not a post-MVP add-on. See [Tokenomics](tokenomics.md) for the full treatment. Implementation status:

* **What it does.** Removes the QBTC entitlement attached to quantum-vulnerable dormant Bitcoin UTXOs (P2PK outputs and reused-address outputs older than 17 years) from the claim mirror, and credits the corresponding QBTC to the Reserve Module. This sustains validator emission and removes value from vulnerable circulation by redistributing it to a quantum-safe address (the Reserve).
* **Implementation status.** The reclamation is activated through standard `x/gov` proposals rather than enforced automatically by the chain code. This is intentional: the validator set sets the activation parameters (UTXO categories, block-height cutoffs, dispute windows) through governance without requiring chain forks.
* **Source for the original design**: original whitepaper, §Re-mined Rewards.

### Planned, post-MVP

**Native liquidity pool (BTC ↔ QBTC swaps)**

* **What it does.** An on-chain XYK liquidity pool that lets users swap between native BTC and QBTC without going through an exchange or a bridge custodian.
* **Mechanism.** Pool-bonded validators provide liquidity (BTC + QBTC) into the pool. Swaps charge a small fee that flows to bonded providers.
* **Status.** **Not in v1 code.** Will be developed and activated as a post-MVP feature once claim-derived QBTC float is sufficient to support meaningful pool depth.

**Cross-chain threshold-signature vault**

* **What it does.** A DKLS24-style threshold ECDSA signature vault co-operated by QBTC's validator set, allowing the network to custody BTC for the liquidity pool without any trusted bridge operator.
* **Status.** **Not in v1 code.** Tied to the liquidity pool. Will activate together.

**Liquid staking**

* **What it does.** Tokenized representation of staked QBTC, transferable while underlying QBTC remains bonded. Allows stakers to participate in DeFi without unbonding.
* **Status.** **Not in v1 code.** Post-MVP.

**Streaming swaps**

* **What it does.** Time-distributed swap execution to reduce slippage and MEV on large trades.
* **Status.** **Not in v1 code.** Depends on the liquidity pool.

**Pool-bonded validator economics**

* **What it does.** Validators bond liquidity-pool units (rather than just QBTC) to enter the active set, aligning validator incentives with pool depth and liquidity provision.
* **Status.** **Not in v1 code.** Depends on the liquidity pool.

### Research direction

**Alternative post-quantum signature schemes**

* The cryptography landscape will keep evolving. QBTC's choice of ML-DSA is the current best industry standard, but future signature schemes (e.g., lattice schemes with smaller signatures, or hash-based schemes for specific use cases) may warrant exploration.

**ZK claim circuit optimization**

* The current PLONK circuit takes ~60 seconds and ~8 GB of RAM to generate a proof. Faster proof systems (e.g., newer SNARK proof systems, or recursive composition) could materially improve user experience.

**Cross-chain interactions with other quantum-safe ecosystems**

* As other chains adopt post-quantum signatures, IBC interactions between QBTC and other quantum-safe Cosmos chains become a natural extension.

## What is explicitly NOT planned

* **No bridge that locks BTC under a custodian or multisig**. This is incompatible with the quantum-safety thesis (the bridge's ECDSA keys are themselves quantum-vulnerable).
* **No fork of Bitcoin**. Bitcoin's chain is not touched.
* **No change to the 21M supply cap.** The cap holds for all time.
* **No retroactive airdrops** to wallets that did specific things to qualify. Entitlement is determined by holding BTC, not by performing actions QBTC rewards.

## How features get activated

Once mainnet is live, new features are introduced through standard Cosmos `x/gov` governance proposals. There is no privileged team upgrade path. The protocol evolves the way other Cosmos chains evolve.

## Cross-references

* [Protocol Specification (v1)](protocol-spec.md), the canonical "what is built" reference.
* [Roadmap (Learn)](../learn/roadmap.md), the plain-language summary of the same content.
