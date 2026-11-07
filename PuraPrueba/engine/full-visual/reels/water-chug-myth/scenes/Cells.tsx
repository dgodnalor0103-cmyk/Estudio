// Escena 5 Híbrida V3 (PuraPrueba V2 + ATOM Pérdida de Sodio/Potasio y Fatiga Celular a 60fps): `cells`, dark
// "Peor aún: ese lavado rápido arrastra sodio y potasio fuera de tu cuerpo, dejándote más cansado y con las células deshidratadas."
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

export const Cells: React.FC = () => {
  const { f, theme, scene, cue } = useScene();
  const t0 = scene.from - LEAD;
  const cSodio = cue("sodio");
  const cCuerpo = cue("cuerpo");
  const cCansado = cue("cansado");
  const cCelulas = cue("células");

  const drained = f >= cCansado - 2;
  const cellHyd = Math.round(countTo(f, cSodio - 2, 34, 78, 42));

  return (
    <ImpactRig triggers={[cSodio - 2, cCuerpo - 2, cCansado - 2, cCelulas - 2]} intensity={12}>
      <TechLabBackdrop alert />

      <TechTelemetryStrip
        at={t0}
        label="ENERGÍA CELULAR"
        verdict={drained ? "FATIGA MINERAL" : `SODIO ${cellHyd}%`}
        pct={cellHyd}
        status="warn"
        icon="battery"
      />

      <AtomHybridStage
        srcA="wat-05.jpg"
        srcB="wat-12.jpg"
        at={t0 + 2}
        atomAt={cSodio - 2}
        splitAt={cCansado - 2}
        climaxAt={cCelulas - 2}
        punches={[cSodio - 2, cCansado - 2, cCelulas - 2]}
        accentA={TECH.amber}
        accentAtom={TECH.crimson}
        accentB={TECH.crimson}
        vfx={<ElectricArcOverlay active={drained} color={TECH.crimson} />}
      >
        <div
          style={{
            position: "absolute",
            left: 16,
            top: 14,
            padding: "7px 16px",
            borderRadius: 14,
            background: "rgba(7, 11, 20, 0.92)",
            boxShadow: `inset 0 0 0 2.5px ${TECH.crimson}`,
            fontFamily: theme.font.mono,
            fontSize: 32,
            fontWeight: 900,
            color: "#FDA4AF",
            zIndex: 15,
          }}
        >
          🧂 ARRASTRA SODIO (Na+) Y POTASIO (K+)
        </div>

        <KineticStamp
          at={cCansado - 2}
          text="🔋 TE DEJA MÁS CANSADO Y SIN SALES"
          bg={TECH.crimson}
          ink="#FFFFFF"
          tilt={-2}
        />
      </AtomHybridStage>

      <ShockwaveBurst at={cCansado - 2} x={540} y={840} color={TECH.crimson} size={295} />

      <AtomNeonDeck
        at={t0 + 4}
        tag="ELECTROLITOS"
        title="Reserva Intracelular de Minerales"
        rightText={drained ? "BAJA ENERGÍA" : `${cellHyd}% NIVEL`}
        accent={TECH.crimson}
        borderAccent={TECH.crimson}
      />
    </ImpactRig>
  );
};
