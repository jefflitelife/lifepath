import { useState, useMemo, useContext } from "react";
import { Ctx } from "./App";

export default function TreeVisual() {
  const {
    nav, treeBranches, treeObjCompleted, toggleTreeObj,
    userName, treeBranchProg
  } = useContext(Ctx);

  const [selected, setSelected] = useState(null);
  const [wave, setWave] = useState(null);

  const W = window.innerWidth;
  const H = window.innerHeight;
  const cx = W / 2;
  const cy = H / 2;
  const ORBIT_R = 165;

  const stars = useMemo(() =>
    Array.from({ length: 200 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      r: 0.5 + Math.random() * 2,
      op: 0.2 + Math.random() * 0.7,
      dur: 2 + Math.random() * 4,
      delay: -(Math.random() * 4),
    }))
  , []);

  const isExample = treeBranches.length === 0;
  const displayBranches = isExample ? [] : treeBranches;

  const getBranchPos = (idx, total) => {
    const angle = (idx / Math.max(total, 1)) * Math.PI * 2 - Math.PI / 2;
    return {
      x: cx + Math.cos(angle) * ORBIT_R,
      y: cy + Math.sin(angle) * ORBIT_R,
    };
  };

  const handleNodeClick = (branch, pos) => {
    if (isExample) { nav("treecatalog"); return; }
    const newSel = selected?.id === branch.id ? null : branch;
    setSelected(newSel);
    if (newSel) {
      setWave({ x: pos.x, y: pos.y, color: branch.color });
      setTimeout(() => setWave(null), 700);
    }
  };

  const totalObj = treeBranches.reduce((s, b) => {
    (b.levels || []).forEach(l => { s += (l.objs || []).length; });
    return s;
  }, 0);
  const doneObj = Object.values(treeObjCompleted).filter(Boolean).length;
  const globalPct = totalObj > 0 ? Math.round(doneObj / totalObj * 100) : 0;

  const displayName = (userName || "MOI").slice(0, 8);

  return (
    <div style={{ position: "fixed", inset: 0, background: "#030508", overflow: "hidden" }}>
      <style>{`
        @keyframes twinkle { 0%,100%{opacity:var(--op);} 50%{opacity:calc(var(--op)*0.3);} }
        @keyframes pulse-glow { 0%,100%{filter:drop-shadow(0 0 4px #C8FF00);} 50%{filter:drop-shadow(0 0 12px #C8FF00) drop-shadow(0 0 24px #C8FF0060);} }
        @keyframes branch-glow { 0%,100%{filter:drop-shadow(0 0 3px var(--col));} 50%{filter:drop-shadow(0 0 8px var(--col)) drop-shadow(0 0 16px var(--col));} }
        @keyframes orbit-particle { 0%{opacity:0;} 10%{opacity:1;} 90%{opacity:1;} 100%{opacity:0;} }
        @keyframes slide-up { from{transform:translateY(100%);} to{transform:translateY(0);} }
        .tv-star { animation: twinkle var(--dur) var(--delay) ease-in-out infinite; }
        .tv-central { animation: pulse-glow 3s ease-in-out infinite; }
        .tv-branch { animation: branch-glow var(--bdur) ease-in-out infinite; }
      `}</style>

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="tvCentral" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1a2a0a"/>
            <stop offset="100%" stopColor="#0a0f05"/>
          </radialGradient>
          <radialGradient id="tvVignette" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="transparent"/>
            <stop offset="100%" stopColor="#030508"/>
          </radialGradient>
          <radialGradient id="tvNeb1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C8FF00" stopOpacity="0.07"/>
            <stop offset="100%" stopColor="#C8FF00" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="tvNeb2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.05"/>
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="tvNeb3" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1D4ED8" stopOpacity="0.04"/>
            <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0"/>
          </radialGradient>
          {displayBranches.map((b, i) => (
            <radialGradient key={`bg${i}`} id={`tvBg${i}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={b.color} stopOpacity="0.25"/>
              <stop offset="100%" stopColor={b.color} stopOpacity="0.05"/>
            </radialGradient>
          ))}
        </defs>

        {/* Stars */}
        {stars.map(s => (
          <circle
            key={s.id}
            className="tv-star"
            cx={`${s.x}%`}
            cy={`${s.y}%`}
            r={s.r}
            fill="white"
            style={{ "--op": s.op, "--dur": `${s.dur}s`, "--delay": `${s.delay}s`, opacity: s.op }}
          />
        ))}

        {/* Nebulae */}
        <ellipse cx={cx * 0.35} cy={cy * 0.4} rx={280} ry={220} fill="url(#tvNeb1)"/>
        <ellipse cx={cx * 1.65} cy={cy * 0.65} rx={320} ry={260} fill="url(#tvNeb2)"/>
        <ellipse cx={cx * 0.8} cy={cy * 1.7} rx={380} ry={200} fill="url(#tvNeb3)"/>

        {/* Orbit ring */}
        <circle cx={cx} cy={cy} r={ORBIT_R} fill="none" stroke="#ffffff08" strokeWidth={1} strokeDasharray="2 12"/>

        {/* Connection lines + sliding particles */}
        {displayBranches.map((b, i) => {
          const pos = getBranchPos(i, displayBranches.length);
          const delay = `${i * 0.4}s`;
          return (
            <g key={`conn-${b.id}`}>
              <line x1={cx} y1={cy} x2={pos.x} y2={pos.y}
                stroke={b.color} strokeWidth={1} strokeOpacity={0.4} strokeDasharray="4 8">
                <animate attributeName="strokeDashoffset" from="48" to="0" dur="2s" repeatCount="indefinite"/>
              </line>
              <circle r={3} fill={b.color}>
                <animateMotion path={`M ${cx},${cy} L ${pos.x},${pos.y}`}
                  dur="2s" begin={delay} repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1"
                  dur="2s" begin={delay} repeatCount="indefinite"/>
              </circle>
            </g>
          );
        })}

        {/* Branch nodes */}
        {displayBranches.map((b, i) => {
          const pos = getBranchPos(i, displayBranches.length);
          const rawPct = treeBranchProg ? treeBranchProg(b) : 0;
          const pct = Math.round(rawPct * 100);
          const isSelected = selected?.id === b.id;
          const nameParts = (b.title || "").slice(0, 14).split(" ");
          return (
            <g key={`node-${b.id}`} style={{ cursor: "pointer" }}
              onClick={() => handleNodeClick(b, pos)}>
              <circle cx={pos.x} cy={pos.y} r={38}
                fill={`url(#tvBg${i})`}
                stroke={b.color} strokeWidth={1.5}
                className="tv-branch"
                style={{ "--col": b.color, "--bdur": `${2 + i * 0.3}s` }}
              />
              <circle cx={pos.x} cy={pos.y} r={22} fill={b.color + "15"}/>
              <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="central" fontSize={16}>{b.icon || "🌿"}</text>
              {nameParts.length > 1 ? (
                <>
                  <text x={pos.x} y={pos.y + 28} textAnchor="middle" fontSize={8} fill="rgba(255,255,255,0.7)" fontFamily="DM Sans,sans-serif">{nameParts[0]}</text>
                  <text x={pos.x} y={pos.y + 38} textAnchor="middle" fontSize={8} fill="rgba(255,255,255,0.7)" fontFamily="DM Sans,sans-serif">{nameParts.slice(1).join(" ")}</text>
                </>
              ) : (
                <text x={pos.x} y={pos.y + 28} textAnchor="middle" fontSize={8} fill="rgba(255,255,255,0.7)" fontFamily="DM Sans,sans-serif">{b.title || ""}</text>
              )}
              {pct > 0 && (
                <>
                  <circle cx={pos.x + 26} cy={pos.y - 26} r={12} fill={b.color}/>
                  <text x={pos.x + 26} y={pos.y - 26} textAnchor="middle" dominantBaseline="central" fontSize={7} fill="#080808" fontWeight="700">{pct}%</text>
                </>
              )}
              {isSelected && <circle cx={pos.x} cy={pos.y} r={44} fill="none" stroke={b.color} strokeWidth={2} strokeOpacity={0.7}/>}
            </g>
          );
        })}

        {/* Click wave */}
        {wave && (
          <circle cx={wave.x} cy={wave.y} r={38} fill="none" stroke={wave.color} strokeWidth={2}>
            <animate attributeName="r" from="38" to="80" dur="0.6s" fill="freeze"/>
            <animate attributeName="opacity" from="0.6" to="0" dur="0.6s" fill="freeze"/>
          </circle>
        )}

        {/* Empty state placeholder nodes */}
        {isExample && [0, 1, 2].map(i => {
          const pos = getBranchPos(i, 3);
          return (
            <g key={`ph-${i}`} style={{ cursor: "pointer" }} onClick={() => nav("treecatalog")}>
              <circle cx={pos.x} cy={pos.y} r={38} fill="none" stroke="#ffffff20" strokeWidth={1} strokeDasharray="4 6"/>
              <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="central" fontSize={14} fill="#ffffff40">+</text>
              <text x={pos.x} y={pos.y + 16} textAnchor="middle" fontSize={8} fill="#ffffff30" fontFamily="DM Sans,sans-serif">Ajouter</text>
            </g>
          );
        })}

        {/* Central node — outer rotating rings */}
        <circle cx={cx} cy={cy} r={80} fill="none" stroke="#C8FF00" strokeWidth={1} strokeOpacity={0.15}>
          <animateTransform attributeName="transform" type="rotate"
            from={`0 ${cx} ${cy}`} to={`360 ${cx} ${cy}`} dur="20s" repeatCount="indefinite"/>
        </circle>
        <circle cx={cx} cy={cy} r={64} fill="none" stroke="#C8FF00" strokeWidth={1} strokeOpacity={0.3}>
          <animateTransform attributeName="transform" type="rotate"
            from={`0 ${cx} ${cy}`} to={`-360 ${cx} ${cy}`} dur="15s" repeatCount="indefinite"/>
        </circle>

        {/* Central node main */}
        <circle cx={cx} cy={cy} r={52} fill="url(#tvCentral)" stroke="#C8FF00" strokeWidth={1.5} className="tv-central"/>
        <circle cx={cx} cy={cy} r={26} fill="#C8FF0015"/>
        <text x={cx} y={cy - 2} textAnchor="middle" dominantBaseline="central"
          fontSize={11} fontFamily="Syne,sans-serif" fontWeight="700" fill="#C8FF00">
          {displayName}
        </text>
        <text x={cx} y={cy + 18} textAnchor="middle" fontSize={7} fill="#C8FF0060" fontFamily="Syne,sans-serif">VOUS</text>

        {/* Vignette */}
        <rect x={0} y={0} width={W} height={H} fill="url(#tvVignette)" pointerEvents="none"/>
      </svg>

      {/* Score top-right */}
      <div style={{
        position: "absolute", top: 16, right: 16, zIndex: 5,
        background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
        borderRadius: 20, padding: "6px 12px",
        fontSize: 9, color: "rgba(255,255,255,0.6)", fontFamily: "DM Sans,sans-serif"
      }}>
        🌳 {treeBranches.length} branches · {globalPct}% global
      </div>

      {/* Bottom sheet */}
      {selected && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          height: "55vh", background: "#0d0d10",
          borderTop: `1px solid ${selected.color}40`,
          borderRadius: "20px 20px 0 0",
          animation: "slide-up 0.3s ease-out",
          overflow: "hidden", display: "flex", flexDirection: "column",
          zIndex: 10
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 20px 12px", flexShrink: 0 }}>
            <span style={{ fontSize: 20 }}>{selected.icon}</span>
            <span style={{ flex: 1, fontFamily: "Syne,sans-serif", fontSize: 14, fontWeight: 700, color: "#EEEAE0" }}>
              {selected.title}
            </span>
            <button onClick={() => setSelected(null)}
              style={{ background: "none", border: "none", color: "#5a5a6e", fontSize: 22, cursor: "pointer", padding: 0, lineHeight: 1 }}>
              ×
            </button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 80px" }}>
            {(() => {
              const levels = selected.levels || [];
              if (!levels.length) return (
                <p style={{ fontSize: 12, color: "#5a5a6e", textAlign: "center", marginTop: 20 }}>
                  Aucun objectif configuré.
                </p>
              );
              let curIdx = 0;
              for (let i = 0; i < levels.length; i++) {
                const objs = levels[i].objs || [];
                const done = objs.filter(o => treeObjCompleted[`${selected.id}::${o}`]).length;
                if (done < objs.length) { curIdx = i; break; }
                curIdx = Math.min(i + 1, levels.length - 1);
              }
              const curLvl = levels[curIdx];
              const objs = curLvl.objs || [];
              return (
                <>
                  <p style={{
                    fontSize: 9, color: selected.color, fontWeight: 700,
                    letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 10
                  }}>
                    NIVEAU {curIdx + 1} — {curLvl.name || `Niveau ${curIdx + 1}`}
                  </p>
                  {objs.map((obj, oi) => {
                    const done = !!treeObjCompleted[`${selected.id}::${obj}`];
                    const objText = typeof obj === "string" ? obj : (obj.text || String(obj));
                    return (
                      <div key={oi} onClick={() => toggleTreeObj(selected.id, obj)}
                        style={{
                          display: "flex", alignItems: "center", gap: 10,
                          padding: "9px 10px", borderRadius: 8, marginBottom: 4,
                          background: done ? `${selected.color}0a` : "rgba(255,255,255,0.02)",
                          border: `1px solid ${done ? selected.color + "28" : "rgba(255,255,255,0.05)"}`,
                          cursor: "pointer"
                        }}>
                        <div style={{
                          width: 14, height: 14, borderRadius: 3, flexShrink: 0,
                          background: done ? selected.color : "transparent",
                          border: `2px solid ${done ? selected.color : "#2e2e38"}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 8, color: "#080808", fontWeight: 900
                        }}>
                          {done ? "✓" : ""}
                        </div>
                        <span style={{
                          fontSize: 11, color: done ? "#5a5a6e" : "#EEEAE0",
                          textDecoration: done ? "line-through" : "none"
                        }}>
                          {objText}
                        </span>
                      </div>
                    );
                  })}
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Bottom controls */}
      <div style={{
        position: "fixed",
        bottom: selected ? "calc(55vh + 12px)" : 20,
        left: 0, right: 0,
        display: "flex", justifyContent: "space-between",
        padding: "0 20px", zIndex: 11,
        transition: "bottom 0.3s ease-out"
      }}>
        <button onClick={() => nav("tree")} style={{
          background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
          color: "white", fontSize: 10, borderRadius: 20, padding: "8px 16px",
          cursor: "pointer", fontFamily: "DM Sans,sans-serif"
        }}>
          ← Classique
        </button>
        <button onClick={() => nav("treecatalog")} style={{
          background: "#C8FF00", border: "none",
          color: "#080808", fontSize: 10, fontWeight: 700, borderRadius: 20, padding: "8px 16px",
          cursor: "pointer", fontFamily: "DM Sans,sans-serif"
        }}>
          + Branche
        </button>
      </div>
    </div>
  );
}
