import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { COLORS } from "../constants/colors";
import type { GameState } from "../types";

interface MeterProps {
  label: string;
  value: number;
  color: string;
}

function Meter({ label, value, color }: MeterProps) {
  return (
    <View style={styles.meterWrap}>
      <Text style={styles.meterLabel}>
        {label} {Math.round(value)}%
      </Text>
      <View style={styles.meterTrack}>
        <View style={[styles.meterFill, { width: `${value}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

interface HUDProps {
  state: GameState;
}

export function HUD({ state }: HUDProps) {
  const ecoActive = state.player.hybridMode === "ECO";

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.meters}>
          <Meter label="Fuel" value={state.player.fuel} color={COLORS.fuel} />
          <Meter label="Battery" value={state.player.battery} color={COLORS.battery} />
        </View>
        <View style={styles.stats}>
          <Text style={styles.statText}>Speed {Math.round(state.player.speed)} km/h</Text>
          <Text style={styles.statText}>
            Distance {Math.round(Math.min(state.distance, state.targetDistance))} / {state.targetDistance} m
          </Text>
          <Text style={[styles.statText, ecoActive && styles.ecoText]}>{state.player.hybridMode} mode</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.hudCard,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.panelBorder,
    padding: 14,
    gap: 12,
  },
  row: {
    flexDirection: "row",
    gap: 16,
  },
  meters: {
    flex: 1,
    gap: 10,
  },
  stats: {
    flex: 1,
    justifyContent: "space-between",
  },
  meterWrap: {
    gap: 4,
  },
  meterLabel: {
    color: COLORS.hudText,
    fontSize: 13,
    fontWeight: "700",
  },
  meterTrack: {
    height: 12,
    borderRadius: 999,
    backgroundColor: "#20272B",
    overflow: "hidden",
  },
  meterFill: {
    height: "100%",
    borderRadius: 999,
  },
  statText: {
    color: COLORS.hudText,
    fontSize: 14,
    fontWeight: "700",
  },
  ecoText: {
    color: "#A7F2B8",
  },
});
