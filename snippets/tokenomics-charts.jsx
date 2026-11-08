// Tokenomics charts for docs.qbtc.net.
// Colors, type and spacing come from the .qv-* rules in /style.css (light and dark).
// Data comes in as props from /snippets/tokenomics-data.jsx (snippets cannot import snippets).
// Hooks (useState) are provided by Mintlify; no import needed.
// Mintlify loads only exported symbols, so helpers live inside each component.
// Each chart carries its own caveat and source line, so a cropped screenshot keeps them.

// Tall segmented bar: one whole, split into parts. Legend lists names in block order.
// A share prints inside a block only where it fits (block >= 12%) and the part allows it.
export const SegmentedBar = ({ label, parts, note, source }) => {
  const fmtPct = (v) => `${Number.isInteger(v) ? v : v.toFixed(1)}%`;
  const [active, setActive] = useState(null);
  const current = parts.find((p) => p.key === active);
  // The details box floats over the legend, just under the bar. It takes no space in the page
  // flow, so hovering never moves the content below and leaves no blank gap.
  return (
    <figure className="qv-root not-prose" aria-label={label}>
      <figcaption className="qv-title">{label}</figcaption>
      {note ? <div className="qv-note">{note}</div> : null}
      <div className="qv-barwrap">
        <div className="qv-bar" role="list" onMouseLeave={() => setActive(null)}>
          {parts.map((p, i) => (
            <div
              key={p.key}
              role="listitem"
              tabIndex={0}
              className={`qv-seg qv-s${i + 1}${active && active !== p.key ? " qv-dim" : ""}`}
              style={{ flexGrow: p.share, flexBasis: 0 }}
              aria-label={`${p.name}${p.hideShare ? "" : `: ${fmtPct(p.share)}`}. ${p.detail}`}
              onMouseEnter={() => setActive(p.key)}
              onFocus={() => setActive(p.key)}
              onBlur={() => setActive(null)}
              onClick={() => setActive(p.key)}
            >
              {!p.hideShare && p.share >= 12 ? <span className="qv-seg-label">{fmtPct(p.share)}</span> : null}
            </div>
          ))}
        </div>
        <div className={`qv-pop${current ? " qv-on" : ""}`} aria-live="polite">
          {current ? (
            <div>
              <div className="qv-pop-name">
                {current.name}
                {current.hideShare ? "" : ` · ${fmtPct(current.share)}`}
              </div>
              <div>{current.detail}</div>
            </div>
          ) : null}
        </div>
      </div>
      <ul className="qv-legend">
        {parts.map((p, i) => (
          <li key={p.key}>
            <span className={`qv-key qv-s${i + 1}`} aria-hidden="true" />
            {p.href ? <a href={p.href}>{p.name}</a> : p.name}
          </li>
        ))}
      </ul>
      <div className="qv-hint qv-muted" style={{ visibility: current ? "hidden" : "visible" }}>Hover, tap or tab to a block for details.</div>
      {source ? <div className="qv-source">{source}</div> : null}
    </figure>
  );
};

