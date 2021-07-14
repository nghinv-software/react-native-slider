/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Created by nghinv on Tue Jul 13 2021
 * Copyright (c) 2021 nghinv@lumi.biz
 */

import React, { useEffect, useCallback } from 'react';
import equals from 'react-fast-compare';
import Animated, { useSharedValue } from 'react-native-reanimated';
import SliderComponent, { SliderComponentProps } from './SliderComponent';

type SliderComponentType = Omit<SliderComponentProps, 'value' | 'onStart' | 'onConfirm'>;

export interface SliderProps extends SliderComponentType {
  value?: number;
  animatedValue?: Animated.SharedValue<number>;
  onStart?: () => void;
  onChange?: (value: number) => void;
  onConfirm?: (value: number) => void;
}

Slider.defaultProps = {
  value: 0,
};

function Slider(props: SliderProps) {
  const {
    value,
    animatedValue,
    onStart,
    onChange,
    onConfirm,
    ...otherProps
  } = props;
  const valueAnim = animatedValue ?? useSharedValue(value!);

  useEffect(() => {
    if (!!value) {
      valueAnim.value = value!;
    }
  }, [value, valueAnim]);

  const onPanStart = useCallback(() => {
    onStart?.();
  }, []);

  const onPanChange = useCallback((v) => {
    onChange?.(v);
  }, []);

  const onPanConfirm = useCallback((v) => {
    onConfirm?.(v);
  }, []);

  return (
    <SliderComponent
      {...otherProps}
      value={valueAnim}
      onStart={onPanStart}
      onChange={onPanChange}
      onConfirm={onPanConfirm}
    />
  );
}

export default React.memo(Slider, equals);
