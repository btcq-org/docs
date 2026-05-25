#!/usr/bin/env python3
"""
Generate llms-full.txt — full QBTC docs concatenated for LLM ingestion.

Curated ordering (Welcome → Learn → Build → Research → Resources) instead of
Mintlify's default alphabetical. Strips MDX components and frontmatter clutter
to make the output cleaner for downstream tokenization.

Run from sites/docs root:    python3 scripts/build-llms-full.py
"""
import re
from pathlib import Path

DOCS = Path(__file__).resolve().parent.parent
OUT = DOCS / "llms-full.txt"

# Curated reading order: most-important first.
ORDER = [
    ("index.mdx",                          "Welcome to QBTC"),
    ("learn/what-is-qbtc.md",              "What is QBTC?"),
    ("learn/quantum-threat.md",            "The Quantum Threat to Bitcoin"),
    ("learn/why-parallel-chain.md",        "Why a Parallel Chain"),
    ("learn/for-btc-holders.md",           "For BTC Holders"),
    ("learn/fair-launch.md",               "Fair Launch Principles"),
    ("learn/roadmap.md",                   "Roadmap"),
    ("learn/faq.md",                       "FAQ"),
    ("build/overview.md",                  "Build Overview"),
    ("build/architecture.md",              "Architecture"),
    ("build/quantum-resistance.md",        "Quantum Resistance (ML-DSA)"),
    ("build/consensus.md",                 "Consensus & Validators"),
    ("build/claim-mechanism.md",           "Claim Mechanism"),
    ("build/running-a-node.md",            "Running a Node"),
    ("build/api-reference.md",             "API Reference"),
    ("research/overview.md",               "Research Overview"),
    ("research/protocol-spec.md",          "Protocol Specification"),
    ("research/tokenomics.md",             "Tokenomics"),
    ("research/security-model.md",         "Security Model"),
    ("research/quantum-risk-assessment.md","Quantum Risk Assessment"),
    ("resources/glossary.md",              "Glossary"),
    ("resources/whitepaper.md",            "Whitepaper"),
    ("resources/brand-assets.md",          "Brand Assets"),
]

PREAMBLE = """# QBTC — Full Documentation

> The first quantum-resistant Bitcoin chain. Every Bitcoin holder gets a 1:1 entitlement claimable by zero-knowledge proof. Consensus signed by NIST FIPS 204 (ML-DSA). Pre-mainnet, targeting Q3 2026.

This file concatenates all QBTC documentation pages in curated reading order for LLM ingestion. Sources are at https://docs.qbtc.net and https://github.com/btcq-org/docs.

---

"""

def strip_frontmatter(text: str) -> tuple[str, str]:
    """Return (title, body_without_frontmatter)."""
    m = re.match(r"^---\s*\n(.*?)\n---\s*\n", text, re.DOTALL)
    if not m:
        return ("", text)
    block = m.group(1)
    title_m = re.search(r'^title:\s*"?([^"\n]+)"?\s*$', block, re.MULTILINE)
    title = title_m.group(1).strip() if title_m else ""
    return (title, text[m.end():])

def flatten_mdx(text: str) -> str:
    """Strip MDX components to clean text for LLMs."""
    # <Note>X</Note>, <Info>X</Info>, <Warning>X</Warning>, <Check>X</Check>, <Tip>X</Tip>
    text = re.sub(r"<(Note|Info|Warning|Check|Tip|Danger)>\s*", "**Note:** ", text)
    text = re.sub(r"\s*</(Note|Info|Warning|Check|Tip|Danger)>", "", text)
    # <CardGroup ...> ... </CardGroup>  → just content
    text = re.sub(r"<CardGroup[^>]*>", "", text)
    text = re.sub(r"</CardGroup>", "", text)
    # <Card title="X" icon="..." href="Y"> ... </Card>  → bold title + link + body
    def card_repl(m):
        attrs = m.group(1)
        body = m.group(2).strip()
        title_m = re.search(r'title="([^"]+)"', attrs)
        href_m  = re.search(r'href="([^"]+)"', attrs)
        title = title_m.group(1) if title_m else ""
        href  = href_m.group(1)  if href_m  else ""
        prefix = f"**[{title}]({href})**" if href else f"**{title}**"
        return f"{prefix} — {body}\n"
    text = re.sub(r'<Card\s+([^>]*)>(.*?)</Card>', card_repl, text, flags=re.DOTALL)
    # Mintlify frontmatter directives like `mode: "wide"` already stripped
    return text

chunks = [PREAMBLE]

for rel_path, fallback_title in ORDER:
    fp = DOCS / rel_path
    if not fp.exists():
        print(f"WARN missing: {rel_path}")
        continue
    raw = fp.read_text()
    title, body = strip_frontmatter(raw)
    title = title or fallback_title
    body = flatten_mdx(body).strip()
    source_url = f"https://docs.qbtc.net/{rel_path.replace('.mdx','').replace('.md','')}"
    chunks.append(f"# {title}\n\nSource: {source_url}\n\n{body}\n\n---\n\n")

OUT.write_text("".join(chunks))
print(f"wrote {OUT} ({OUT.stat().st_size:,} bytes, {len(ORDER)} pages)")
