import React from 'react';
import { Pressable, View } from 'react-native';
import Icon from './Icon';
import { COLORS } from '../constants/colors';
import { SHADOWS } from '../constants/shadows';

interface FABProps {
  onPress?: () => void;
  bottom?: number;
  color?: string;
}

export default function FAB({ onPress, bottom = 110, color = COLORS.accent }: FABProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        position: 'absolute', right: 24, bottom,
        transform: [{ scale: pressed ? 0.95 : 1 }],
      })}>
      <View style={[{
        width: 56, height: 56, borderRadius: 28,
        backgroundColor: color,
        alignItems: 'center', justifyContent: 'center',
      }, SHADOWS.tinted(color)]}>
        <Icon name="plus" size={24} color="#FFFFFF" strokeWidth={2.2} />
      </View>
    </Pressable>
  );
}
