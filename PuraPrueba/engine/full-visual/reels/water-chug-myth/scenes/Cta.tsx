// Escena 7 Híbrida V3: `cta`, dark (AtomHybridStage Portal 60fps + Anillo Hidratación 100% + Comentarios + Loop)
// "Cuéntame en comentarios cuántos vasos de agua llevas hoy, guarda este video para cuidar tu energía y recuerda esto:"
import React from "react";
import { Cursor, arrive, countTo, ease, prog, typeOn, useScene } from "../../../src/engine";
import { LEAD } from "../../../src/engine/Stage";
import {
  AtomHybridStage,
  ImpactRig,
  ShockwaveBurst,
  STAGE,
  TECH,
  TechLabBackdrop,
} from "./parts";

export const Cta: React.FC = () => {
  const { f, fps, theme, ground, scene, cue } = useScene();
  const t0 = scene.from - LEAD;
  const cComentarios = cue("comentarios");
  const cVasos = cue("vasos");
  const cVideo = cue("video");
  const cEnergia = cue("energía");
  const cEsto = cue("esto");

  const hydPct = Math.round(countTo(f, cComentarios - 4, 26, 42, 100));
  const typed = typeOn("Hoy llevo 4 vasos por sorbos 💧⚡", f, cVasos - 2, fps, 42);
  const posted = f >= cEsto - 4;
  const ringCirc = 2 * Math.PI * 56;

  return (
    <ImpactRig triggers={[cVasos - 2, cVideo - 2, cEsto - 4]} intensity={11}>
      <TechLabBackdrop emerald={posted} />

      <AtomHybridStage
        srcA="wat-07.jpg"
        srcB="wat-14.jpg"
        at={t0}
        atomAt={cVasos - 2}
        splitAt={cVideo - 3}
        climaxAt={cEsto - 4}
        punches={[cEnergia - 2, cEsto - 4]}
        top={526}
        height={338}
        accentA={TECH.cyanBright}
        accentAtom={TECH.emerald}
        accentB={TECH.emerald}
      >
        <div
          style={{
            position: "absolute",
            left: 16,
            bottom: 14,
            padding: "7px 18px",
            borderRadius: 14,
            background: "rgba(7, 11, 20, 0.92)",
            boxShadow: `inset 0 0 0 2.5px ${TECH.emerald}`,
            fontFamily: theme.font.ui,
            fontSize: 32,
            fontWeight: 900,
            color: TECH.emerald,
            zIndex: 15,
          }}
        >
          💧 Sorbos + Sales = 100% Energía
        </div>
      </AtomHybridStage>

      <ShockwaveBurst at={cEsto - 4} x={820} y={1270} color={TECH.emerald} size={245} />

      <div
        style={{
          position: "absolute",
          left: STAGE.left,
          top: 878,
          width: STAGE.safeWidth,
          height: 228,
          borderRadius: 26,
          padding: "18px 24px",
          boxSizing: "border-box",
          background: TECH.darkCard,
          boxShadow: `0 18px 46px rgba(0,0,0,0.52), inset 0 0 0 2.5px ${TECH.emerald}`,
          display: "flex",
          alignItems: "center",
          gap: 22,
          transform: `translateY(${((1 - arrive(f, t0 + 3, 15)) * 90).toFixed(1)}px)`,
          opacity: prog(f, t0 + 3, 4, ease.linear),
        }}
      >
        <div style={{ position: "relative", width: 140, height: 140, flex: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={140} height={140} viewBox="0 0 140 140" style={{ transform: "rotate(-90deg)" }}>
            <circle cx={70} cy={70} r={56} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth={13} />
            <circle
              cx={70}
              cy={70}
              r={56}
              fill="none"
              stroke={TECH.emerald}
              strokeWidth={13}
              strokeLinecap="round"
              strokeDasharray={ringCirc}
              strokeDashoffset={ringCirc * (1 - hydPct / 100)}
            />
          </svg>
          <span style={{ position: "absolute", fontFamily: theme.font.mono, fontSize: 33, fontWeight: 900, color: "#FFFFFF" }}>
            {hydPct}%
          </span>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
          <span style={{ fontFamily: theme.font.ui, fontSize: 33, fontWeight: 900, color: ground.ink }}>
            ¿Cómo tomas agua hoy?
          </span>
          <div style={{ display: "flex", gap: 12 }}>
            <div
              style={{
                flex: 1,
                padding: "11px 12px",
                borderRadius: 16,
                background: TECH.crimsonSoft,
                boxShadow: `inset 0 0 0 2px ${TECH.crimson}`,
                fontFamily: theme.font.ui,
                fontSize: 32,
                fontWeight: 900,
                color: "#FDA4AF",
                textAlign: "center",
              }}
            >
              🌊 De golpe
            </div>
            <div
              style={{
                flex: 1,
                padding: "11px 12px",
                borderRadius: 16,
                background: TECH.emeraldSoft,
                boxShadow: `inset 0 0 0 2px ${TECH.emerald}`,
                fontFamily: theme.font.ui,
                fontSize: 32,
                fontWeight: 900,
                color: TECH.emerald,
                textAlign: "center",
              }}
            >
              💧 Por sorbos
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: STAGE.left,
          top: 1120,
          width: STAGE.safeWidth,
          height: 312,
          borderRadius: 28,
          padding: "22px 26px",
          boxSizing: "border-box",
          background: TECH.darkCard,
          boxShadow: `0 24px 58px rgba(0,0,0,0.58), 0 0 26px rgba(0,240,255,0.20), inset 0 0 0 3px ${
            posted ? TECH.emerald : TECH.cyanBright
          }`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          transform: `translateY(${((1 - arrive(f, t0 + 6, 16)) * 105).toFixed(1)}px)`,
          opacity: prog(f, t0 + 6, 4, ease.linear),
        }}
      >
        <span style={{ fontFamily: theme.font.ui, fontSize: 33, fontWeight: 900, color: ground.ink }}>
          Comentarios · ¿Cuántos vasos llevas hoy? 👇
        </span>

        <div
          style={{
            height: 84,
            borderRadius: 999,
            padding: "0 14px 0 26px",
            background: TECH.darkDeep,
            boxShadow: `inset 0 0 0 2.5px ${f >= cVasos - 2 ? TECH.cyanBright : TECH.borderDark}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontFamily: f >= cVasos - 2 ? theme.font.mono : theme.font.ui,
              fontSize: 32,
              fontWeight: 900,
              color: f >= cVasos - 2 ? "#FFFFFF" : ground.dim,
            }}
          >
            {f >= cVasos - 2 ? `${typed.text}${typed.typing ? "|" : ""}` : "Cuenta tus vasos de hoy..."}
          </span>

          <div
            style={{
              height: 58,
              padding: "0 22px",
              borderRadius: 999,
              background: posted ? TECH.emerald : TECH.crimson,
              boxShadow: `0 0 18px ${posted ? TECH.emerald : TECH.crimson}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: theme.font.ui,
              fontSize: 32,
              fontWeight: 900,
              color: posted ? "#042217" : "#FFFFFF",
            }}
          >
            {posted ? "Publicado ✓" : "Publicar"}
          </div>
        </div>

        <span style={{ fontFamily: theme.font.ui, fontSize: 32, fontWeight: 800, color: posted ? TECH.emerald : ground.dim }}>
          {posted ? "✓ ¡Toma un sorbo ahora! Y recuerda..." : "Guarda este video para tu día a día"}
        </span>
      </div>

      <Cursor
        path={[
          { f: cVasos - 4, x: 850, y: 1450 },
          { f: cVideo, x: 460, y: 1274 },
          { f: cEsto - 5, x: 825, y: 1274 },
          { f: cEsto + 12, x: 825, y: 1274 },
          { f: cEsto + 120, x: 880, y: 1350 },
        ]}
      />
    </ImpactRig>
  );
};
