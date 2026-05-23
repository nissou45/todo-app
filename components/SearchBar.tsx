import React from 'react';
import { View, TextInput, Pressable } from 'react-native';
import Icon from './Icon';
import { COLORS } from '../constants/colors';
import { FONTS } from '../constants/typography';
import { ColorScheme } from '../types';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  C?: ColorScheme;
}

export default function SearchBar({ value, onChangeText }: SearchBarProps) {
  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center',
      marginHorizontal: 16, marginBottom: 12,
      paddingHorizontal: 12, paddingVertical: 8,
      borderRadius: 12,
      backgroundColor: COLORS.surface,
      borderWidth: 1, borderColor: COLORS.border,
    }}>
      <Icon name="search" size={16} color={COLORS.textMuted} />
      <TextInput
        style={{
          flex: 1, fontFamily: FONTS.body, fontSize: 14,
          color: COLORS.textPrimary, padding: 0, marginLeft: 8,
        }}
        value={value}
        onChangeText={onChangeText}
        placeholder="Rechercher une tâche..."
        placeholderTextColor={COLORS.textMuted}
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText('')}>
          <Icon name="x" size={16} color={COLORS.textMuted} />
        </Pressable>
      )}
    </View>
  );
}
