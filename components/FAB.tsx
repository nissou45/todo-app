import React from 'react';
import { Pressable, View } from 'react-native';
import Icon from './Icon';
import { COLORS } from '../constants/colors';
import { SHADOWS } from '../constants/shadows';
import { ColorScheme } from '../types';

interface FABProps {
  onPress?: () => void;
  bottom?: number;
  color?: string;
  C: ColorScheme;
}

export default function FAB({ onPress, bottom = 110, color, C }: FABProps) {
  const fabColor = color || C.accent;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        position: 'absolute', right: 24, bottom,
        transform: [{ scale: pressed ? 0.95 : 1 }],
      })}>
      <View style={[{
        width: 56, height: 56, borderRadius: 28,
        backgroundColor: fabColor,
        alignItems: 'center', justifyContent: 'center',
      }, SHADOWS.tinted(fabColor)]}>
        <Icon name="plus" size={24} color="#FFFFFF" strokeWidth={2.2} />
      </View>
    </Pressable>
  );
}
