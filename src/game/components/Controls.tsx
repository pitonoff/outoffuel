import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";

import { COLORS } from "../constants/colors";

interface ControlsProps {
  swipeGesture: React.ComponentProps<typeof GestureDetector>["gesture"];
  onAcceleratePressIn: () => void;
  onAcceleratePressOut: () => void;
  onBrakePressIn: () => void;
  onBrakePressOut: () => void;
}

export function Controls({
  swipeGesture,
  onAcceleratePressIn,
  onAcceleratePressOut,
  onBrakePressIn,
  onBrakePressOut,
}: ControlsProps) {
  return (
    <GestureDetector gesture={swipeGesture}>
      <View style={styles.wrap}>
        <View style={styles.swipeZone}>
          <Text style={styles.swipeTitle}>Swipe</Text>
          <Text style={styles.swipeCopy}>Left / Right steer</Text>
          <Text style={styles.swipeCopy}>Up / Down pulse</Text>
        </View>
        <View style={styles.buttons}>
          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.buttonActive]}
            onPressIn={onBrakePressIn}
            onPressOut={onBrakePressOut}
          >
            <Text style={styles.buttonText}>Brake</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.button, styles.buttonAccent, pressed && styles.buttonActive]}
            onPressIn={onAcceleratePressIn}
            onPressOut={onAcceleratePressOut}
          >
            <Text style={styles.buttonText}>Accelerate</Text>
          </Pressable>
        </View>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    gap: 12,
  },
  swipeZone: {
    flex: 1,
    minHeight: 96,
    borderRadius: 22,
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.panelBorder,
    padding: 16,
    justifyContent: "center",
  },
  swipeTitle: {
    color: COLORS.hudText,
    fontWeight: "800",
    fontSize: 18,
    marginBottom: 6,
  },
  swipeCopy: {
    color: COLORS.hudMuted,
    fontSize: 13,
  },
  buttons: {
    width: 150,
    gap: 12,
  },
  button: {
    flex: 1,
    minHeight: 42,
    borderRadius: 18,
    backgroundColor: COLORS.button,
    borderWidth: 1,
    borderColor: COLORS.panelBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonAccent: {
    backgroundColor: "#223844",
  },
  buttonActive: {
    backgroundColor: COLORS.buttonActive,
  },
  buttonText: {
    color: COLORS.hudText,
    fontSize: 15,
    fontWeight: "800",
  },
});
