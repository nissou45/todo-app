import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../components/Icon';
import TabBar from '../components/TabBar';
import { COLORS } from '../constants/colors';
import { FONTS } from '../constants/typography';
import { SHADOWS } from '../constants/shadows';

export default function EmptyScreen({ navigation }: { navigation: any }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ paddingHorizontal: 24, paddingTop: 8 }}>
        <Text style={{ fontFamily: FONTS.display, fontSize: 32, color: COLORS.titleHome, letterSpacing: -0.5 }}>
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long' }).replace(/^\w/, c => c.toUpperCase())}
        </Text>
        <Text style={{
          fontFamily: FONTS.bodyMedium, fontSize: 13, marginTop: 8,
          letterSpacing: 0.4, textTransform: 'uppercase', color: COLORS.textSecondary,
        }}>
          {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} · Semaine {new Date().getWeek()}
        </Text>
      </View>

      <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 24, paddingTop: 40 }}>
        <View style={{ width: 240, height: 200 }}>
          <View style={[{
            position: 'absolute', top: 0, left: 50,
            width: 92, height: 92, borderRadius: 46,
            backgroundColor: COLORS.yellow,
          }, SHADOWS.tinted(COLORS.yellow)]} />

          <View style={[{
            position: 'absolute', bottom: 30, left: 10,
            width: 90, height: 70, borderRadius: 14,
            backgroundColor: COLORS.red, transform: [{ rotate: '-8deg' }], padding: 10,
          }, SHADOWS.tinted(COLORS.red)]}>
            <View style={{ width: 18, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.6)' }} />
            <View style={{ marginTop: 6, width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.6)' }} />
            <View style={{ marginTop: 6, width: 30, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.4)' }} />
          </View>
          <View style={[{
            position: 'absolute', bottom: 40, right: 18,
            width: 90, height: 70, borderRadius: 14,
            backgroundColor: COLORS.teal, transform: [{ rotate: '6deg' }], padding: 10,
          }, SHADOWS.tinted(COLORS.teal)]}>
            <View style={{ width: 18, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.6)' }} />
            <View style={{ marginTop: 6, width: 50, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.6)' }} />
            <View style={{ marginTop: 6, width: 26, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.4)' }} />
          </View>
          <View style={[{
            position: 'absolute', bottom: 0, left: 80,
            width: 90, height: 70, borderRadius: 14,
            backgroundColor: COLORS.blue, transform: [{ rotate: '-2deg' }], padding: 10, zIndex: 2,
          }, SHADOWS.tinted(COLORS.blue)]}>
            <View style={{ width: 18, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.6)' }} />
            <View style={{ marginTop: 6, width: 44, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.6)' }} />
            <View style={{ marginTop: 6, width: 34, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.4)' }} />
          </View>
        </View>

        <Text style={{
          marginTop: 48, fontFamily: FONTS.display, fontSize: 28, lineHeight: 32,
          color: COLORS.titleHome, letterSpacing: -0.4, textAlign: 'center',
        }}>Tout est fait ! 🎉</Text>

        <Text style={{
          marginTop: 12, fontFamily: FONTS.body, fontSize: 15,
          lineHeight: 23, color: COLORS.textSecondary,
          textAlign: 'center', maxWidth: 280,
        }}>
          Pas de tâches pour aujourd'hui. Profite de ta journée ou planifie déjà demain.
        </Text>

        <Pressable
          onPress={() => navigation && navigation.navigate('Create')}
          style={({ pressed }) => ({
            marginTop: 28, paddingHorizontal: 24, paddingVertical: 14,
            borderRadius: 28, backgroundColor: COLORS.accent,
            flexDirection: 'row', alignItems: 'center', gap: 8,
            transform: [{ scale: pressed ? 0.97 : 1 }],
            ...SHADOWS.tinted(COLORS.accent),
          })}>
          <Icon name="plus" size={18} color="#FFFFFF" strokeWidth={2.2} />
          <Text style={{ fontFamily: FONTS.bodySemi, fontSize: 15, color: '#FFFFFF' }}>
            Nouvelle tâche
          </Text>
        </Pressable>
      </View>

      <TabBar active="home" onTab={(tab) => {
        if (!navigation) return;
        if (tab === 'cats') navigation.navigate('Categories');
        if (tab === 'stats') navigation.navigate('Stats');
      }} />
    </SafeAreaView>
  );
}

declare global {
  interface Date {
    getWeek(): number;
  }
}

Date.prototype.getWeek = function () {
  const d = new Date(this);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
  const week1 = new Date(d.getFullYear(), 0, 4);
  return 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
};
