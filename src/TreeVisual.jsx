import { useState, useEffect, useRef, useCallback } from "react";

const LS_KEY = "lifepath_v1";
const loadData = () => { try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch { return {}; } };
const patchLS  = (patch) => { try { const s = loadData(); localStorage.setItem(LS_KEY, JSON.stringify({ ...s, ...patch })); } catch {} };

export default function TreeVisual({ onBack }) {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const starsRef  = useRef([]);

  const [dims, setDims] = useState({ w: window.innerWidth, h: window.innerHeight });

  const [treeBranches]       = useState(() => loadData().treeBranches || []);
  const [userName]           = useState(() => loadData().userName || "");
  const [objDone, setObjDone] = useState(() => loadData().treeObjCompleted || {});
  const [selected, setSelected] = useState(null);

  const { w, h } = dims;
  const cx = w / 2;
  const cy = h / 2;
  const R  = Math.min(w, h) * 0.36;

  const isExample = treeBranches.length === 0;
  const nodes = isExample
    ? [
        { id: "_1", icon: "🏋️", title: "Sport",     color: "#22C55E" },
        { id: "_2", icon: "💰", title: "Finances",   color: "#F59E0B" },
        { id: "_3", icon: "✍️", title: "Créativité", color: "#A855F7" },
      ]
    : treeBranches;

  const getPos = (i, total) => {
    const angle = (i / Math.max(total, 1)) * Math.PI * 2 - Math.PI / 2;
    return { x: cx + Math.cos(angle) * R, y: cy + Math.sin(angle) * R };
  };

  const branchProg = (b) => {
    let t = 0, d = 0;
    (b.levels || []).forEach(l =>
      (l.objs || []).forEach(o => { t++; if (objDone[`${b.id}::${o}`]) d++; })
    );
    return t > 0 ? Math.round(d / t * 100) : 0;
  };

  const toggleObj = useCallback((branchId, obj) => {
    const key = `${branchId}::${obj}`;
    setObjDone(prev => {
      const next = { ...prev, [key]: !prev[key] };
      patchLS({ treeObjCompleted: next });
      return next;
    });
  }, []);

  // Canvas — 150 star particles
  useEffect(() => {
    starsRef.current = Array.from({ length: 150 }, () => ({
      x:           Math.random() * dims.w,
      y:           Math.random() * dims.h,
      r:           0.4 + Math.random() * 1.6,
      baseOpacity: 0.08 + Math.random() * 0.35,
      phase:       Math.random() * Math.PI * 2,
      speed:       0.004 + Math.random() * 0.008,
      vx:          (Math.random() - 0.5) * 0.06,
      vy:          (Math.random() - 0.5) * 0.06,
    }));

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let tick = 0;

    const draw = () => {
      const cw = canvas.width;
      const ch = canvas.height;
      ctx.fillStyle = "#030508";
      ctx.fillRect(0, 0, cw, ch);

      starsRef.current.forEach(s => {
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0)  s.x = cw;
        if (s.x > cw) s.x = 0;
        if (s.y < 0)  s.y = ch;
        if (s.y > ch) s.y = 0;

        const opacity = s.baseOpacity + Math.sin(tick * s.speed + s.phase) * 0.12;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${Math.max(0, opacity)})`;
        ctx.fill();
      });

      tick++;
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [dims]);

  useEffect(() => {
    const onResize = () => setDims({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const totalObj  = treeBranches.reduce((s, b) => { (b.levels || []).forEach(l => { s += (l.objs || []).length; }); return s; }, 0);
  const doneCount = Object.values(objDone).filter(Boolean).length;
  const globalPct = totalObj > 0 ? Math.round(doneCount / totalObj * 100) : 0;
  const displayName = (userName || "MOI").slice(0, 8).toUpperCase();

  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden" }}>
      <style>{`
        @keyframes tv-pulse { 0%,100%{transform:scale(1);} 50%{transform:scale(1.05);} }
        @keyframes tv-spin  { from{transform:rotate(0deg);}  to{transform:rotate(360deg);}  }
        @keyframes tv-spinr { from{transform:rotate(0deg);}  to{transform:rotate(-360deg);} }
        @keyframes tv-bob   { 0%,100%{transform:translateY(0px);} 50%{transform:translateY(-5px);} }
        @keyframes slide-up { from{transform:translateY(100%);} to{transform:translateY(0);} }
        .tv-pulse { animation: tv-pulse 3s ease-in-out infinite; }
        .tv-spin  { animation: tv-spin  20s linear infinite; }
        .tv-spinr { animation: tv-spinr 15s linear infinite; }
        .tv-bob   { animation: tv-bob   3s  ease-in-out infinite; }
      `}</style>

      {/* Canvas — étoiles animées */}
      <canvas
        ref={canvasRef}
        width={w}
        height={h}
        style={{ position: "absolute", inset: 0 }}
      />

      {/* SVG — lignes de connexion */}
      <svg width={w} height={h}
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
          fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
      </svg>

      {/* Nœuds branches */}
      {nodes.map((b, i) => {
        const pos  = getPos(i, nodes.length);
        const prog = !isExample ? branchProg(b) : 0;
        const isSel = selected?.id === b.id;
        return (
          <div key={b.id} className="tv-bob"
            onClick={() => { if (!isExample) setSelected(isSel ? null : b); }}
            style={{
              position: "absolute",
              left: pos.x - 38, top: pos.y - 38,
              width: 76, height: 76,
              borderRadius: "50%",
              background: `${b.color}18`,
              border: `2px solid ${isSel ? b.color : b.color + "55"}`,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              cursor: isExample ? "default" : "pointer",
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
            }}>{b.title || ""}</span>
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
        <div className="tv-spin" style={{
          position: "absolute", inset: -16, borderRadius: "50%",
          border: "1px dashed rgba(200,255,0,0.2)", pointerEvents: "none",
        }} />
        <div className="tv-spinr" style={{
          position: "absolute", inset: -6, borderRadius: "50%",
          border: "1px solid rgba(200,255,0,0.3)", pointerEvents: "none",
        }} />
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

      {/* Badge score */}
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
                const done = objs.filter(o => objDone[`${selected.id}::${o}`]).length;
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
                    const done = !!objDone[`${selected.id}::${obj}`];
                    const txt = typeof obj === "string" ? obj : (obj.text || String(obj));
                    return (
                      <div key={oi} onClick={() => toggleObj(selected.id, obj)}
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
        display: "flex", justifyContent: "flex-start",
        padding: "0 20px", zIndex: 11,
        transition: "bottom .3s",
      }}>
        <button onClick={onBack} style={{
          background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
          color: "white", fontSize: 10, borderRadius: 20, padding: "8px 16px",
          cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
        }}>← Retour</button>
      </div>
    </div>
  );
}
