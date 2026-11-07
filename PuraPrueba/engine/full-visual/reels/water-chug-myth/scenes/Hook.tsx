// Escena 1 Híbrida V3 (PuraPrueba V2 + ATOM Beber 2L de Golpe & Pérdida de Minerales a 60fps): `hook`, dark
// "Beber 2 litros de agua de golpe no hidrata más tu cuerpo, este error hace que pierdas minerales clave."
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
  const c2 = cue("2");
  const cNo = cue("no");
  const cError = cue("error");
  const cMinerales = cue("minerales");

  const strikeW = prog(f, cNo - 2, 10, ease.out) * 100;
  const alertMode = f >= cError - 2;
  const absPct = alertMode
    ? Math.round(countTo(f, cError - 2, 22, 85, 32))
    : Math.round(countTo(f, t0 + 3, 24, 100, 85));

  return (
    <ImpactRig triggers={[c2, cNo - 2, cError - 2, cMinerales - 2]} intensity={12}>
      <TechLabBackdrop alert={alertMode} emerald={!alertMode && f >= cNo - 2} />

      <TechTelemetryStrip
        at={t0}
        label={alertMode ? "LAVADO MINERAL" : "2 LITROS DE GOLPE"}
        verdict={alertMode ? "PIERDES SODIO" : f >= cNo - 2 ? "MITO FALSO" : "HIDRATACIÓN"}
        pct={absPct}
        status={alertMode ? "warn" : "myth"}
        icon="droplet"
      />

      <AtomHybridStage
        srcA="wat-01.jpg"
        srcB="wat-08.jpg"
        at={t0 + 2}
        atomAt={cNo - 2}
        splitAt={cError - 2}
        climaxAt={cMinerales - 2}
        punches={[c2, cNo - 2, cMinerales - 2]}
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
              {alertMode ? "ABSORCIÓN REAL: SOLO 32%" : "2L DE GOLPE = HIDRATADO"}
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
            text="✗ NO HIDRATA MÁS TUS CÉLULAS"
            bg={TECH.amber}
            ink="#041622"
            tilt={-2.2}
          />
        ) : (
          <KineticStamp
            at={cError - 2}
            text="⚠️ EXPULSAS AGUA Y MINERALES CLAVE"
            bg={TECH.crimson}
            ink="#FFFFFF"
            tilt={-2}
          />
        )}
      </AtomHybridStage>

      <ShockwaveBurst at={cNo - 2} x={430} y={840} color={TECH.amber} size={235} />
      <ShockwaveBurst at={cMinerales - 2} x={540} y={840} color={TECH.crimson} size={295} />

      <AtomNeonDeck
        at={t0 + 4}
        tag="FISIOLOGÍA"
        title="Retención Celular: Golpe vs Sorbos"
        rightText={f >= cMinerales - 2 ? "PIERDES SALES" : "32% RETENIDO"}
        accent={TECH.crimson}
        borderAccent={TECH.crimson}
      />
    </ImpactRig>
  );
};
