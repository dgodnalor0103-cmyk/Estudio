// Escena 1 Híbrida V3 (PuraPrueba V2 + ATOM Pollo Crudo en Fregadero & Radio 90cm a 60fps): `hook`, dark
// "Lavar el pollo crudo en el fregadero no elimina bacterias, las dispersa hasta 90 centímetros por tu cocina."
import React from "react";
import { countTo, ease, prog, useScene } from "../../../src/engine";
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

export const Hook: React.FC = () => {
  const { f, theme, scene, cue } = useScene();
  const t0 = scene.from - LEAD;
  const cPollo = cue("pollo");
  const cNo = cue("no");
  const cDispersa = cue("dispersa");
  const c90 = cue("90");

  const strikeW = prog(f, cNo - 2, 10, ease.out) * 100;
  const alertMode = f >= cDispersa - 2;
  const radCm = alertMode
    ? Math.round(countTo(f, cDispersa - 2, 22, 15, 90))
    : Math.round(countTo(f, t0 + 3, 24, 0, 15));

  return (
    <ImpactRig triggers={[cPollo, cNo - 2, cDispersa - 2, c90 - 2]} intensity={12}>
      <TechLabBackdrop alert={alertMode} emerald={!alertMode && f >= cNo - 2} />

      <TechTelemetryStrip
        at={t0}
        label={alertMode ? "RADIO DE CONTAGIO" : "LAVAR POLLO CRUDO"}
        verdict={alertMode ? "90 CM BIOAEROSOL" : f >= cNo - 2 ? "MITO PELIGROSO" : "FREGADERO"}
        pct={Math.min(100, Math.round((radCm / 90) * 100))}
        status={alertMode ? "warn" : "myth"}
        icon="droplet"
      />

      <AtomHybridStage
        srcA="chick-01.jpg"
        srcB="chick-08.jpg"
        at={t0 + 2}
        atomAt={cNo - 2}
        splitAt={cDispersa - 2}
        climaxAt={c90 - 2}
        punches={[cPollo, cNo - 2, c90 - 2]}
        accentA={TECH.cyanBright}
        accentAtom={TECH.crimson}
        accentB={TECH.crimson}
        vfx={<WaterCorrosionOverlay active mode={alertMode ? "starch" : "water"} />}
      >
        <div
          style={{
            position: "absolute",
            left: 16,
            top: 14,
            padding: "7px 16px",
            borderRadius: 14,
            background: "rgba(7, 11, 20, 0.92)",
            boxShadow: `inset 0 0 0 2.5px ${f >= cNo - 2 ? TECH.crimson : TECH.cyanBright}`,
            display: "flex",
            alignItems: "center",
            zIndex: 15,
          }}
        >
          <div style={{ position: "relative" }}>
            <span
              style={{
                fontFamily: theme.font.mono,
                fontSize: 32,
                fontWeight: 900,
                color: f >= cNo - 2 ? "#FDA4AF" : "#FFFFFF",
              }}
            >
              {alertMode ? "SALPICADURA DE 90 CM" : "EL AGUA LO LIMPIA"}
            </span>
            {!alertMode && (
              <div
                style={{
                  position: "absolute",
                  left: -4,
                  top: "51%",
                  width: `${strikeW.toFixed(1)}%`,
                  height: 6,
                  borderRadius: 99,
                  background: TECH.crimson,
                  boxShadow: `0 0 12px ${TECH.crimson}`,
                }}
              />
            )}
          </div>
        </div>

        {!alertMode ? (
          <KineticStamp
            at={cNo - 2}
            text="✗ ERROR GRAVE · NO ELIMINA NADA"
            bg={TECH.amber}
            ink="#041622"
            tilt={-2.2}
          />
        ) : (
          <KineticStamp
            at={cDispersa - 2}
            text="☣️ CONTAMINA HASTA A 90 CM"
            bg={TECH.crimson}
            ink="#FFFFFF"
            tilt={-2}
          />
        )}
      </AtomHybridStage>

      <ShockwaveBurst at={cNo - 2} x={430} y={840} color={TECH.amber} size={235} />
      <ShockwaveBurst at={c90 - 2} x={540} y={840} color={TECH.crimson} size={295} />

      <AtomNeonDeck
        at={t0 + 4}
        tag="BIOAEROSOL"
        title="Alcance de Gotas en tu Cocina"
        rightText={f >= c90 - 2 ? "90 CM RADIO" : "ALERTA USDA"}
        accent={TECH.crimson}
        borderAccent={TECH.crimson}
      />
    </ImpactRig>
  );
};
