import React from 'react';
import { View, TextInput, StyleSheet, Pressable, Text } from 'react-native';
import { ColorScheme } from '../types';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  C: ColorScheme;
}

export default function SearchBar({ value, onChangeText, C }: SearchBarProps) {
  return (
    <View style={[s.container, { backgroundColor: C.card, borderColor: C.border }]}>
      <Text style={{ fontSize: 16, marginRight: 8 }}>🔍</Text>
      <TextInput
        style={[s.input, { color: C.text }]}
        value={value}
        onChangeText={onChangeText}
        placeholder="Rechercher une tâche..."
        placeholderTextColor={C.textMuted}
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText('')}>
          <Text style={{ color: C.textMuted, fontSize: 18 }}>✕</Text>
        </Pressable>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
});
