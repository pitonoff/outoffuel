import { useCallback, useEffect, useMemo, useRef } from "react";
import { Platform } from "react-native";
import { Gesture } from "react-native-gesture-handler";

import { DEFAULT_INPUT_STATE } from "../constants/game";
import type { InputState, LaneChange } from "../types";

const SWIPE_THRESHOLD = 24;
const SWIPE_PULSE_SECONDS = 0.3;

function createMutableInputState(): InputState {
  return {
    ...DEFAULT_INPUT_STATE,
  };
}

export function useInput() {
  const inputRef = useRef<InputState>(createMutableInputState());

  const setLaneChange = useCallback((direction: LaneChange) => {
    inputRef.current.laneChangeIntent = direction;
  }, []);

  const pulseAccelerate = useCallback(() => {
    inputRef.current.acceleratePulseTime = SWIPE_PULSE_SECONDS;
  }, []);

  const pulseBrake = useCallback(() => {
    inputRef.current.brakePulseTime = SWIPE_PULSE_SECONDS;
  }, []);

  const setAccelerating = useCallback((pressed: boolean) => {
    inputRef.current.acceleratePressed = pressed;
  }, []);

  const setBraking = useCallback((pressed: boolean) => {
    inputRef.current.brakePressed = pressed;
  }, []);

  useEffect(() => {
    if (Platform.OS !== "web") {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        setLaneChange(-1);
      } else if (event.key === "ArrowRight") {
        setLaneChange(1);
      } else if (event.key === "ArrowUp") {
        setAccelerating(true);
      } else if (event.key === "ArrowDown") {
        setBraking(true);
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === "ArrowUp") {
        setAccelerating(false);
      } else if (event.key === "ArrowDown") {
        setBraking(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [setAccelerating, setBraking, setLaneChange]);

  const swipeGesture = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([-12, 12])
        .activeOffsetY([-12, 12])
        .onEnd((event) => {
          const { translationX, translationY } = event;
          if (Math.abs(translationX) > Math.abs(translationY) && Math.abs(translationX) > SWIPE_THRESHOLD) {
            setLaneChange(translationX > 0 ? 1 : -1);
            return;
          }

          if (Math.abs(translationY) > SWIPE_THRESHOLD) {
            if (translationY < 0) {
              pulseAccelerate();
            } else {
              pulseBrake();
            }
          }
        }),
    [pulseAccelerate, pulseBrake, setLaneChange],
  );

  const consumeFrameInput = useCallback((dt: number) => {
    inputRef.current.acceleratePulseTime = Math.max(0, inputRef.current.acceleratePulseTime - dt);
    inputRef.current.brakePulseTime = Math.max(0, inputRef.current.brakePulseTime - dt);

    const snapshot = { ...inputRef.current };
    inputRef.current.laneChangeIntent = 0;
    return snapshot;
  }, []);

  return {
    swipeGesture,
    setAccelerating,
    setBraking,
    pulseAccelerate,
    pulseBrake,
    consumeFrameInput,
  };
}
