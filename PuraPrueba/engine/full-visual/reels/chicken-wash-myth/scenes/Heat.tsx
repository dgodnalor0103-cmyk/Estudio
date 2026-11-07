// Escena 5 Híbrida V3 (PuraPrueba V2 + ATOM Cocción a 74 °C Destrucción Total a 60fps): `heat`, dark
// "Lo único que destruye el cien por ciento de los patógenos en segundos es cocinar el centro de la pieza a 74 grados."
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

export const Heat: React.FC = () => {
  const { f, theme, scene, cue } = useScene();
  const t0 = scene.from - LEAD;
  const cDestruye = cue("destruye");
  const cCien = cue("cien");
  const cCocinar = cue("cocinar");
  const c74 = cue("74");

  const safeTemp = f >= c74 - 3;
  const degC = Math.round(countTo(f, cDestruye - 2, 34, 22, 74));

  return (
    <ImpactRig triggers={[cDestruye - 2, cCien - 2, cCocinar - 2, c74 - 2]} intensity={12}>
      <TechLabBackdrop alert={!safeTemp} emerald={safeTemp} />

      <TechTelemetryStrip
        at={t0}
        label="TEMPERATURA INTERNA"
        verdict={safeTemp ? "100% ESTÉRIL" : `${degC} °C COCCIÓN`}
        pct={Math.round((degC / 74) * 100)}
        status={safeTemp ? "safe" : "warn"}
        icon="cpu"
      />

      <AtomHybridStage
        srcA="chick-05.jpg"
        srcB="chick-12.jpg"
        at={t0 + 2}
        atomAt={cCien - 2}
        splitAt={cCocinar - 2}
        climaxAt={c74 - 2}
        punches={[cDestruye - 2, cCocinar - 2, c74 - 2]}
        accentA={TECH.amber}
        accentAtom={TECH.emerald}
        accentB={TECH.emerald}
        vfx={<ThermalEmbersOverlay active />}
      >
        <div
          style={{
            position: "absolute",
            left: 16,
            top: 14,
            padding: "7px 16px",
            borderRadius: 14,
            background: "rgba(7, 11, 20, 0.92)",
            boxShadow: `inset 0 0 0 2.5px ${safeTemp ? TECH.emerald : TECH.amber}`,
            fontFamily: theme.font.mono,
            fontSize: 32,
            fontWeight: 900,
            color: safeTemp ? TECH.emerald : "#FDE047",
            zIndex: 15,
          }}
        >
          🌡️ {degC} °C (165 °F) · CORAZÓN DE LA PIEZA
        </div>

        <KineticStamp
          at={c74 - 3}
          text="🔥 74 °C ELIMINA EL 100% EN SEGUNDOS"
          bg={TECH.emerald}
          ink="#042217"
          tilt={-2}
        />
      </AtomHybridStage>

      <ShockwaveBurst at={c74 - 2} x={540} y={840} color={TECH.emerald} size={295} />

      <AtomNeonDeck
        at={t0 + 4}
        tag="TERMODINÁMICA"
        title="Eliminación Térmica a 74 °C"
        rightText={safeTemp ? "100% SEGURO" : `${degC} °C`}
        accent={safeTemp ? TECH.emerald : TECH.amber}
        borderAccent={safeTemp ? TECH.emerald : TECH.amber}
      />
    </ImpactRig>
  );
};
