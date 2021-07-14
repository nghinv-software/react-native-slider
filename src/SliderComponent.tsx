/**
 * Created by nghinv on Fri Jun 18 2021
 * Copyright (c) 2021 nghinv@lumi.biz
 */

import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  StyleProp,
  LayoutChangeEvent,
} from 'react-native';
import equals from 'react-fast-compare';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
  interpolate,
  withTiming,
  Extrapolate,
  useAnimatedReaction,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import { springConfig, timingConfig } from '@nghinv/react-native-animated';

export interface SliderComponentProps {
  step?: number;
  min?: number;
  max?: number;
  width?: number | string;
  value: Animated.SharedValue<number>;
  style?: StyleProp<ViewStyle>;
  thumbRadius?: number;
  trackSize?: number;
  thumbTintColor?: string;
  lowerTrackColor?: string;
  upperTrackColor?: string;
  onStart?: () => void;
  onChange?: (value: number) => void;
  onConfirm?: (value: number) => void;
  disabled?: boolean;
  touchScale?: number;
  hitSlop?: number;
  hapticFeedback?: boolean;
}

SliderComponent.defaultProps = {
  step: 1,
  min: 0,
  max: 100,
  thumbRadius: 4,
  trackSize: 2,
  thumbTintColor: 'white',
  lowerTrackColor: '#448aff',
  upperTrackColor: '#616161',
  disabled: false,
  touchScale: 1.6,
  hitSlop: 16,
  hapticFeedback: false,
};

function computedValue(
  translateX: Animated.SharedValue<number>,
  width: Animated.SharedValue<number>,
  min: number,
  max: number,
  step: number,
) {
  'worklet';

  const value = interpolate(
    translateX.value,
    [0, width.value],
    [min, max],
    Extrapolate.CLAMP,
  );

  return Math.round(value / step) * step;
}

function computedTranslateFromValue(
  value: number,
  width: number,
  min: number,
  max: number,
) {
  'worklet';

  return interpolate(value, [min, max], [0, width], Extrapolate.CLAMP);
}

function SliderComponent(props: SliderComponentProps) {
  const {
    step,
    min,
    max,
    width,
    value,
    thumbRadius,
    trackSize,
    thumbTintColor,
    lowerTrackColor,
    upperTrackColor,
    disabled,
    style,
    onStart,
    onChange,
    onConfirm,
    touchScale,
    hitSlop,
    hapticFeedback,
  } = props;
  const sliderWidth = useSharedValue(typeof width === 'number' ? width : 0);
  const translateX = useSharedValue(0);
  const valueAnimated = useSharedValue(value.value);
  const scale = useSharedValue(1);
  const isGestureActive = useSharedValue(false);

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      sliderWidth.value = event.nativeEvent.layout.width;
      const transX = computedTranslateFromValue(
        value.value,
        event.nativeEvent.layout.width,
        min!,
        max!,
      );
      translateX.value = withTiming(transX, timingConfig);
    },
    [sliderWidth, max, min, value, translateX],
  );

  const onHapticFeedback = useCallback(() => {
    const ReactNativeHapticFeedback = require('react-native-haptic-feedback').default;
    if (!ReactNativeHapticFeedback) {
      console.warn(
        'react-native-haptic-feedback is require when set hapticFeedback equal true',
      );
      return;
    }
    const options = {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: true,
    };
    ReactNativeHapticFeedback.trigger('impactLight', options);
  }, []);

  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { x: number }
  >({
    onStart: (_, ctx) => {
      isGestureActive.value = true;
      ctx.x = translateX.value;
      scale.value = withSpring(touchScale!, springConfig);
      if (onStart) {
        runOnJS(onStart)();
      }
    },
    onActive: (event, ctx) => {
      const transX = event.translationX + ctx.x;
      const newValue = computedValue(
        translateX,
        sliderWidth,
        min!,
        max!,
        step!,
      );
      valueAnimated.value = newValue;
      translateX.value = Math.min(sliderWidth.value, Math.max(0, transX));
    },
    onFinish: () => {
      scale.value = withSpring(1, springConfig);
      const newValue = computedValue(
        translateX,
        sliderWidth,
        min!,
        max!,
        step!,
      );
      valueAnimated.value = newValue;
      const transX = computedTranslateFromValue(
        newValue,
        sliderWidth.value,
        min!,
        max!,
      );
      translateX.value = withSpring(transX, springConfig);

      if (onConfirm) {
        runOnJS(onConfirm)(newValue);
      }
      isGestureActive.value = false;

      if (hapticFeedback) {
        runOnJS(onHapticFeedback)();
      }
    },
  });

  useAnimatedReaction(
    () => {
      return valueAnimated.value;
    },
    (newValue, oldValue) => {
      if (onChange && isGestureActive.value && newValue !== oldValue) {
        runOnJS(onChange)(newValue!);
      }
    },
  );

  useAnimatedReaction(
    () => {
      return value.value;
    },
    (newValue, oldValue) => {
      if (!isGestureActive.value && newValue !== oldValue) {
        const transX = computedTranslateFromValue(
          newValue,
          sliderWidth.value,
          min!,
          max!,
        );
        translateX.value = withTiming(transX, timingConfig);
      }
    },
  );

  const thumbStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: -thumbRadius! - hitSlop! },
        { translateY: -thumbRadius! - hitSlop! + trackSize! / 2 },
        { translateX: translateX.value },
      ],
    };
  });

  const thumbStyleScale = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const lowerTrackStyle = useAnimatedStyle(() => {
    return {
      width: translateX.value,
    };
  });

  return (
    <View style={style}>
      <View
        onLayout={onLayout}
        style={{
          height: trackSize,
          borderRadius: trackSize,
          overflow: 'hidden',
          opacity: disabled ? 0.6 : 1,
          width,
        }}
      >
        <Animated.View
          style={[
            styles.upperTrack,
            {
              backgroundColor: upperTrackColor,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.lowerTrack,
            {
              backgroundColor: lowerTrackColor,
            },
            lowerTrackStyle,
          ]}
        />
      </View>
      <PanGestureHandler onGestureEvent={onGestureEvent} enabled={!disabled}>
        <Animated.View
          style={[
            styles.thumb,
            {
              width: (thumbRadius! + hitSlop!) * 2,
              height: (thumbRadius! + hitSlop!) * 2,
              borderRadius: thumbRadius! + hitSlop!,
            },
            thumbStyle,
          ]}
        >
          <Animated.View
            style={[
              {
                width: thumbRadius! * 2,
                height: thumbRadius! * 2,
                borderRadius: thumbRadius,
                backgroundColor: disabled ? 'grey' : thumbTintColor,
              },
              thumbStyleScale,
            ]}
          />
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  upperTrack: {
    ...StyleSheet.absoluteFillObject,
  },
  lowerTrack: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
  },
  thumb: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 0,
  },
});

export default React.memo(SliderComponent, equals);
