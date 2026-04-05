import { useCallback, useEffect, useMemo, useRef } from "react";
import { PanResponder, Platform } from "react-native";

import type { InputState, LaneChange } from "../types";

const SWIPE_THRESHOLD = 24;
const SWIPE_PULSE_SECONDS = 0.3;

export function useInput() {
  const inputRef = useRef<InputState>({
    acceleratePressed: false,
    brakePressed: false,
    laneChangeIntent: 0,
    acceleratePulseTime: 0,
    brakePulseTime: 0,
  });
  const gestureStateRef = useRef({
    startX: 0,
    startY: 0,
    laneCommitted: false,
  });

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

  const handlePanGrant = useCallback((pageX: number, pageY: number) => {
    gestureStateRef.current.startX = pageX;
    gestureStateRef.current.startY = pageY;
    gestureStateRef.current.laneCommitted = false;
  }, []);

  const handlePanMove = useCallback((moveX: number, moveY: number) => {
    const dx = moveX - gestureStateRef.current.startX;
    const dy = moveY - gestureStateRef.current.startY;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (absX > absY && absX > SWIPE_THRESHOLD && !gestureStateRef.current.laneCommitted) {
      setLaneChange(dx > 0 ? 1 : -1);
      gestureStateRef.current.laneCommitted = true;
      inputRef.current.acceleratePressed = false;
      inputRef.current.brakePressed = false;
      return;
    }

    if (absY > absX && absY > SWIPE_THRESHOLD) {
      inputRef.current.acceleratePressed = dy < 0;
      inputRef.current.brakePressed = dy > 0;
    } else {
      inputRef.current.acceleratePressed = false;
      inputRef.current.brakePressed = false;
    }
  }, [setLaneChange]);

  const handlePanEnd = useCallback((moveX: number, moveY: number) => {
    const dx = moveX - gestureStateRef.current.startX;
    const dy = moveY - gestureStateRef.current.startY;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    inputRef.current.acceleratePressed = false;
    inputRef.current.brakePressed = false;
    gestureStateRef.current.laneCommitted = false;

    if (absY > absX && absY > SWIPE_THRESHOLD) {
      if (dy < 0) {
        pulseAccelerate();
      } else {
        pulseBrake();
      }
    }
  }, [pulseAccelerate, pulseBrake]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_event, gestureState) =>
          Math.abs(gestureState.dx) > 2 || Math.abs(gestureState.dy) > 2,
        onPanResponderGrant: (event) => {
          handlePanGrant(event.nativeEvent.pageX, event.nativeEvent.pageY);
        },
        onPanResponderMove: (_event, gestureState) => {
          handlePanMove(gestureState.moveX, gestureState.moveY);
        },
        onPanResponderRelease: (_event, gestureState) => {
          handlePanEnd(gestureState.moveX, gestureState.moveY);
        },
        onPanResponderTerminate: (_event, gestureState) => {
          handlePanEnd(gestureState.moveX, gestureState.moveY);
        },
        onPanResponderTerminationRequest: () => false,
      }),
    [handlePanEnd, handlePanGrant, handlePanMove],
  );

  const consumeFrameInput = useCallback((dt: number) => {
    inputRef.current.acceleratePulseTime = Math.max(0, inputRef.current.acceleratePulseTime - dt);
    inputRef.current.brakePulseTime = Math.max(0, inputRef.current.brakePulseTime - dt);

    const snapshot: InputState = { ...inputRef.current };
    inputRef.current.laneChangeIntent = 0;
    return snapshot;
  }, []);

  return {
    panHandlers: panResponder.panHandlers,
    consumeFrameInput,
  };
}
