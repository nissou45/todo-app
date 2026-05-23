import React from 'react';
import { Pressable, View, Text } from 'react-native';
import { COLORS } from '../constants/colors';
import { FONTS } from '../constants/typography';
import { SHADOWS } from '../constants/shadows';
import { ColorScheme } from '../types';

interface ChipProps {
  label: string;
  count?: number;
  active?: boolean;
  color?: string;
  onPress?: () => void;
  C: ColorScheme;
}

export default function Chip({ label, count, active, color, onPress, C }: ChipProps): JSX.Element {
  const accent = color || C.accent;
  return (
    <Pressable onPress={onPress}>
      <View style={[{
        flexDirection: 'row', alignItems: 'center',
        height: 36, paddingHorizontal: 16,
        borderRadius: 18,
        backgroundColor: active ? accent : 'transparent',
        borderWidth: 1,
        borderColor: active ? accent : C.border,
      }, active && SHADOWS.tinted(accent)]}>
        <Text style={{
          fontFamily: FONTS.bodyMedium, fontSize: 14,
          color: active ? '#FFFFFF' : C.textSecondary,
        }}>{label}</Text>
        {count != null && (
          <Text style={{
            marginLeft: 8, fontSize: 12,
            color: active ? '#FFFFFF' : C.textMuted,
            opacity: active ? 0.85 : 1,
          }}>{count}</Text>
        )}
      </View>
    </Pressable>
  );
}
