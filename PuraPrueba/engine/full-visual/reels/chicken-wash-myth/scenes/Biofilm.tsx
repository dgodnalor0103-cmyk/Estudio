// Escena 4 Híbrida V3 (PuraPrueba V2 + ATOM Biofilm Muscular vs Agua Fría a 60fps): `biofilm`, dark
// "El agua fría del grifo jamás despega las bacterias adheridas a la fibra muscular, solo multiplica el riesgo de infección cruzada."
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
  WaterCorrosionOverlay,
} from "./parts";

export const Biofilm: React.FC = () => {
  const { f, theme, scene, cue } = useScene();
  const t0 = scene.from - LEAD;
  const cFria = cue("fría");
  const cBacterias = cue("bacterias");
  const cMulti = cue("multiplica");
  const cInfeccion = cue("infección");

  const crossMode = f >= cMulti - 2;
  const multX = Math.round(countTo(f, t0 + 4, 38, 1, 5));

  return (
    <ImpactRig triggers={[cFria - 2, cBacterias - 2, cMulti - 2, cInfeccion - 2]} intensity={11}>
      <TechLabBackdrop alert />

      <TechTelemetryStrip
        at={t0}
        label="FIBRA MUSCULAR"
        verdict={crossMode ? "CONTAGIO 5X" : "0% ELIMINACIÓN"}
        pct={crossMode ? 96 : 100}
        status="warn"
        icon="droplet"
      />

      <AtomHybridStage
        srcA="chick-04.jpg"
        srcB="chick-11.jpg"
        at={t0 + 2}
        atomAt={cBacterias - 2}
        splitAt={cMulti - 2}
        climaxAt={cInfeccion - 2}
        punches={[cFria - 2, cMulti - 2, cInfeccion - 2]}
        accentA={TECH.cyanBright}
        accentAtom={TECH.crimson}
        accentB={TECH.crimson}
        vfx={<WaterCorrosionOverlay active mode="water" />}
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
          ❄️ AGUA FRÍA = 0% DESPRENDIMIENTO
        </div>

        <KineticStamp
          at={cMulti - 2}
          text="☣️ MULTIPLICA INFECCIÓN CRUZADA"
          bg={TECH.crimson}
          ink="#FFFFFF"
          tilt={-2}
        />
      </AtomHybridStage>

      <ShockwaveBurst at={cMulti - 2} x={540} y={840} color={TECH.crimson} size={275} />

      <AtomNeonDeck
        at={t0 + 4}
        tag="ADHERENCIA"
        title="Biofilm Bacteriano en Tejido Crudo"
        rightText={`${multX}X CONTAGIO`}
        accent={TECH.crimson}
        borderAccent={TECH.crimson}
      />
    </ImpactRig>
  );
};
