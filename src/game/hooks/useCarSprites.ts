import { useMemo } from "react";
import { useImage, type SkImage } from "@shopify/react-native-skia";

import { CAR_SPRITES } from "../constants/assets";
import type { CarSpriteId } from "../types";

export interface CarSpriteSet {
  isReady: boolean;
  shared: SkImage;
}

export function useCarSprites(): CarSpriteSet | null {
  const shared = useImage(CAR_SPRITES.shared);

  return useMemo(() => {
    if (!shared) {
      return null;
    }

    return {
      isReady: true,
      shared,
    };
  }, [shared]);
}

export function getTrafficSprite(sprites: CarSpriteSet, _spriteId: CarSpriteId) {
  return sprites.shared;
}
