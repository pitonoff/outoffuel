import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { COLORS } from "../constants/colors";
import type { GamePhase } from "../types";

interface OverlayMenuProps {
  phase: GamePhase;
  message: string;
  onPrimaryPress: () => void;
}

const TITLES: Record<GamePhase, string> = {
  intro: "Out of Fuel",
  playing: "",
  win: "Fuel Up",
  lose: "Trip Over",
};

export function OverlayMenu({ phase, message, onPrimaryPress }: OverlayMenuProps) {
  if (phase === "playing") {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <Text style={styles.title}>{TITLES[phase]}</Text>
        <Text style={styles.message}>{message}</Text>
        <Text style={styles.help}>Swipe left or right to change lanes. Hold pedals to accelerate or brake.</Text>
        <Pressable onPress={onPrimaryPress} style={({ pressed }) => [styles.button, pressed && styles.buttonActive]}>
          <Text style={styles.buttonText}>{phase === "intro" ? "Start Drive" : "Drive Again"}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.overlay,
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.panelBorder,
    borderRadius: 24,
    padding: 20,
    gap: 12,
  },
  title: {
    color: COLORS.hudText,
    fontSize: 32,
    fontWeight: "800",
  },
  message: {
    color: COLORS.hudText,
    fontSize: 16,
  },
  help: {
    color: COLORS.hudMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.button,
    minHeight: 52,
    borderRadius: 16,
    marginTop: 4,
  },
  buttonActive: {
    backgroundColor: COLORS.buttonActive,
  },
  buttonText: {
    color: COLORS.hudText,
    fontSize: 16,
    fontWeight: "800",
  },
});
