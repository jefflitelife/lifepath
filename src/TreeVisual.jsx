import { useState, useMemo, useContext } from "react";
import { Ctx } from "./ctx";

export default function TreeVisual() {
  const { nav, treeBranches, treeObjCompleted, toggleTreeObj, userName, treeBranchProg } = useContext(Ctx);
  const [selected, setSelected] = useState(null);

  const W = window.innerWidth;
  const H = window.innerHeight;
  const cx = W / 2;
  const cy = H / 2;
  const R = Math.min(W, H) * 0.36;

  const isExample = treeBranches.length === 0;
  const nodes = isExample
    ? [
        { id: "_1", icon: "🏋️", title: "Sport", color: "#22C55E" },
        { id: "_2", icon: "💰", title: "Finances", color: "#F59E0B" },
        { id: "_3", icon: "✍️", title: "Créativité", color: "#A855F7" },
      ]
    : treeBranches;

  const getPos = (i, total) => {
    const angle = (i / Math.max(total, 1)) * Math.PI * 2 - Math.PI / 2;
    return { x: cx + Math.cos(angle) * R, y: cy + Math.sin(angle) * R };
  };

  const stars = useMemo(() =>
    Array.from({ length: 80 }, (_, i) => ({
      left: (i * 37.7 + 11) % 100,
      top: (i * 53.3 + 7) % 100,
      size: i % 5 === 0 ? 2 : 1,
      opacity: 0.15 + (i % 7) * 0.07,
    }))
  , []);

  const totalObj = treeBranches.reduce((s, b) => {
    (b.levels || []).forEach(l => { s += (l.objs || []).length; });
    return s;
  }, 0);
  const doneObj = Object.values(treeObjCompleted || {}).filter(Boolean).length;
  const globalPct = totalObj > 0 ? Math.round(doneObj / totalObj * 100) : 0;
  const displayName = (userName || "MOI").slice(0, 8).toUpperCase();

  return (
    <div style={{ position: "fixed", inset: 0, background: "#030508", overflow: "hidden" }}>
      <style>{`
        @keyframes tv-pulse { 0%,100%{transform:scale(1);} 50%{transform:scale(1.05);} }
        @keyframes tv-spin  { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
        @keyframes tv-spinr { from{transform:rotate(0deg);} to{transform:rotate(-360deg);} }
        @keyframes tv-bob   { 0%,100%{transform:translateY(0px);} 50%{transform:translateY(-4px);} }
        @keyframes slide-up { from{transform:translateY(100%);} to{transform:translateY(0);} }
        .tv-pulse { animation: tv-pulse 3s ease-in-out infinite; }
        .tv-spin  { animation: tv-spin 20s linear infinite; }
        .tv-spinr { animation: tv-spinr 15s linear infinite; }
        .tv-bob   { animation: tv-bob 3s ease-in-out infinite; }
      `}</style>

      {/* Stars */}
      {stars.map((s, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${s.left}%`, top: `${s.top}%`,
          width: s.size, height: s.size,
          borderRadius: "50%",
          background: "white",
          opacity: s.opacity,
        }}/>
      ))}

      {/* SVG — lignes de connexion seulement, aucune animation */}
      <svg width="100%" height="100%"
        style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
        {nodes.map((b, i) => {
          const pos = getPos(i, nodes.length);
          return (
            <line key={b.id}
              x1={cx} y1={cy} x2={pos.x} y2={pos.y}
              stroke={b.color} strokeWidth={1} strokeOpacity={0.25}
              strokeDasharray="3 9"
            />
          );
        })}
        <circle cx={cx} cy={cy} r={R}
          fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={1}/>
      </svg>

      {/* Nœuds branches */}
      {nodes.map((b, i) => {
        const pos = getPos(i, nodes.length);
        const prog = !isExample && treeBranchProg ? Math.round(treeBranchProg(b) * 100) : 0;
        const isSel = selected?.id === b.id;
        return (
          <div key={b.id} className="tv-bob"
            onClick={() => {
              if (isExample) { nav("treecatalog"); return; }
              setSelected(isSel ? null : b);
            }}
            style={{
              position: "absolute",
              left: pos.x - 38, top: pos.y - 38,
              width: 76, height: 76,
              borderRadius: "50%",
              background: `${b.color}18`,
              border: `2px solid ${isSel ? b.color : b.color + "55"}`,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              cursor: "pointer",
              boxShadow: isSel ? `0 0 24px ${b.color}55` : "none",
              transition: "border-color .2s, box-shadow .2s",
              animationDelay: `${i * 0.4}s`,
              zIndex: 2,
            }}>
            <span style={{ fontSize: 22, lineHeight: 1 }}>{b.icon || "🌿"}</span>
            <span style={{
              fontSize: 7, color: "rgba(255,255,255,0.65)", marginTop: 3,
              fontFamily: "'DM Sans',sans-serif", textAlign: "center",
              maxWidth: 58, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>{isExample ? "+ Ajouter" : (b.title || "")}</span>
            {prog > 0 && (
              <div style={{
                position: "absolute", top: -5, right: -5,
                width: 22, height: 22, borderRadius: "50%",
                background: b.color,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 7, fontWeight: 700, color: "#080808",
              }}>{prog}%</div>
            )}
          </div>
        );
      })}

      {/* Nœud central */}
      <div style={{ position: "absolute", left: cx - 56, top: cy - 56, width: 112, height: 112, zIndex: 3 }}>
        {/* Anneau extérieur rotatif */}
        <div className="tv-spin" style={{
          position: "absolute", inset: -16, borderRadius: "50%",
          border: "1px dashed rgba(200,255,0,0.2)",
          pointerEvents: "none",
        }}/>
        {/* Anneau intérieur */}
        <div className="tv-spinr" style={{
          position: "absolute", inset: -6, borderRadius: "50%",
          border: "1px solid rgba(200,255,0,0.3)",
          pointerEvents: "none",
        }}/>
        {/* Disque principal */}
        <div className="tv-pulse" style={{
          width: "100%", height: "100%", borderRadius: "50%",
          background: "radial-gradient(circle at 40% 35%, #1e3a0e, #070a04)",
          border: "2px solid #C8FF00",
          boxShadow: "0 0 32px rgba(200,255,0,0.18), inset 0 0 20px rgba(200,255,0,0.05)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{
            fontSize: 12, fontWeight: 800, color: "#C8FF00",
            fontFamily: "'Syne',sans-serif", letterSpacing: "-0.3px",
          }}>{displayName}</span>
          <span style={{
            fontSize: 7, color: "rgba(200,255,0,0.4)",
            fontFamily: "'Syne',sans-serif", letterSpacing: "1px",
          }}>VOUS</span>
        </div>
      </div>

      {/* Score en haut à droite */}
      <div style={{
        position: "absolute", top: 16, right: 16, zIndex: 5,
        background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)",
        borderRadius: 20, padding: "6px 12px",
        fontSize: 9, color: "rgba(255,255,255,0.55)", fontFamily: "'DM Sans',sans-serif",
      }}>
        🌳 {treeBranches.length} branches · {globalPct}% global
      </div>

      {/* Bottom sheet */}
      {selected && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0, height: "55vh",
          background: "#0d0d10", borderTop: `1px solid ${selected.color}40`,
          borderRadius: "20px 20px 0 0",
          animation: "slide-up .3s ease-out",
          display: "flex", flexDirection: "column", overflow: "hidden", zIndex: 10,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 20px 12px", flexShrink: 0 }}>
            <span style={{ fontSize: 20 }}>{selected.icon}</span>
            <span style={{ flex: 1, fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 700, color: "#EEEAE0" }}>
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
              const lv = levels[curIdx];
              return (
                <>
                  <p style={{ fontSize: 9, color: selected.color, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 10 }}>
                    NIVEAU {curIdx + 1} — {lv.name || `Niveau ${curIdx + 1}`}
                  </p>
                  {(lv.objs || []).map((obj, oi) => {
                    const done = !!treeObjCompleted[`${selected.id}::${obj}`];
                    const txt = typeof obj === "string" ? obj : (obj.text || String(obj));
                    return (
                      <div key={oi} onClick={() => toggleTreeObj(selected.id, obj)}
                        style={{
                          display: "flex", alignItems: "center", gap: 10,
                          padding: "9px 10px", borderRadius: 8, marginBottom: 4,
                          background: done ? `${selected.color}0a` : "rgba(255,255,255,0.02)",
                          border: `1px solid ${done ? selected.color + "28" : "rgba(255,255,255,0.05)"}`,
                          cursor: "pointer",
                        }}>
                        <div style={{
                          width: 14, height: 14, borderRadius: 3, flexShrink: 0,
                          background: done ? selected.color : "transparent",
                          border: `2px solid ${done ? selected.color : "#2e2e38"}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 8, color: "#080808", fontWeight: 900,
                        }}>{done ? "✓" : ""}</div>
                        <span style={{ fontSize: 11, color: done ? "#5a5a6e" : "#EEEAE0", textDecoration: done ? "line-through" : "none" }}>
                          {txt}
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

      {/* Contrôles bas */}
      <div style={{
        position: "fixed",
        bottom: selected ? "calc(55vh + 12px)" : 20,
        left: 0, right: 0,
        display: "flex", justifyContent: "space-between",
        padding: "0 20px", zIndex: 11,
        transition: "bottom .3s",
      }}>
        <button onClick={() => nav("tree")} style={{
          background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
          color: "white", fontSize: 10, borderRadius: 20, padding: "8px 16px",
          cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
        }}>← Classique</button>
        <button onClick={() => nav("treecatalog")} style={{
          background: "#C8FF00", border: "none",
          color: "#080808", fontSize: 10, fontWeight: 700, borderRadius: 20, padding: "8px 16px",
          cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
        }}>+ Branche</button>
      </div>
    </div>
  );
}
