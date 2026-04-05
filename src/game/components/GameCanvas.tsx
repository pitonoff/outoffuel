import React, { memo, useMemo } from "react";
import { useWindowDimensions } from "react-native";
import {
  Canvas,
  Group,
  Rect,
  RoundedRect,
} from "@shopify/react-native-skia";

import { COLORS } from "../constants/colors";
import { HORIZON_RATIO, PLAYER_Y_RATIO, ROAD_WIDTH_RATIO } from "../constants/layout";
import type { GameState, TrafficCar } from "../types";

interface CarShapeProps {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

function CarShape({ x, y, width, height, color }: CarShapeProps) {
  return (
    <Group transform={[{ translateX: x - width / 2 }, { translateY: y - height / 2 }]}>
      <RoundedRect x={0} y={0} width={width} height={height} r={10} color={color} />
      <RoundedRect x={6} y={10} width={width - 12} height={height - 20} r={8} color={COLORS.window} />
      <RoundedRect x={6} y={16} width={width - 12} height={18} r={6} color={COLORS.playerCabin} />
      <RoundedRect x={6} y={height - 34} width={width - 12} height={18} r={6} color={COLORS.playerCabin} />
      <Rect x={4} y={4} width={8} height={10} color={COLORS.headlight} />
      <Rect x={width - 12} y={4} width={8} height={10} color={COLORS.headlight} />
      <Rect x={4} y={height - 14} width={8} height={10} color={COLORS.taillight} />
      <Rect x={width - 12} y={height - 14} width={8} height={10} color={COLORS.taillight} />
    </Group>
  );
}

function laneCenterX(roadX: number, roadWidth: number, lane: number) {
  return roadX + roadWidth * ((lane + 0.5) / 3);
}

function trafficToPixels(car: TrafficCar, roadX: number, roadWidth: number, height: number) {
  return {
    x: laneCenterX(roadX, roadWidth, car.lane),
    y: car.y * height,
    width: car.width,
    height: car.height,
    color: car.color,
  };
}

interface GameCanvasProps {
  state: GameState;
}

export const GameCanvas = memo(function GameCanvas({ state }: GameCanvasProps) {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const width = Math.min(windowWidth, 520);
  const height = Math.max(640, Math.min(windowHeight, 920));
  const roadWidth = width * ROAD_WIDTH_RATIO;
  const roadX = (width - roadWidth) / 2;
  const horizonY = height * HORIZON_RATIO;
  const playerY = height * PLAYER_Y_RATIO;
  const laneMarkers = useMemo(() => new Array(12).fill(0), []);
  const roadsideBlocks = useMemo(() => new Array(10).fill(0), []);
  const trafficPixels = state.traffic.map((car) => trafficToPixels(car, roadX, roadWidth, height));
  const playerX = laneCenterX(roadX, roadWidth, state.player.lateralOffset);
  const ecoZoneY = height - 260;
  const ecoZoneHeight = 80;

  return (
    <Canvas style={{ width, height, alignSelf: "center" }}>
      <Rect x={0} y={0} width={width} height={height} color={COLORS.backgroundTop} />
      <Rect x={0} y={horizonY} width={width} height={height - horizonY} color={COLORS.roadsideA} />

      {roadsideBlocks.map((_, index) => {
        const y = ((index * 110 + state.roadOffset * 70) % (height + 120)) - 100;
        const leftWidth = 34 + (index % 2) * 8;
        const rightWidth = 24 + ((index + 1) % 2) * 10;
        return (
          <Group key={`roadside-${index}`}>
            <RoundedRect x={20} y={y} width={leftWidth} height={68} r={10} color={COLORS.roadsideB} />
            <RoundedRect x={width - 56} y={y + 30} width={rightWidth} height={56} r={10} color={COLORS.roadsideB} />
          </Group>
        );
      })}

      <Rect x={roadX} y={0} width={roadWidth} height={height} color={COLORS.road} />
      <Rect x={roadX - 8} y={0} width={8} height={height} color={COLORS.shoulder} />
      <Rect x={roadX + roadWidth} y={0} width={8} height={height} color={COLORS.shoulder} />
      <Rect x={roadX} y={ecoZoneY} width={roadWidth} height={ecoZoneHeight} color={COLORS.ecoZone} />

      {laneMarkers.map((_, index) => {
        const y = ((index * 76 + state.roadOffset * 180) % (height + 120)) - 120;
        return (
          <Group key={`marker-${index}`}>
            <RoundedRect
              x={roadX + roadWidth / 3 - 2}
              y={y}
              width={4}
              height={36}
              r={2}
              color={COLORS.laneMarker}
            />
            <RoundedRect
              x={roadX + (roadWidth * 2) / 3 - 2}
              y={y}
              width={4}
              height={36}
              r={2}
              color={COLORS.laneMarker}
            />
          </Group>
        );
      })}

      {trafficPixels.map((car) => (
        <CarShape key={car.color + car.y + car.x} {...car} />
      ))}

      <CarShape x={playerX} y={playerY} width={state.player.width} height={state.player.height} color={COLORS.playerBody} />
    </Canvas>
  );
});
