// Single source for every number in the tokenomics charts.
// Pages import this file and pass the values to the chart components as props.
// Mintlify snippets cannot import other snippets, so the charts do not import it.

export const tokenomicsData = {
  // Bitcoin's 21M cap is also the QBTC ceiling.
  // Shares are approximate percent of 21,000,000 (Bitcoin block 974,786, November 2026).
  // They set block widths only. The page prints no figures, so it does not go stale;
  // readers get current figures from indexer.qbtc.net.
  supply: [
    {
      key: "claimable",
      name: "Other mined BTC",
      share: 91.1,
      hideShare: true,
      detail: "Each unspent output has a claim entry. At launch, P2PKH and P2WPKH outputs with compressed keys claim 1:1 by proof. Other types: to be confirmed.",
    },
    {
      key: "reclaimable",
      name: "Dormant > 17 years (policy), key exposed: governance may vote to reclaim",
      share: 4.7,
      detail: "Exposed-key outputs not moved for more than 17 years. The 17-year rule is governance policy, not a code check. A reclaim mints QBTC only; the BTC stays on Bitcoin.",
      href: "https://indexer.qbtc.net",
      hideShare: true,
    },
    {
      key: "unmined",
      name: "Not yet mined",
      share: 4.2,
      hideShare: true,
      detail: "New coinbase outputs add new claim entries as Bitcoin mines them.",
    },
  ],

  supplyNote: "Bitcoin supply by status. QBTC is designed never to exceed this cap. A reclaim mints QBTC on the QBTC chain; no BTC moves.",
  supplySource: "Block widths are approximate. For current figures, see indexer.qbtc.net.",
  splitNote: "Applies only to QBTC minted by a governance reclamation. A user claim sends 100% to the holder.",

  // Split of each governance reclamation.
  split: [
    { key: "reserve", name: "Reserve Module", share: 90, detail: "Funds validator emission, paid out each block." },
    { key: "dev", name: "Development fund", share: 5, detail: "Funds continued protocol development." },
    { key: "mkt", name: "Marketing fund", share: 5, detail: "Funds adoption and education." },
  ],
};
