import React from "react";
import { StyleSheet, Text, View } from "react-native";

import type { GameState } from "../types";

interface HUDProps {
  state: GameState;
  topInset?: number;
  bottomInset?: number;
}

interface RailMeterProps {
  label: string;
  value: number;
  accentColor: string;
  align: "left" | "right";
}

function RailMeter({ label, value, accentColor, align }: RailMeterProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <View style={[styles.railWrap, align === "left" ? styles.railLeft : styles.railRight]}>
      <Text style={styles.railLabel}>{label}</Text>
      <View style={styles.railTrack}>
        <View style={[styles.railFill, { height: `${clamped}%`, backgroundColor: accentColor }]} />
      </View>
      <Text style={styles.railValue}>{Math.round(clamped)}</Text>
    </View>
  );
}

function modeStyle(mode: GameState["player"]["hybridMode"]) {
  if (mode === "ECO") {
    return styles.modeEco;
  }

  if (mode === "POWER") {
    return styles.modePower;
  }

  return styles.modeCharge;
}

export function HUD({ state, topInset = 0, bottomInset = 0 }: HUDProps) {
  const remaining = Math.max(0, Math.round(state.targetDistance - state.distance));
  const progress = Math.max(0, Math.min(100, (state.distance / state.targetDistance) * 100));

  return (
    <View pointerEvents="none" style={styles.overlay}>
      <View style={[styles.topBar, { top: Math.max(2, topInset) }]}>
        <View style={styles.topPill}>
          <Text style={styles.topLabel}>MODE</Text>
          <Text style={[styles.topValue, modeStyle(state.player.hybridMode)]}>{state.player.hybridMode}</Text>
        </View>

        <View style={styles.speedBlock}>
          <Text style={styles.speedValue}>{Math.round(state.player.speed)}</Text>
          <Text style={styles.speedUnit}>km/h</Text>
        </View>

        <View style={styles.topPill}>
          <Text style={styles.topLabel}>TO GAS</Text>
          <Text style={styles.topValue}>{remaining}m</Text>
        </View>
      </View>

      <RailMeter label="BAT" value={state.player.battery} accentColor="#61D8A4" align="left" />
      <RailMeter label="FUEL" value={state.player.fuel} accentColor="#F0B05D" align="right" />

      {state.regenActive ? (
        <View style={styles.regenBadge}>
          <Text style={styles.regenText}>REGEN</Text>
        </View>
      ) : null}

      <View style={[styles.bottomBar, { bottom: Math.max(10, bottomInset + 4) }]}>
        <View style={styles.progressCard}>
          <View style={styles.bottomRow}>
            <Text style={styles.bottomText}>{Math.round(state.distance)} / {state.targetDistance}m</Text>
            <Text style={styles.bottomText}>Eco {Math.round(state.ecoMeter * 100)}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${Math.max(4, progress)}%` }]} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  topBar: {
    position: "absolute",
    left: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topPill: {
    minWidth: 72,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: "rgba(7, 16, 19, 0.52)",
    borderWidth: 1,
    borderColor: "rgba(163, 242, 217, 0.12)",
  },
  topLabel: {
    color: "#85A29C",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1,
  },
  topValue: {
    color: "#D8FFF1",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 1,
  },
  modeEco: {
    color: "#A8F3B9",
  },
  modePower: {
    color: "#F6CA7C",
  },
  modeCharge: {
    color: "#8DD7FF",
  },
  speedBlock: {
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 18,
    backgroundColor: "rgba(7, 16, 19, 0.56)",
    borderWidth: 1,
    borderColor: "rgba(163, 242, 217, 0.12)",
  },
  speedValue: {
    color: "#CBFFF1",
    fontSize: 30,
    lineHeight: 32,
    fontWeight: "500",
  },
  speedUnit: {
    color: "#85A29C",
    fontSize: 9,
    fontWeight: "700",
  },
  railWrap: {
    position: "absolute",
    top: 82,
    width: 34,
    height: 140,
    alignItems: "center",
    borderRadius: 16,
    backgroundColor: "rgba(7, 16, 19, 0.48)",
    borderWidth: 1,
    borderColor: "rgba(163, 242, 217, 0.1)",
    paddingVertical: 8,
  },
  railLeft: {
    left: 8,
  },
  railRight: {
    right: 8,
  },
  railLabel: {
    color: "#85A29C",
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  railTrack: {
    width: 10,
    flex: 1,
    marginVertical: 6,
    justifyContent: "flex-end",
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: "rgba(20, 37, 34, 0.95)",
  },
  railFill: {
    width: "100%",
    minHeight: 5,
    borderRadius: 999,
  },
  railValue: {
    color: "#DDFCF1",
    fontSize: 10,
    fontWeight: "700",
  },
  regenBadge: {
    position: "absolute",
    top: 66,
    alignSelf: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(32, 71, 45, 0.82)",
    borderWidth: 1,
    borderColor: "rgba(168, 243, 185, 0.3)",
  },
  regenText: {
    color: "#CFFFF0",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },
  bottomBar: {
    position: "absolute",
    left: 12,
    right: 12,
  },
  progressCard: {
    borderRadius: 16,
    backgroundColor: "rgba(7, 16, 19, 0.62)",
    borderWidth: 1,
    borderColor: "rgba(163, 242, 217, 0.12)",
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 9,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 7,
  },
  bottomText: {
    color: "#D8FFF1",
    fontSize: 11,
    fontWeight: "700",
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: "rgba(18, 35, 33, 0.95)",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#86F0C4",
  },
});
