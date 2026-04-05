import React, { memo, useMemo } from "react";
import {
  Canvas,
  Group,
  Image,
  Rect,
  RoundedRect,
  type SkImage,
} from "@shopify/react-native-skia";

import { COLORS } from "../constants/colors";
import { HORIZON_RATIO, PLAYER_Y_RATIO, ROAD_WIDTH_RATIO } from "../constants/layout";
import type { GameState, TrafficCar } from "../types";
import { getTrafficSprite, type CarSpriteSet } from "../hooks/useCarSprites";

interface CarSpriteProps {
  sprite: SkImage;
  x: number;
  y: number;
  width: number;
  height: number;
}

function CarSprite({ sprite, x, y, width, height }: CarSpriteProps) {
  const aspectRatio = sprite.width() / sprite.height();
  const targetAspectRatio = width / height;
  const drawWidth = aspectRatio > targetAspectRatio ? width : height * aspectRatio;
  const drawHeight = aspectRatio > targetAspectRatio ? width / aspectRatio : height;

  return (
    <Image
      image={sprite}
      x={x - drawWidth / 2}
      y={y - drawHeight / 2}
      width={drawWidth}
      height={drawHeight}
      fit="contain"
      sampling={{ B: 1, C: 1 }}
    />
  );
}

function laneCenterX(roadX: number, roadWidth: number, lane: number) {
  return roadX + roadWidth * ((lane + 0.5) / 3);
}

function trafficToPixels(car: TrafficCar, roadX: number, roadWidth: number, height: number) {
  return {
    id: car.id,
    spriteId: car.spriteId,
    x: laneCenterX(roadX, roadWidth, car.lane),
    y: car.y * height,
    width: car.width,
    height: car.height,
  };
}

interface GameCanvasProps {
  state: GameState;
  sprites: CarSpriteSet;
  width: number;
  height: number;
}

export const GameCanvas = memo(function GameCanvas({ state, sprites, width, height }: GameCanvasProps) {
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
        <CarSprite
          key={car.id}
          sprite={getTrafficSprite(sprites, car.spriteId)}
          x={car.x}
          y={car.y}
          width={car.width}
          height={car.height}
        />
      ))}

      <CarSprite sprite={sprites.shared} x={playerX} y={playerY} width={state.player.width} height={state.player.height} />
    </Canvas>
  );
});
