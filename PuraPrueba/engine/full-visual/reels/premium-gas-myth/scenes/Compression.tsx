// Escena 4 Híbrida V3 (PuraPrueba V2 + ATOM Motor Turbo Alta Compresión vs Motor Normal a 60fps): `compression`, dark
// "Los motores turbo de alta compresión sí exigen Premium para evitar cascabeleo, pero un motor normal quema la Regular exactamente igual."
import React from "react";
import { countTo, useScene } from "../../../src/engine";
import { LEAD } from "../../../src/engine/Stage";
import {
  AtomHybridStage,
  AtomNeonDeck,
  ElectricArcOverlay,
  ImpactRig,
  KineticStamp,
  ShockwaveBurst,
  TECH,
  TechLabBackdrop,
  TechTelemetryStrip,
} from "./parts";

export const Compression: React.FC = () => {
  const { f, theme, scene, cue } = useScene();
  const t0 = scene.from - LEAD;
  const cTurbo = cue("turbo");
  const cCascabeleo = cue("cascabeleo");
  const cNormal = cue("normal");
  const cIgual = cue("igual");

  const normalMode = f >= cNormal - 2;
  const ratio = Math.round(countTo(f, t0 + 3, 36, 9, 12));

  return (
    <ImpactRig triggers={[cTurbo - 2, cCascabeleo - 2, cNormal - 2, cIgual - 2]} intensity={11}>
      <TechLabBackdrop alert={!normalMode} emerald={normalMode} />

      <TechTelemetryStrip
        at={t0}
        label="CÁMARA DE COMBUSTIÓN"
        verdict={normalMode ? "COMBUSTIÓN 100%" : `COMPRESIÓN ${ratio}:1`}
        pct={normalMode ? 100 : 84}
        status={normalMode ? "safe" : "warn"}
        icon="cpu"
      />

      <AtomHybridStage
        srcA="gas-04.jpg"
        srcB="gas-11.jpg"
        at={t0 + 2}
        atomAt={cCascabeleo - 2}
        splitAt={cNormal - 2}
        climaxAt={cIgual - 2}
        punches={[cTurbo - 2, cNormal - 2, cIgual - 2]}
        accentA={TECH.amber}
        accentAtom={TECH.crimson}
        accentB={TECH.emerald}
        vfx={<ElectricArcOverlay active={!normalMode} color={TECH.amber} />}
      >
        <div
          style={{
            position: "absolute",
            left: 16,
            top: 14,
            padding: "7px 16px",
            borderRadius: 14,
            background: "rgba(7, 11, 20, 0.92)",
            boxShadow: `inset 0 0 0 2.5px ${normalMode ? TECH.emerald : TECH.crimson}`,
            fontFamily: theme.font.mono,
            fontSize: 32,
            fontWeight: 900,
            color: normalMode ? TECH.emerald : "#FDA4AF",
            zIndex: 15,
          }}
        >
          {normalMode ? "✅ MOTOR NORMAL: REGULAR = ÓPTIMO" : "🏎️ SOLO TURBO EXIGE 95+ OCTANOS"}
        </div>

        <KineticStamp
          at={cNormal - 2}
          text="⚡ QUEMA LA REGULAR EXACTAMENTE IGUAL"
          bg={TECH.emerald}
          ink="#042217"
          tilt={-2}
        />
      </AtomHybridStage>

      <ShockwaveBurst at={cNormal - 2} x={540} y={840} color={TECH.emerald} size={275} />

      <AtomNeonDeck
        at={t0 + 4}
        tag="PISTONES"
        title="Sensor de Detonación y Chispa"
        rightText={normalMode ? "100% EFICIENTE" : "TURBO 12:1"}
        accent={normalMode ? TECH.emerald : TECH.crimson}
        borderAccent={normalMode ? TECH.emerald : TECH.crimson}
      />
    </ImpactRig>
  );
};
