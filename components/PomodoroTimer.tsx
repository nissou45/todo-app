import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { usePomodoro } from '../hooks/usePomodoro';
import { ColorScheme } from '../types';

interface PomodoroTimerProps {
  onSessionComplete: () => void;
  C: ColorScheme;
  isDark: boolean;
}

export default function PomodoroTimer({ onSessionComplete, C, isDark }: PomodoroTimerProps) {
  const { timeLeft, isActive, mode, toggleTimer, resetTimer, formatTime } = usePomodoro(onSessionComplete);

  return (
    <View style={[s.container, { backgroundColor: C.card, borderColor: C.border }]}>
      <View style={s.header}>
        <Text style={[s.title, { color: C.text }]}>
          {mode === 'work' ? '🎯 Travail' : '☕ Pause'}
        </Text>
        <Pressable onPress={resetTimer}>
          <Text style={{ color: C.textMuted, fontSize: 12 }}>Réinitialiser</Text>
        </Pressable>
      </View>
      
      <Text style={[s.timer, { color: mode === 'work' ? '#7C3AED' : '#047857' }]}>
        {formatTime(timeLeft)}
      </Text>

      <Pressable
        style={[s.btn, { backgroundColor: isActive ? C.border : (mode === 'work' ? '#7C3AED' : '#047857') }]}
        onPress={toggleTimer}
      >
        <Text style={s.btnText}>{isActive ? 'Pause' : 'Démarrer'}</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    marginVertical: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: { fontSize: 14, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  timer: { fontSize: 48, fontWeight: '800', marginVertical: 10, fontVariant: ['tabular-nums'] },
  btn: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
