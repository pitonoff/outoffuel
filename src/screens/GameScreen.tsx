import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { GameCanvas } from "../game/components/GameCanvas";
import { Controls } from "../game/components/Controls";
import { HUD } from "../game/components/HUD";
import { OverlayMenu } from "../game/components/OverlayMenu";
import { useGameLoop } from "../game/hooks/useGameLoop";
import { useInput } from "../game/hooks/useInput";

export function GameScreen() {
  const {
    swipeGesture,
    setAccelerating,
    setBraking,
    consumeFrameInput,
  } = useInput();

  const { gameState, startGame } = useGameLoop({
    consumeInputFrame: consumeFrameInput,
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <HUD state={gameState} />
        <GameCanvas state={gameState} />
        <Controls
          swipeGesture={swipeGesture}
          onAcceleratePressIn={() => setAccelerating(true)}
          onAcceleratePressOut={() => setAccelerating(false)}
          onBrakePressIn={() => setBraking(true)}
          onBrakePressOut={() => setBraking(false)}
        />
        <OverlayMenu phase={gameState.phase} message={gameState.message} onPrimaryPress={startGame} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#081014",
  },
  container: {
    flex: 1,
    gap: 12,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 16,
  },
});
