// Escena 3 Híbrida V3 (PuraPrueba V2 + ATOM Qué significa 95/98 Octanos Resistencia a Presión a 60fps): `octane`, light
// "El número 95 o 98 no mide pureza ni energía, solo indica cuánto resiste el combustible antes de explotar por presión."
import React from "react";
import { countTo, useScene } from "../../../src/engine";
import { LEAD } from "../../../src/engine/Stage";
import {
  AtomHybridStage,
  AtomNeonDeck,
  ImpactRig,
  KineticStamp,
  ShockwaveBurst,
  TECH,
  TechLabBackdrop,
  TechTelemetryStrip,
  ThermalEmbersOverlay,
} from "./parts";

export const Octane: React.FC = () => {
  const { f, theme, scene, cue } = useScene();
  const t0 = scene.from - LEAD;
  const c95 = cue("95");
  const cPureza = cue("pureza");
  const cCombustible = cue("combustible");
  const cPresion = cue("presión");

  const pressMode = f >= cCombustible - 2;
  const barPsi = Math.round(countTo(f, c95 - 2, 38, 87, 98));

  return (
    <ImpactRig triggers={[c95 - 2, cPureza - 2, cCombustible - 2, cPresion - 2]} intensity={10}>
      <TechLabBackdrop alert={pressMode} />

      <TechTelemetryStrip
        at={t0}
        label="ÍNDICE OCTANAJE"
        verdict={pressMode ? "ANTI-DETONACIÓN" : `OCTANO ${barPsi}`}
        pct={barPsi}
        status="warn"
        icon="cpu"
      />

      <AtomHybridStage
        srcA="gas-03.jpg"
        srcB="gas-10.jpg"
        at={t0 + 2}
        atomAt={cPureza - 2}
        splitAt={cCombustible - 2}
        climaxAt={cPresion - 2}
        punches={[c95 - 2, cCombustible - 2, cPresion - 2]}
        accentA={TECH.amber}
        accentAtom={TECH.amber}
        accentB={TECH.crimson}
        vfx={<ThermalEmbersOverlay active={pressMode} />}
      >
        <div
          style={{
            position: "absolute",
            left: 16,
            top: 14,
            padding: "7px 16px",
            borderRadius: 14,
            background: "rgba(7, 11, 20, 0.92)",
            boxShadow: `inset 0 0 0 2.5px ${pressMode ? TECH.crimson : TECH.amber}`,
            fontFamily: theme.font.mono,
            fontSize: 32,
            fontWeight: 900,
            color: "#FDE047",
            zIndex: 15,
          }}
        >
          🔢 95 / 98 = RESISTENCIA A PRESIÓN
        </div>

        <KineticStamp
          at={cCombustible - 2}
          text="🔥 NO TIENE MÁS ENERGÍA NI PUREZA"
          bg={TECH.crimson}
          ink="#FFFFFF"
          tilt={-2}
        />
      </AtomHybridStage>

      <ShockwaveBurst at={cPresion - 2} x={540} y={840} color={TECH.amber} size={265} />

      <AtomNeonDeck
        at={t0 + 5}
        tag="QUÍMICA"
        title="Energía Térmica por Litro (MJ/L)"
        rightText="IGUAL ENERGÍA"
        accent="#D97706"
        borderAccent={TECH.amber}
      />
    </ImpactRig>
  );
};
