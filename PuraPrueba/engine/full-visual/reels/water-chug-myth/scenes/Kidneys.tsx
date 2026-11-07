// Escena 4 Híbrida V3 (PuraPrueba V2 + ATOM Riñones Apagan Hormona ADH & Diuresis en <2h a 60fps): `kidneys`, dark
// "Tus riñones apagan la hormona antidiurética de inmediato y expulsan casi toda esa agua hacia la vejiga en menos de dos horas."
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

export const Kidneys: React.FC = () => {
  const { f, theme, scene, cue } = useScene();
  const t0 = scene.from - LEAD;
  const cRinones = cue("riñones");
  const cAnti = cue("antidiurética");
  const cVejiga = cue("vejiga");
  const cDos = cue("dos");

  const flushed = f >= cVejiga - 2;
  const lostPct = Math.round(countTo(f, t0 + 4, 42, 18, 72));

  return (
    <ImpactRig triggers={[cRinones - 2, cAnti - 2, cVejiga - 2, cDos - 2]} intensity={11}>
      <TechLabBackdrop alert />

      <TechTelemetryStrip
        at={t0}
        label="FILTRADO RENAL"
        verdict={flushed ? `${lostPct}% EXPULSADO` : "ADH APAGADA"}
        pct={lostPct}
        status="warn"
        icon="droplet"
      />

      <AtomHybridStage
        srcA="wat-04.jpg"
        srcB="wat-11.jpg"
        at={t0 + 2}
        atomAt={cAnti - 2}
        splitAt={cVejiga - 2}
        climaxAt={cDos - 2}
        punches={[cAnti - 2, cVejiga - 2, cDos - 2]}
        accentA={TECH.amber}
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
          🚫 HORMONA ADH = APAGADA AL INSTANTE
        </div>

        <KineticStamp
          at={cVejiga - 2}
          text="⏳ PASA DIRECTO A LA VEJIGA EN <2H"
          bg={TECH.crimson}
          ink="#FFFFFF"
          tilt={-2}
        />
      </AtomHybridStage>

      <ShockwaveBurst at={cVejiga - 2} x={540} y={840} color={TECH.crimson} size={275} />

      <AtomNeonDeck
        at={t0 + 4}
        tag="DIURESIS"
        title="Volumen Expulsado por los Riñones"
        rightText={`${lostPct}% PERDIDO`}
        accent={TECH.crimson}
        borderAccent={TECH.crimson}
      />
    </ImpactRig>
  );
};
