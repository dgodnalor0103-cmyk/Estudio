// Escena 1 Híbrida V3 (PuraPrueba V2 + ATOM Gasolina Premium en Auto Normal & 18% Dinero Tirado a 60fps): `hook`, dark
// "Ponerle gasolina Premium a un auto normal no limpia el motor ni da más potencia, tiras un 18% de dinero."
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
  ThermalEmbersOverlay,
} from "./parts";

export const Hook: React.FC = () => {
  const { f, theme, scene, cue } = useScene();
  const t0 = scene.from - LEAD;
  const cPremium = cue("Premium");
  const cNo = cue("no");
  const cPotencia = cue("potencia");
  const c18 = cue("18%");

  const strikeW = prog(f, cNo - 2, 10, ease.out) * 100;
  const alertMode = f >= cPotencia - 2;
  const wastePct = alertMode
    ? Math.round(countTo(f, cPotencia - 2, 22, 4, 18))
    : Math.round(countTo(f, t0 + 3, 24, 0, 4));

  return (
    <ImpactRig triggers={[cPremium, cNo - 2, cPotencia - 2, c18 - 2]} intensity={12}>
      <TechLabBackdrop alert={alertMode} emerald={!alertMode && f >= cNo - 2} />

      <TechTelemetryStrip
        at={t0}
        label={alertMode ? "DINERO QUEMADO" : "GASOLINA PREMIUM"}
        verdict={alertMode ? "-18% TU DINERO" : f >= cNo - 2 ? "MITO FALSO" : "MOTOR NORMAL"}
        pct={alertMode ? 82 : 100}
        status={alertMode ? "warn" : "myth"}
        icon="cpu"
      />

      <AtomHybridStage
        srcA="gas-01.jpg"
        srcB="gas-08.jpg"
        at={t0 + 2}
        atomAt={cNo - 2}
        splitAt={cPotencia - 2}
        climaxAt={c18 - 2}
        punches={[cPremium, cNo - 2, c18 - 2]}
        accentA={TECH.cyanBright}
        accentAtom={TECH.crimson}
        accentB={TECH.crimson}
        vfx={<ThermalEmbersOverlay active={alertMode} />}
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
              {alertMode ? `GASTAS +${wastePct}% POR TANQUE` : "MÁS POTENCIA Y LIMPIEZA"}
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
            text="✗ CERO CABALLOS EXTRA EN TU AUTO"
            bg={TECH.amber}
            ink="#041622"
            tilt={-2.2}
          />
        ) : (
          <KineticStamp
            at={cPotencia - 2}
            text="💸 TIRAS HASTA UN 18% DE DINERO"
            bg={TECH.crimson}
            ink="#FFFFFF"
            tilt={-2}
          />
        )}
      </AtomHybridStage>

      <ShockwaveBurst at={cNo - 2} x={430} y={840} color={TECH.amber} size={235} />
      <ShockwaveBurst at={c18 - 2} x={540} y={840} color={TECH.crimson} size={295} />

      <AtomNeonDeck
        at={t0 + 4}
        tag="COSTO EXTRA"
        title="Sobrecosto por Litro en Auto Estándar"
        rightText={f >= c18 - 2 ? "-18% DINERO" : "0% MEJORA"}
        accent={TECH.crimson}
        borderAccent={TECH.crimson}
      />
    </ImpactRig>
  );
};
