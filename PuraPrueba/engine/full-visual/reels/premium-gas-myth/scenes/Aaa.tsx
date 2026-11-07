// Escena 2 Híbrida V3 (PuraPrueba V2 + ATOM Prueba Dinamómetro AAA a 60fps): `aaa`, light
// "La Asociación Automovilística probó motores estándar en dinamómetro y demostró cero caballos extra y cero kilómetros adicionales por litro."
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
} from "./parts";

export const Aaa: React.FC = () => {
  const { f, theme, scene, cue } = useScene();
  const t0 = scene.from - LEAD;
  const cAuto = cue("Automovilística");
  const cDino = cue("dinamómetro");
  const cCero = cue("cero");
  const cLitro = cue("litro");

  const tested = f >= cCero - 2;
  const rpm = Math.round(countTo(f, t0 + 4, 34, 2200, 6200));

  return (
    <ImpactRig triggers={[cAuto, cDino - 2, cCero - 2, cLitro - 2]} intensity={10}>
      <TechLabBackdrop alert={!tested} emerald={tested} />

      <TechTelemetryStrip
        at={t0}
        label="DINAMÓMETRO AAA"
        verdict={tested ? "+0.0% POTENCIA" : `${rpm} RPM TEST`}
        pct={tested ? 100 : 68}
        status={tested ? "safe" : "warn"}
        icon="radar"
      />

      <AtomHybridStage
        srcA="gas-02.jpg"
        srcB="gas-09.jpg"
        at={t0 + 2}
        atomAt={cDino - 2}
        splitAt={cCero - 2}
        climaxAt={cLitro - 2}
        punches={[cAuto, cCero - 2, cLitro - 2]}
        accentA={TECH.cyan}
        accentAtom={TECH.emerald}
        accentB={TECH.emerald}
      >
        <div
          style={{
            position: "absolute",
            left: 16,
            top: 14,
            padding: "7px 16px",
            borderRadius: 14,
            background: "rgba(7, 11, 20, 0.92)",
            boxShadow: `inset 0 0 0 2.5px ${tested ? TECH.emerald : TECH.cyanBright}`,
            fontFamily: theme.font.mono,
            fontSize: 32,
            fontWeight: 900,
            color: tested ? TECH.emerald : TECH.cyanBright,
            zIndex: 15,
          }}
        >
          ⚙️ LABORATORIO AAA · REGULAR VS PREMIUM
        </div>

        <KineticStamp
          at={cCero - 2}
          text="📊 0 CABALLOS EXTRA · 0 KM/L EXTRA"
          bg={TECH.emerald}
          ink="#042217"
          tilt={-2}
        />
      </AtomHybridStage>

      <ShockwaveBurst at={cCero - 2} x={540} y={840} color={TECH.emerald} size={265} />

      <AtomNeonDeck
        at={t0 + 5}
        tag="DINAMÓMETRO"
        title="Potencia Real: 87 vs 95 Octanos"
        rightText="EMPATE 100%"
        accent="#059669"
        borderAccent={TECH.emerald}
      />
    </ImpactRig>
  );
};