// Illustrative Reserve balance. Parameter-free: time is in multiples of EmissionCurve years,
// balance is relative to the balance after a first reclaim. Payout per block =
// balance / (EmissionCurve x BlocksPerYear), so payout has the same shape as the balance.
// One example reclaim at t = reclaimAt adds reclaimSize x the first balance.
// Pointer (mouse, touch, pen) and keyboard (arrow keys) both move the reading point.
export const ReserveCurve = ({ reclaimAt = 1.2, reclaimSize = 0.5, tMax = 3 }) => {
  const [hover, setHover] = useState(null);
  const W = 640, H = 316, L = 66, R = 20, T = 20, B = 64;
  const yMax = 1.0;
  const x = (t) => L + (t / tMax) * (W - L - R);
  const y = (v) => T + (1 - v / yMax) * (H - T - B);
  const bal = (t) => (t < reclaimAt ? Math.exp(-t) : (Math.exp(-reclaimAt) + reclaimSize) * Math.exp(-(t - reclaimAt)));
  const clamp = (t) => Math.min(tMax, Math.max(0, t));

  const pts = [];
  for (let i = 0; i <= 300; i++) {
    const t = (i / 300) * tMax;
    if (t >= reclaimAt && pts.length && pts[pts.length - 1].t < reclaimAt) {
      pts.push({ t: reclaimAt, v: Math.exp(-reclaimAt) });
      pts.push({ t: reclaimAt, v: bal(reclaimAt) });
    }
    pts.push({ t, v: bal(t) });
  }
  const d = pts.map((p, i) => `${i ? "L" : "M"}${x(p.t).toFixed(1)},${y(p.v).toFixed(1)}`).join(" ");
  const yTicks = [0, 0.25, 0.5, 0.75, 1];
  const xTicks = [0, 1, 2, 3];

  const onPointer = (e) => {
    const box = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - box.left) / box.width) * W;
    setHover(clamp(((px - L) / (W - L - R)) * tMax));
  };
  const onKey = (e) => {
    const step = e.shiftKey ? 0.5 : 0.1;
    if (e.key === "ArrowRight") { e.preventDefault(); setHover((h) => clamp((h ?? 0) + step)); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); setHover((h) => clamp((h ?? 0) - step)); }
    else if (e.key === "Home") { e.preventDefault(); setHover(0); }
    else if (e.key === "End") { e.preventDefault(); setHover(tMax); }
    else if (e.key === "Escape") setHover(null);
  };

  return (
    <figure className="qv-root not-prose" aria-label="Illustration of the Reserve payout rule. Not a forecast.">
      <figcaption className="qv-title">How the payout rule draws down the Reserve (illustration, not a forecast)</figcaption>
      <div className="qv-note">
        Reserve balance as a share of its balance after the first reclaim. No QBTC amounts, no parameter values. The
        Reserve starts empty at genesis. Reclaims need a governance vote and none is guaranteed.
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="qv-svg"
        tabIndex={0}
        aria-label="Chart. The balance falls to about 37% after one EmissionCurve period. An example reclaim steps it up. Use the left and right arrow keys to read values."
        onPointerMove={onPointer}
        onPointerDown={onPointer}
        onPointerLeave={(e) => { if (e.pointerType === "mouse") setHover(null); }}
        onKeyDown={onKey}
        onFocus={() => setHover((h) => h ?? 0)}
      >
        {yTicks.map((v) => (
          <g key={v}>
            <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} className="qv-grid" />
            <text x={L - 8} y={y(v) + 4} textAnchor="end" className="qv-axis">{`${v * 100}%`}</text>
          </g>
        ))}
        {xTicks.map((t) => (
          <text key={t} x={x(t)} y={H - B + 20} textAnchor="middle" className="qv-axis">
            {t === 0 ? "0" : `${t}×`}
          </text>
        ))}
        <text x={(L + W - R) / 2} y={H - 6} textAnchor="middle" className="qv-axis">
          Time, in multiples of EmissionCurve years
        </text>
        <line x1={x(reclaimAt)} x2={x(reclaimAt)} y1={T} y2={H - B} className="qv-event" />
        <text x={x(reclaimAt) + 6} y={T + 12} className="qv-axis">Example reclaim</text>
        <path d={d} className="qv-line" />
        {hover !== null ? (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={T} y2={H - B} className="qv-cross" />
            <circle cx={x(hover)} cy={y(bal(hover))} r={5} className="qv-dot" />
          </g>
        ) : null}
      </svg>
      <div className="qv-tip" aria-live="polite">
        <span className="qv-tip-cell" aria-hidden="true">
          At 0.0× EmissionCurve years: Reserve at <strong>100%</strong> of its first balance. Payout per block is the
          same share of the first payout. Illustration only.
        </span>
        <span className={`qv-tip-cell qv-muted${hover === null ? " qv-on" : ""}`} aria-hidden={hover !== null}>
          Hover, tap or focus the chart and use the arrow keys to read a point.
        </span>
        <span className={`qv-tip-cell${hover !== null ? " qv-on" : ""}`} aria-hidden={hover === null}>
          {hover !== null ? (
            <>
              At {hover.toFixed(1)}× EmissionCurve years: Reserve at <strong>{Math.round(bal(hover) * 100)}%</strong> of
              its first balance. Payout per block is the same share of the first payout. Illustration only.
            </>
          ) : null}
        </span>
      </div>
      <div className="qv-source">Rule: x/qbtc/keeper/network_manager.go:24–45. Payouts are protocol distributions, not individual staking returns.</div>
    </figure>
  );
};
