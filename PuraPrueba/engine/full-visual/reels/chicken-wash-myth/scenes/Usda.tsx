// Escena 2 Híbrida V3 (PuraPrueba V2 + ATOM Cámaras UV del USDA a 60fps): `usda`, light
// "El Departamento de Agricultura demostró con cámaras ultravioleta que el chorro rebota en la carne y lanza miles de microgotas invisibles."
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

export const Usda: React.FC = () => {
  const { f, theme, scene, cue } = useScene();
  const t0 = scene.from - LEAD;
  const cAgri = cue("Agricultura");
  const cUv = cue("ultravioleta");
  const cChorro = cue("chorro");
  const cMicro = cue("microgotas");

  const sprayMode = f >= cChorro - 2;
  const dropsCount = Math.round(countTo(f, cUv - 2, 34, 120, 2400));

  return (
    <ImpactRig triggers={[cAgri, cUv - 2, cChorro - 2, cMicro - 2]} intensity={10}>
      <TechLabBackdrop alert={sprayMode} />

      <TechTelemetryStrip
        at={t0}
        label="ESTUDIO USDA UV"
        verdict={sprayMode ? `${dropsCount} GOTAS` : "LUZ ULTRAVIOLETA"}
        pct={Math.min(100, Math.round((dropsCount / 2400) * 100))}
        status="warn"
        icon="radar"
      />

      <AtomHybridStage
        srcA="chick-02.jpg"
        srcB="chick-09.jpg"
        at={t0 + 2}
        atomAt={cUv - 2}
        splitAt={cChorro - 2}
        climaxAt={cMicro - 2}
        punches={[cAgri, cChorro - 2, cMicro - 2]}
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
            boxShadow: `inset 0 0 0 2.5px ${sprayMode ? TECH.crimson : TECH.cyanBright}`,
            fontFamily: theme.font.mono,
            fontSize: 32,
            fontWeight: 900,
            color: sprayMode ? "#FDA4AF" : TECH.cyanBright,
            zIndex: 15,
          }}
        >
          🔬 CÁMARA UV · REBOTE HIDRÁULICO
        </div>

        <KineticStamp
          at={cChorro - 2}
          text="💧 LANZA MILES DE MICROGOTAS"
          bg={TECH.crimson}
          ink="#FFFFFF"
          tilt={-2}
        />
      </AtomHybridStage>

      <ShockwaveBurst at={cMicro - 2} x={540} y={840} color={TECH.crimson} size={265} />

      <AtomNeonDeck
        at={t0 + 5}
        tag="LABORATORIO USDA"
        title="Rastreo UV de Salpicaduras"
        rightText={`${dropsCount} GOTAS/S`}
        accent={TECH.crimson}
        borderAccent={TECH.crimson}
      />
    </ImpactRig>
  );
};
