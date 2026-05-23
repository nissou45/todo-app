import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Icon from './Icon';
import { COLORS } from '../constants/colors';
import { FONTS } from '../constants/typography';
import { SHADOWS } from '../constants/shadows';

const TABS = [
  { id: 'home',  icon: 'home',  label: "Aujourd'hui" },
  { id: 'cats',  icon: 'grid',  label: 'Listes' },
  { id: 'stats', icon: 'chart', label: 'Stats' },
  { id: 'me',    icon: 'user',  label: 'Profil' },
];

interface TabBarProps {
  active?: string;
  onTab?: (tab: string) => void;
}

export default function TabBar({ active = 'home', onTab }: TabBarProps) {
  return (
    <View style={[{
      position: 'absolute', bottom: 28, left: 16, right: 16,
      height: 64, borderRadius: 32,
      backgroundColor: 'rgba(255,255,255,0.96)',
      borderWidth: 1, borderColor: 'rgba(45,55,72,0.04)',
      flexDirection: 'row', alignItems: 'center',
      justifyContent: 'space-around', paddingHorizontal: 12,
      zIndex: 30,
    }, SHADOWS.pop]}>
      {TABS.map(t => {
        const isActive = t.id === active;
        return (
          <Pressable
            key={t.id}
            onPress={() => onTab && onTab(t.id)}
            style={({ pressed }) => ({
              flex: 1, alignItems: 'center',
              paddingVertical: 6,
              transform: [{ scale: pressed ? 0.95 : 1 }],
            })}>
            {isActive && (
              <View style={{
                position: 'absolute', top: 0, width: 4, height: 4,
                borderRadius: 2,
                backgroundColor: COLORS.accent,
              }} />
            )}
            <Icon name={t.icon} size={22}
              color={isActive ? COLORS.accent : COLORS.textMuted}
              strokeWidth={isActive ? 1.9 : 1.5} />
            <Text style={{
              fontFamily: FONTS.bodyMedium, fontSize: 10,
              marginTop: 3, letterSpacing: 0.2,
              color: isActive ? COLORS.accent : COLORS.textMuted,
            }}>{t.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
