// Escena 3 Híbrida V3 (PuraPrueba V2 + ATOM Campylobacter & Salmonella en Platos y Esponja a 60fps): `aerosol`, light
// "Esas gotas cargadas de Campylobacter y Salmonella aterrizan en tus platos limpios, en la esponja y en la tabla de picar."
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

export const Aerosol: React.FC = () => {
  const { f, theme, scene, cue } = useScene();
  const t0 = scene.from - LEAD;
  const cCampy = cue("Campylobacter");
  const cSalmo = cue("Salmonella");
  const cPlatos = cue("platos");
  const cEsponja = cue("esponja");

  const surfaceHit = f >= cPlatos - 2;
  const contamPct = Math.round(countTo(f, cCampy - 2, 40, 26, 94));

  return (
    <ImpactRig triggers={[cCampy - 2, cSalmo - 2, cPlatos - 2, cEsponja - 2]} intensity={10}>
      <TechLabBackdrop alert />

      <TechTelemetryStrip
        at={t0}
        label="PATÓGENOS ACTIVOS"
        verdict={surfaceHit ? "PLATOS INFECTADOS" : "CAMPYLOBACTER"}
        pct={contamPct}
        status="warn"
        icon="droplet"
      />

      <AtomHybridStage
        srcA="chick-03.jpg"
        srcB="chick-10.jpg"
        at={t0 + 2}
        atomAt={cSalmo - 2}
        splitAt={cPlatos - 2}
        climaxAt={cEsponja - 2}
        punches={[cCampy - 2, cPlatos - 2, cEsponja - 2]}
        accentA={TECH.amber}
        accentAtom={TECH.crimson}
        accentB={TECH.crimson}
        vfx={<WaterCorrosionOverlay active mode="starch" />}
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
            color: "#FDE047",
            zIndex: 15,
          }}
        >
          🦠 CAMPYLOBACTER + SALMONELLA
        </div>

        <KineticStamp
          at={cPlatos - 2}
          text="🍽️ CAE EN TUS PLATOS Y ESPONJA"
          bg={TECH.crimson}
          ink="#FFFFFF"
          tilt={-2}
        />
      </AtomHybridStage>

      <ShockwaveBurst at={cPlatos - 2} x={540} y={840} color={TECH.crimson} size={265} />

      <AtomNeonDeck
        at={t0 + 5}
        tag="SUPERFICIES"
        title="Contaminación de Esponja y Vajilla"
        rightText={`${contamPct}% RIESGO`}
        accent={TECH.crimson}
        borderAccent={TECH.crimson}
      />
    </ImpactRig>
  );
};
