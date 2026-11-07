// Escena 3 Híbrida V3 (PuraPrueba V2 + ATOM Dilución del Plasma Sanguíneo sin Electrolitos a 60fps): `dilution`, light
// "Al entrar tanta agua junta sin electrolitos, el plasma sanguíneo se diluye de golpe y el cerebro cree que tienes exceso de líquido."
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

export const Dilution: React.FC = () => {
  const { f, theme, scene, cue } = useScene();
  const t0 = scene.from - LEAD;
  const cElectro = cue("electrolitos");
  const cSang = cue("sanguíneo");
  const cCerebro = cue("cerebro");
  const cExceso = cue("exceso");

  const diluted = f >= cCerebro - 2;
  const osm = Math.round(countTo(f, cElectro - 2, 38, 290, 268));

  return (
    <ImpactRig triggers={[cElectro - 2, cSang - 2, cCerebro - 2, cExceso - 2]} intensity={10}>
      <TechLabBackdrop alert={diluted} />

      <TechTelemetryStrip
        at={t0}
        label="PLASMA SANGUÍNEO"
        verdict={diluted ? "ALERTA EXCESO" : `${osm} MOSM/KG`}
        pct={Math.round(((295 - osm) / 30) * 100)}
        status="warn"
        icon="droplet"
      />

      <AtomHybridStage
        srcA="wat-03.jpg"
        srcB="wat-10.jpg"
        at={t0 + 2}
        atomAt={cSang - 2}
        splitAt={cCerebro - 2}
        climaxAt={cExceso - 2}
        punches={[cElectro - 2, cCerebro - 2, cExceso - 2]}
        accentA={TECH.amber}
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
            boxShadow: `inset 0 0 0 2.5px ${diluted ? TECH.crimson : TECH.amber}`,
            fontFamily: theme.font.mono,
            fontSize: 32,
            fontWeight: 900,
            color: "#FDE047",
            zIndex: 15,
          }}
        >
          🩸 CAÍDA DE OSMOLARIDAD EN SANGRE
        </div>

        <KineticStamp
          at={cCerebro - 2}
          text="🧠 EL CEREBRO DETECTA SOBRECARGA"
          bg={TECH.crimson}
          ink="#FFFFFF"
          tilt={-2}
        />
      </AtomHybridStage>

      <ShockwaveBurst at={cExceso - 2} x={540} y={840} color={TECH.amber} size={265} />

      <AtomNeonDeck
        at={t0 + 5}
        tag="HIPOTÁLAMO"
        title="Concentración de Sodio en Plasma"
        rightText="DILUCIÓN BRUSCA"
        accent={diluted ? TECH.crimson : "#D97706"}
        borderAccent={diluted ? TECH.crimson : TECH.amber}
      />
    </ImpactRig>
  );
};
