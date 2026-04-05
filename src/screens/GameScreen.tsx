import React from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GameCanvas } from "../game/components/GameCanvas";
import { HUD } from "../game/components/HUD";
import { OverlayMenu } from "../game/components/OverlayMenu";
import { useCarSprites } from "../game/hooks/useCarSprites";
import { useGameLoop } from "../game/hooks/useGameLoop";
import { useInput } from "../game/hooks/useInput";

export function GameScreen() {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const sprites = useCarSprites();
  const {
    panHandlers,
    consumeFrameInput,
  } = useInput();

  const { gameState, startGame } = useGameLoop({
    consumeInputFrame: consumeFrameInput,
  });

  const horizontalPadding = 12;
  const verticalPadding = 12;
  const availableWidth = screenWidth - horizontalPadding * 2;
  const availableHeight = screenHeight - insets.top - insets.bottom - verticalPadding * 2;
  const canvasHeight = Math.max(480, availableHeight);
  const canvasWidth = Math.max(280, availableWidth);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={[styles.gameArea, { height: canvasHeight }]}>
          {sprites ? (
            <GameCanvas state={gameState} sprites={sprites} width={canvasWidth} height={canvasHeight} />
          ) : (
            <View style={styles.canvasPlaceholder} />
          )}
          <View style={styles.touchLayer} {...panHandlers} />
          <HUD state={gameState} topInset={insets.top} bottomInset={insets.bottom} />
        </View>
        <OverlayMenu
          phase={sprites ? gameState.phase : "intro"}
          message={sprites ? gameState.message : "Loading car sprites..."}
          onPrimaryPress={() => {
            if (sprites) {
              startGame();
            }
          }}
        />
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
    gap: 10,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 16,
  },
  gameArea: {
    position: "relative",
    width: "100%",
    overflow: "hidden",
    borderRadius: 24,
    backgroundColor: "#102028",
  },
  canvasPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#102028",
  },
  touchLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
  },
});
