import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Icon from './Icon';
import { COLORS } from '../constants/colors';
import { FONTS } from '../constants/typography';
import { ColorScheme } from '../types';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  onLeft?: () => void;
  leftLabel?: string;
  onRight?: () => void;
  rightLabel?: string;
  C?: ColorScheme;
}

export default function Header({ title, onBack, onLeft, leftLabel, onRight, rightLabel }: HeaderProps) {
  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: 16, paddingVertical: 14,
    }}>
      {onBack && (
        <Pressable onPress={onBack} style={{ marginRight: 12 }}>
          <Icon name="chevronL" size={20} color={COLORS.accent} />
        </Pressable>
      )}
      {onLeft && (
        <Pressable onPress={onLeft} style={{ marginRight: 12 }}>
          <Text style={{ fontFamily: FONTS.bodySemi, fontSize: 14, color: COLORS.accent }}>{leftLabel}</Text>
        </Pressable>
      )}
      <Text style={{
        flex: 1,
        fontFamily: FONTS.displayBold, fontSize: 17,
        color: COLORS.textPrimary,
        textAlign: onLeft || onBack ? 'center' : 'left',
      }}>{title}</Text>
      {onRight ? (
        <Pressable onPress={onRight}>
          <Text style={{ fontFamily: FONTS.bodySemi, fontSize: 14, color: COLORS.accent }}>{rightLabel}</Text>
        </Pressable>
      ) : (
        <View style={{ width: 60 }} />
      )}
    </View>
  );
}
