import React, { useEffect, useRef } from 'react';
import { Pressable, View, Animated } from 'react-native';
import Icon from './Icon';
import { COLORS } from '../constants/colors';

interface CheckboxProps {
  checked?: boolean;
  color?: string;
  size?: number;
  onToggle?: () => void;
}

export default function Checkbox({ checked, color, size = 22, onToggle }: CheckboxProps) {
  const scale = useRef(new Animated.Value(checked ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: checked ? 1 : 0,
      friction: 6, tension: 120,
      useNativeDriver: true,
    }).start();
  }, [checked]);

  const ringColor = color || COLORS.border2;
  const fillColor = color || COLORS.accent;

  return (
    <Pressable onPress={onToggle} hitSlop={6}>
      <View style={{
        width: size, height: size, borderRadius: size / 2,
        borderWidth: 1.5,
        borderColor: checked ? fillColor : ringColor,
        backgroundColor: checked ? fillColor : 'transparent',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <Animated.View style={{ transform: [{ scale }] }}>
          <Icon name="check" size={size * 0.62} color="#FFFFFF" strokeWidth={2.6} />
        </Animated.View>
      </View>
    </Pressable>
  );
}
