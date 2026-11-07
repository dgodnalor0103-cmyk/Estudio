// Escena 5 Híbrida V3 (PuraPrueba V2 + ATOM Aditivos Detergentes en Regular y Premium a 60fps): `detergents`, dark
// "Por ley técnica, tanto la gasolina Regular como la Premium del mismo grifo ya incluyen los mismos aditivos detergentes para inyectores."
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

export const Detergents: React.FC = () => {
  const { f, theme, scene, cue } = useScene();
  const t0 = scene.from - LEAD;
  const cTecnica = cue("técnica");
  const cRegular = cue("Regular");
  const cDetergentes = cue("detergentes");
  const cInyectores = cue("inyectores");

  const cleanOk = f >= cDetergentes - 2;
  const cleanPct = Math.round(countTo(f, cRegular - 2, 30, 65, 100));

  return (
    <ImpactRig triggers={[cTecnica - 2, cRegular - 2, cDetergentes - 2, cInyectores - 2]} intensity={12}>
      <TechLabBackdrop emerald={cleanOk} />

      <TechTelemetryStrip
        at={t0}
        label="LIMPIEZA INYECTORES"
        verdict={cleanOk ? "MISMOS ADITIVOS" : `NORMA ${cleanPct}%`}
        pct={cleanPct}
        status="safe"
        icon="droplet"
      />

      <AtomHybridStage
        srcA="gas-05.jpg"
        srcB="gas-12.jpg"
        at={t0 + 2}
        atomAt={cRegular - 2}
        splitAt={cDetergentes - 2}
        climaxAt={cInyectores - 2}
        punches={[cRegular - 2, cDetergentes - 2, cInyectores - 2]}
        accentA={TECH.cyanBright}
        accentAtom={TECH.emerald}
        accentB={TECH.emerald}
        vfx={<WaterCorrosionOverlay active mode="air" />}
      >
        <div
          style={{
            position: "absolute",
            left: 16,
            top: 14,
            padding: "7px 16px",
            borderRadius: 14,
            background: "rgba(7, 11, 20, 0.92)",
            boxShadow: `inset 0 0 0 2.5px ${TECH.emerald}`,
            fontFamily: theme.font.mono,
            fontSize: 32,
            fontWeight: 900,
            color: TECH.emerald,
            zIndex: 15,
          }}
        >
          🧪 NORMA OFICIAL · DETERGENTES IGUALES
        </div>

        <KineticStamp
          at={cDetergentes - 2}
          text="✓ REGULAR YA LIMPIA TUS INYECTORES"
          bg={TECH.emerald}
          ink="#042217"
          tilt={-2}
        />
      </AtomHybridStage>

      <ShockwaveBurst at={cDetergentes - 2} x={540} y={840} color={TECH.emerald} size={290} />

      <AtomNeonDeck
        at={t0 + 4}
        tag="ADITIVOS"
        title="Agentes Limpiadores por Galón"
        rightText="100% IDÉNTICOS"
        accent={TECH.emerald}
        borderAccent={TECH.emerald}
      />
    </ImpactRig>
  );
};
