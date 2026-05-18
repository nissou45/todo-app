import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ColorScheme } from '../types';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  onLeft?: () => void;
  leftLabel?: string;
  onRight?: () => void;
  rightLabel?: string;
  C: ColorScheme;
}

export default function Header({ title, onBack, onLeft, leftLabel, onRight, rightLabel, C }: HeaderProps) {
  return (
    <View
      style={[
        styles.container,
        { borderBottomColor: C.border, backgroundColor: C.bg },
      ]}
    >
      {onBack && (
        <Pressable onPress={onBack} style={styles.back}>
          <Text style={styles.backText}>‹ Retour</Text>
        </Pressable>
      )}
      {onLeft && (
        <Pressable onPress={onLeft} style={styles.left}>
          <Text style={styles.leftText}>{leftLabel}</Text>
        </Pressable>
      )}
      <Text style={[styles.title, { color: C.text, textAlign: onLeft || onBack ? 'center' : 'left' }]}>{title}</Text>
      {onRight ? (
        <Pressable onPress={onRight}>
          <Text style={styles.rightText}>{rightLabel}</Text>
        </Pressable>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  back: { marginRight: 12 },
  backText: { fontSize: 16, color: '#7C3AED', fontWeight: '600' },
  left: { marginRight: 12 },
  leftText: { fontSize: 16, color: '#7C3AED', fontWeight: '600' },
  title: { flex: 1, fontSize: 17, fontWeight: '700' },
  rightText: { fontSize: 15, color: '#7C3AED', fontWeight: '600' },
  placeholder: { width: 60 },
});
