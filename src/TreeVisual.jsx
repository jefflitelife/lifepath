import { useState, useEffect, useRef, useCallback } from "react";

const T = {
  bg: "#070709", sf: "#0f0f12", sfh: "#16161b", bd: "rgba(255,255,255,0.07)",
  tx: "#EEEAE0", mt: "#5a5a6e", sb: "#2e2e38", ac: "#C8FF00",
  bl: "#4D9FFF", gr: "#22C55E", or: "#FF7A3D", pu: "#A855F7",
  rd: "#FF4D4D", yl: "#F59E0B", pk: "#EC4899",
  fd: "'Syne',sans-serif", fb: "'DM Sans',sans-serif"
};

const BRANCH_COLORS = [T.ac, T.bl, T.gr, T.or, T.pu, T.pk, T.rd, T.yl];

function loadData() {
  try {
    const raw = localStorage.getItem("lifepath_v1");
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function initParticles(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    speed: Math.random() * 0.015 + 0.003,
    angle: Math.random() * Math.PI * 2,
    opacity: Math.random() * 0.6 + 0.2,
  }));
}

export default function TreeVisual({ onBack }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particlesRef = useRef(initParticles(150));
  const [data] = useState(() => loadData());
  const [selected, setSelected] = useState(null);
  const [waveNodes, setWaveNodes] = useState({});
  const [time, setTime] = useState(0);

  const userName = data.userName || "Toi";
  const branches = data.treeBranches || [];

  // Satellite positions
  const getBranchPos = useCallback((idx, total, cx, cy, radius) => {
    const angle = (idx / Math.max(total, 1)) * Math.PI * 2 - Math.PI / 2;
    return {
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius,
      angle,
    };
  }, []);

  // Animation loop for particles + time
  useEffect(() => {
    let frame;
    let last = performance.now();
    function tick(now) {
      const dt = (now - last) / 1000;
      last = now;
      setTime(t => t + dt);
      particlesRef.current = particlesRef.current.map(p => ({
        ...p,
        x: (p.x + Math.cos(p.angle) * p.speed + 100) % 100,
        y: (p.y + Math.sin(p.angle) * p.speed * 0.4 + 100) % 100,
      }));
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Draw on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;
    const radius = Math.min(W, H) * 0.32;

    ctx.clearRect(0, 0, W, H);

    // Particles
    particlesRef.current.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x / 100 * W, p.y / 100 * H, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${p.opacity * (0.5 + 0.5 * Math.sin(time * 0.5 + p.id))})`;
      ctx.fill();
    });

    // SVG-style connections + flux animation
    branches.forEach((b, i) => {
      const color = BRANCH_COLORS[i % BRANCH_COLORS.length];
      const pos = getBranchPos(i, branches.length, cx, cy, radius);

      // Gradient line
      const grad = ctx.createLinearGradient(cx, cy, pos.x, pos.y);
      grad.addColorStop(0, color + "88");
      grad.addColorStop(1, color + "22");
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(pos.x, pos.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Flux particle along line
      const t2 = (time * 0.6 + i * 0.3) % 1;
      const fx = cx + (pos.x - cx) * t2;
      const fy = cy + (pos.y - cy) * t2;
      ctx.beginPath();
      ctx.arc(fx, fy, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  }, [time, branches, getBranchPos]);

  const handleToggleObj = (branchIdx, levelIdx, objIdx) => {
    setWaveNodes(prev => ({ ...prev, [`${branchIdx}-${levelIdx}-${objIdx}`]: Date.now() }));
  };

  const W_SIZE = Math.min(window.innerWidth, 600);
  const H_SIZE = Math.min(window.innerHeight * 0.55, 400);
  const cx = W_SIZE / 2;
  const cy = H_SIZE / 2;
  const radius = Math.min(W_SIZE, H_SIZE) * 0.32;
  const pulse = 1 + 0.08 * Math.sin(time * 2);

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.tx, fontFamily: T.fb, paddingBottom: 80 }}>
      {/* Starfield canvas */}
      <canvas
        ref={canvasRef}
        width={W_SIZE}
        height={H_SIZE}
        style={{ display: "block", width: "100%", height: H_SIZE, position: "relative" }}
      />

      {/* SVG overlay — nodes */}
      <svg
        width={W_SIZE}
        height={H_SIZE}
        style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
        viewBox={`0 0 ${W_SIZE} ${H_SIZE}`}
      >
        {/* Central node glow */}
        <circle cx={cx} cy={cy} r={60 * pulse} fill="none" stroke={T.ac} strokeWidth={1} opacity={0.15} />
        <circle cx={cx} cy={cy} r={45 * pulse} fill="none" stroke={T.ac} strokeWidth={1.5} opacity={0.3} />
        <circle cx={cx} cy={cy} r={30} fill={T.bg} stroke={T.ac} strokeWidth={2.5} filter="url(#glowAc)" />
        <text x={cx} y={cy + 4} textAnchor="middle" fontSize={11} fill={T.ac} fontFamily={T.fd} fontWeight={800}
          style={{ letterSpacing: "-0.5px" }}>
          {userName.length > 8 ? userName.slice(0, 7) + "…" : userName}
        </text>

        {/* Glow filter */}
        <defs>
          <filter id="glowAc" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {branches.map((b, i) => {
            const color = BRANCH_COLORS[i % BRANCH_COLORS.length];
            return (
              <filter key={i} id={`glow${i}`} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            );
          })}
        </defs>

        {/* Branch satellite nodes */}
        {branches.map((b, i) => {
          const color = BRANCH_COLORS[i % BRANCH_COLORS.length];
          const pos = getBranchPos(i, branches.length, cx, cy, radius);
          const isSelected = selected === i;
          const nodePulse = isSelected ? 1.15 : (1 + 0.06 * Math.sin(time * 1.5 + i));
          const r = 22 * nodePulse;

          return (
            <g key={b.id} style={{ pointerEvents: "all", cursor: "pointer" }} onClick={() => setSelected(isSelected ? null : i)}>
              <circle cx={pos.x} cy={pos.y} r={r + 8} fill="none" stroke={color} strokeWidth={1} opacity={0.2 + 0.15 * Math.sin(time + i)} />
              <circle cx={pos.x} cy={pos.y} r={r} fill={T.bg} stroke={color} strokeWidth={isSelected ? 2.5 : 1.8}
                filter={`url(#glow${i})`} opacity={1} />
              <text x={pos.x} y={pos.y + 2} textAnchor="middle" fontSize={15} fill={color}>{b.icon || "🌿"}</text>
            </g>
          );
        })}
      </svg>

      {/* Selected branch overlay */}
      {selected !== null && branches[selected] && (
        <div style={{
          position: "relative", margin: "0 16px 16px",
          background: T.sf, border: `1px solid ${BRANCH_COLORS[selected % BRANCH_COLORS.length]}44`,
          borderLeft: `3px solid ${BRANCH_COLORS[selected % BRANCH_COLORS.length]}`,
          borderRadius: 14, padding: "14px 16px",
          animation: "fadeSlideIn .25s ease"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <h3 style={{ fontFamily: T.fd, fontSize: 15, fontWeight: 800, margin: 0 }}>
              {branches[selected].icon} {branches[selected].title}
            </h3>
            <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: T.mt, fontSize: 18, cursor: "pointer" }}>×</button>
          </div>

          {(branches[selected].levels || []).map((lv, li) => (
            <div key={li} style={{ marginBottom: 10 }}>
              <p style={{ fontSize: 11, color: T.mt, fontWeight: 700, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {lv.name || `Niveau ${li + 1}`}
              </p>
              {(lv.objs || []).map((obj, oi) => {
                const waveKey = `${selected}-${li}-${oi}`;
                const isWaving = waveNodes[waveKey] && Date.now() - waveNodes[waveKey] < 1000;
                return (
                  <div
                    key={oi}
                    onClick={() => handleToggleObj(selected, li, oi)}
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "5px 8px", borderRadius: 8, cursor: "pointer",
                      marginBottom: 3,
                      background: isWaving ? BRANCH_COLORS[selected % BRANCH_COLORS.length] + "22" : "transparent",
                      transition: "background .3s"
                    }}
                  >
                    <span style={{ fontSize: 13, color: BRANCH_COLORS[selected % BRANCH_COLORS.length] }}>◎</span>
                    <span style={{ fontSize: 12, color: T.tx }}>{typeof obj === "string" ? obj : obj.text || obj}</span>
                    {isWaving && <span style={{ fontSize: 10, color: T.ac, marginLeft: "auto" }}>✦</span>}
                  </div>
                );
              })}
            </div>
          ))}

          {(!branches[selected].levels || branches[selected].levels.length === 0) && (
            <p style={{ fontSize: 12, color: T.mt, textAlign: "center", padding: "10px 0" }}>Aucun objectif configuré pour cette branche.</p>
          )}
        </div>
      )}

      {/* Empty state */}
      {branches.length === 0 && (
        <div style={{ textAlign: "center", padding: "30px 20px", color: T.mt }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🌌</div>
          <p style={{ fontSize: 14 }}>Ton univers est vide.</p>
          <p style={{ fontSize: 12 }}>Ajoute des branches dans le mode classique.</p>
        </div>
      )}

      {/* Back button */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: T.bg + "ee", padding: "10px 16px", borderTop: `1px solid ${T.bd}` }}>
        <button
          onClick={onBack}
          style={{
            width: "100%", padding: "12px", borderRadius: 12, border: `1px solid ${T.bd}`,
            background: T.sf, color: T.tx, fontSize: 13, fontWeight: 600,
            fontFamily: T.fd, cursor: "pointer"
          }}
        >
          ← Mode Classique
        </button>
      </div>

      <style>{`
        @keyframes fadeSlideIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
}
