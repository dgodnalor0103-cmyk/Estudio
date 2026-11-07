// Escena 2 Híbrida V3 (PuraPrueba V2 + ATOM Barorreceptores Garganta y Sangre a 60fps): `sensors`, light
// "Estudios de hidratación clínica demostraron que tragar medio litro en segundos engaña a los sensores de presión de tu garganta y sangre."
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

export const Sensors: React.FC = () => {
  const { f, theme, scene, cue } = useScene();
  const t0 = scene.from - LEAD;
  const cHidra = cue("hidratación");
  const cSegundos = cue("segundos");
  const cSensores = cue("sensores");
  const cSangre = cue("sangre");

  const alertSensor = f >= cSensores - 2;
  const mlBolus = Math.round(countTo(f, cSegundos - 2, 32, 100, 500));

  return (
    <ImpactRig triggers={[cHidra, cSegundos - 2, cSensores - 2, cSangre - 2]} intensity={10}>
      <TechLabBackdrop alert={alertSensor} />

      <TechTelemetryStrip
        at={t0}
        label="SENSORES DE PRESIÓN"
        verdict={alertSensor ? "FALSA ALARMA" : `${mlBolus} ML BOLO`}
        pct={Math.round((mlBolus / 500) * 100)}
        status="warn"
        icon="radar"
      />

      <AtomHybridStage
        srcA="wat-02.jpg"
        srcB="wat-09.jpg"
        at={t0 + 2}
        atomAt={cSegundos - 2}
        splitAt={cSensores - 2}
        climaxAt={cSangre - 2}
        punches={[cHidra, cSensores - 2, cSangre - 2]}
        accentA={TECH.cyan}
        accentAtom={TECH.amber}
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
            boxShadow: `inset 0 0 0 2.5px ${alertSensor ? TECH.crimson : TECH.cyanBright}`,
            fontFamily: theme.font.mono,
            fontSize: 32,
            fontWeight: 900,
            color: alertSensor ? "#FDA4AF" : TECH.cyanBright,
            zIndex: 15,
          }}
        >
          🧪 BOLO RÁPIDO · +500 ML EN SEGUNDOS
        </div>

        <KineticStamp
          at={cSensores - 2}
          text="⚠️ ENGAÑA A TUS RECEPTORES DE SED"
          bg={TECH.crimson}
          ink="#FFFFFF"
          tilt={-2}
        />
      </AtomHybridStage>

      <ShockwaveBurst at={cSangre - 2} x={540} y={840} color={TECH.crimson} size={265} />

      <AtomNeonDeck
        at={t0 + 5}
        tag="CLÍNICA"
        title="Señal de Barorreceptores Orolaríngeos"
        rightText="SED APAGADA"
        accent={TECH.crimson}
        borderAccent={TECH.crimson}
      />
    </ImpactRig>
  );
};
