// Escena 6 Híbrida V3: `rule`, light (AtomHybridStage Regla de Tanqueo 60fps + Checklist Guardable)
// "Aplica esta regla al tanquear: revisa la tapa de tu tanque, usa Regular si dice 87 octanos y ahorra cientos de dólares al año."
import React from "react";
import { arrive, ease, pop, prog, useScene } from "../../../src/engine";
import { LEAD } from "../../../src/engine/Stage";
import {
  AtomHybridStage,
  EvidenceHeader,
  ImpactRig,
  KineticStamp,
  ShockwaveBurst,
  STAGE,
  TECH,
  TechLabBackdrop,
  TechTelemetryStrip,
} from "./parts";

export const Rule: React.FC = () => {
  const { f, theme, ground, scene, cue } = useScene();
  const t0 = scene.from - LEAD;
  const cTapa = cue("tapa");
  const c87 = cue("87");
  const cCientos = cue("cientos");
  const cAno = cue("año");

  const doneCount =
    (f >= cTapa - 3 ? 1 : 0) + (f >= c87 - 3 ? 1 : 0) + (f >= cCientos - 3 ? 1 : 0);

  return (
    <ImpactRig triggers={[t0 + 4, cTapa - 2, c87 - 2, cCientos - 2]} intensity={9}>
      <TechLabBackdrop emerald />

      <TechTelemetryStrip
        at={t0}
        label="REGLA DE AHORRO"
        verdict={`${doneCount}/3 PASOS`}
        pct={100}
        status="safe"
        icon="cpu"
      />

      <AtomHybridStage
        srcA="gas-06.jpg"
        srcB="gas-13.jpg"
        at={t0 + 2}
        atomAt={cTapa - 2}
        splitAt={c87 - 2}
        climaxAt={cAno - 2}
        punches={[cTapa - 2, c87 - 2, cCientos - 2]}
        top={632}
        height={368}
        accentA={TECH.cyan}
        accentAtom={TECH.emerald}
        accentB={TECH.emerald}
      >
        <KineticStamp
          at={t0 + 6}
          text="📸 GUARDA ESTA REGLA PARA TU AUTO"
          bg="#070B14"
          ink="#00E699"
          tilt={-1.5}
        />
      </AtomHybridStage>

      <ShockwaveBurst at={cCientos - 2} x={540} y={820} color={TECH.emerald} size={255} />

      <div
        style={{
          position: "absolute",
          left: STAGE.left,
          top: 1014,
          width: STAGE.safeWidth,
          height: 422,
          borderRadius: 28,
          padding: "20px 26px",
          boxSizing: "border-box",
          background: TECH.lightCard,
          boxShadow: `0 24px 58px rgba(15,23,42,0.13), inset 0 0 0 3px ${TECH.emerald}`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          transform: `translateY(${((1 - arrive(f, t0 + 4, 15)) * 105).toFixed(1)}px)`,
          opacity: prog(f, t0 + 4, 4, ease.linear),
        }}
      >
        <EvidenceHeader tag="TANQUEO" title="Cómo Elegir la Gasolina Correcta" rightText="AHORRA 18%" accent="#059669" />

        {[
          { trig: cTapa - 3, icon: "1", txt: "Mira la etiqueta en la tapa del tanque" },
          { trig: c87 - 3, icon: "2", txt: "Si dice 87 / Regular, no pagues más" },
          { trig: cCientos - 3, icon: "3", txt: "Solo usa Premium si dice OBLIGATORIO" },
        ].map((r) => {
          const ok = f >= r.trig;
          return (
            <div
              key={r.icon}
              style={{
                padding: "13px 18px",
                borderRadius: 18,
                background: ok ? "#ECFDF5" : "#F8FAFC",
                boxShadow: `inset 0 0 0 2.5px ${ok ? TECH.emerald : "#CBD5E1"}`,
                display: "flex",
                alignItems: "center",
                gap: 14,
                ...(ok ? pop(f, r.trig, { dur: 9, from: 0.91 }) : {}),
              }}
            >
              <span
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 13,
                  background: ok ? "#059669" : "#94A3B8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: theme.font.mono,
                  fontSize: 32,
                  fontWeight: 900,
                  color: "#FFFFFF",
                  flex: "none",
                }}
              >
                {ok ? "✓" : r.icon}
              </span>
              <span style={{ fontFamily: theme.font.ui, fontSize: 32, fontWeight: 800, color: ground.ink }}>
                {r.txt}
              </span>
            </div>
          );
        })}
      </div>
    </ImpactRig>
  );
};
