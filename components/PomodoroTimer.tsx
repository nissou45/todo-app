import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { usePomodoro } from '../hooks/usePomodoro';
import { COLORS } from '../constants/colors';
import { FONTS } from '../constants/typography';
import { SHADOWS } from '../constants/shadows';
import { ColorScheme } from '../types';

interface PomodoroTimerProps {
  onSessionComplete: () => void;
  C?: ColorScheme;
  isDark?: boolean;
}

export default function PomodoroTimer({ onSessionComplete }: PomodoroTimerProps) {
  const { timeLeft, isActive, mode, toggleTimer, resetTimer, formatTime } = usePomodoro(onSessionComplete);

  return (
    <View style={[{
      padding: 20, borderRadius: 20, borderWidth: 1,
      borderColor: COLORS.border, backgroundColor: COLORS.surface,
      alignItems: 'center', marginVertical: 10,
    }, SHADOWS.sm]}>
      <View style={{
        flexDirection: 'row', justifyContent: 'space-between',
        width: '100%', alignItems: 'center', marginBottom: 10,
      }}>
        <Text style={{ fontFamily: FONTS.bodySemi, fontSize: 14, color: COLORS.textPrimary }}>
          {mode === 'work' ? '🎯 Travail' : '☕ Pause'}
        </Text>
        <Pressable onPress={resetTimer}>
          <Text style={{ fontSize: 12, color: COLORS.textMuted }}>Réinitialiser</Text>
        </Pressable>
      </View>

      <Text style={{
        fontSize: 48, fontWeight: '800', marginVertical: 10,
        fontVariant: ['tabular-nums'],
        color: mode === 'work' ? COLORS.accent : COLORS.teal,
      }}>
        {formatTime(timeLeft)}
      </Text>

      <Pressable
        style={({ pressed }) => ({
          paddingHorizontal: 32, paddingVertical: 12,
          borderRadius: 25, marginTop: 10, width: '100%', alignItems: 'center',
          backgroundColor: isActive ? COLORS.surface2 : (mode === 'work' ? COLORS.accent : COLORS.teal),
          transform: [{ scale: pressed ? 0.97 : 1 }],
        })}
        onPress={toggleTimer}
      >
        <Text style={{
          color: isActive ? COLORS.textPrimary : '#FFFFFF',
          fontFamily: FONTS.bodyBold, fontSize: 16,
        }}>{isActive ? 'Pause' : 'Démarrer'}</Text>
      </Pressable>
    </View>
  );
}
