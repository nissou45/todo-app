import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Icon from './Icon';
import { COLORS } from '../constants/colors';
import { FONTS } from '../constants/typography';
import { SHADOWS } from '../constants/shadows';
import { ColorScheme } from '../types';

const TABS = [
  { id: 'home',  icon: 'home',  label: "Aujourd'hui" },
  { id: 'cats',  icon: 'grid',  label: 'Listes' },
  { id: 'stats', icon: 'chart', label: 'Stats' },
  { id: 'me',    icon: 'user',  label: 'Profil' },
];

interface TabBarProps {
  active?: string;
  onTab?: (tab: string) => void;
  C: ColorScheme;
}

export default function TabBar({ active = 'home', onTab, C }: TabBarProps) {
  return (
    <View style={[{
      position: 'absolute', bottom: 28, left: 16, right: 16,
      height: 64, borderRadius: 32,
      backgroundColor: C.card,
      borderWidth: 1, borderColor: C.border,
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
                backgroundColor: C.accent,
              }} />
            )}
            <Icon name={t.icon} size={22}
              color={isActive ? C.accent : C.textMuted}
              strokeWidth={isActive ? 1.9 : 1.5} />
            <Text style={{
              fontFamily: FONTS.bodyMedium, fontSize: 10,
              marginTop: 3, letterSpacing: 0.2,
              color: isActive ? C.accent : C.textMuted,
            }}>{t.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
