# QBTC Documentation

Source for [docs.qbtc.net](https://docs.qbtc.net) — the QBTC project documentation.

QBTC is the first quantum-resistant Bitcoin chain. Every Bitcoin holder gets a 1:1 entitlement claimable by ZK proof. The chain runs on ML-DSA (NIST FIPS 204) at consensus. Pre-mainnet, targeting Q3 2026.

## Stack

Built with [Mintlify](https://mintlify.com). Config lives in `docs.json`. Pages are MDX (`index.mdx`) or Markdown (`learn/`, `build/`, `research/`, `resources/`).

## Local preview

```bash
npm i -g mint
mint dev
```

Then open http://localhost:3000.

## Contributing

Edit any `.md` / `.mdx` file directly. Pull requests deploy preview URLs automatically through the Mintlify GitHub App.

## Other QBTC resources

- Project site: [qbtc.net](https://qbtc.net)
- Block explorer: [explorer.qbtc.net](https://explorer.qbtc.net)
- Risk indexer: [indexer.qbtc.net](https://indexer.qbtc.net)
- Org: [github.com/btcq-org](https://github.com/btcq-org)
- Twitter/X: [@qbtc_net](https://x.com/qbtc_net)
- Discord: [discord.gg/anMfAjtCPZ](https://discord.gg/anMfAjtCPZ)
