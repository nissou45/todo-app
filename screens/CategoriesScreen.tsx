import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import Icon from '../components/Icon';
import TabBar from '../components/TabBar';
import { COLORS, CATEGORIES } from '../constants/colors';
import { FONTS } from '../constants/typography';
import { SHADOWS } from '../constants/shadows';
import { Todo, ColorScheme, RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Categories'> & {
  todos: Todo[];
  isDark: boolean;
  C: ColorScheme;
};

function CategoryCard({ cat, count, done, onPress }: {
  cat: typeof CATEGORIES[0];
  count: number;
  done: number;
  onPress?: () => void;
}) {
  const pct = count > 0 ? Math.round((done / count) * 100) : 0;
  const textColor = cat.isLight ? COLORS.textPrimary : '#FFFFFF';
  const r = 16;
  const C = 2 * Math.PI * r;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1, transform: [{ scale: pressed ? 0.97 : 1 }],
      })}>
      <View style={[{
        backgroundColor: cat.color, borderRadius: 22,
        padding: 18, minHeight: 168, overflow: 'hidden',
      }, SHADOWS.tinted(cat.color)]}>
        <View style={{
          position: 'absolute', top: -25, right: -25,
          width: 110, height: 110, borderRadius: 55,
          backgroundColor: 'rgba(255,255,255,0.22)',
        }} />
        <View style={{
          position: 'absolute', bottom: -30, left: -10,
          width: 70, height: 70, borderRadius: 35,
          backgroundColor: 'rgba(255,255,255,0.12)',
        }} />

        <View style={{
          width: 42, height: 42, borderRadius: 12,
          backgroundColor: 'rgba(255,255,255,0.25)',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name={cat.icon} size={22} color={textColor} strokeWidth={1.9} />
        </View>

        <View style={{ flex: 1 }} />

        <Text style={{
          fontFamily: FONTS.display, fontSize: 24, lineHeight: 26,
          color: textColor, letterSpacing: -0.3,
        }}>{cat.name}</Text>

        <View style={{
          marginTop: 8, flexDirection: 'row',
          alignItems: 'center', justifyContent: 'space-between',
        }}>
          <Text style={{
            fontFamily: FONTS.bodyMedium, fontSize: 12,
            color: textColor, opacity: 0.85,
          }}>{done}/{count} faites</Text>

          <View style={{ width: 38, height: 38 }}>
            <Svg width={38} height={38} viewBox="0 0 38 38" style={{ transform: [{ rotate: '-90deg' }] }}>
              <Circle cx="19" cy="19" r={r} stroke="rgba(255,255,255,0.3)" strokeWidth={3} fill="none" />
              <Circle cx="19" cy="19" r={r} stroke={textColor} strokeWidth={3} fill="none"
                strokeDasharray={C} strokeDashoffset={C * (1 - pct / 100)} strokeLinecap="round" />
            </Svg>
            <View style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Text style={{
                fontFamily: FONTS.bodyBold, fontSize: 11, color: textColor,
              }}>{pct}</Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default function CategoriesScreen({ navigation, todos, isDark, C }: Props) {
  const total = todos.length;
  const totalDone = todos.filter((t) => t.completed).length;
  const pairs: (typeof CATEGORIES)[0][][] = [];
  for (let i = 0; i < CATEGORIES.length; i += 2) pairs.push([CATEGORIES[i], CATEGORIES[i + 1]]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 130 }} showsVerticalScrollIndicator={false}>
        <View style={{
          paddingHorizontal: 24, paddingTop: 8,
          flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between',
        }}>
          <View>
            <Text style={{ fontFamily: FONTS.display, fontSize: 32, color: COLORS.titleCats, letterSpacing: -0.5 }}>
              Listes
            </Text>
            <Text style={{
              fontFamily: FONTS.bodyMedium, fontSize: 13, marginTop: 8,
              letterSpacing: 0.4, textTransform: 'uppercase', color: COLORS.textSecondary,
            }}>{CATEGORIES.length} catégories · {total} tâches</Text>
          </View>
          <View style={{
            width: 38, height: 38, borderRadius: 19,
            borderWidth: 1, borderColor: COLORS.border,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="search" size={18} color={COLORS.textSecondary} />
          </View>
        </View>

        <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
          <View style={[{ borderRadius: 26, overflow: 'hidden' }, SHADOWS.tinted(COLORS.red)]}>
            <LinearGradient
              colors={['#FF6B6B', '#FF8585']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={{ padding: 24, position: 'relative', overflow: 'hidden' }}>
              <View style={{
                position: 'absolute', top: -30, right: -30,
                width: 150, height: 150, borderRadius: 75,
                backgroundColor: '#FFE66D', opacity: 0.95,
              }} />
              <View style={{
                position: 'absolute', top: 60, right: 80,
                width: 50, height: 50, borderRadius: 25,
                backgroundColor: '#4ECDC4', opacity: 0.85,
              }} />
              <Text style={{
                fontFamily: FONTS.bodyBold, fontSize: 11,
                letterSpacing: 1.4, textTransform: 'uppercase',
                color: '#FFFFFF', opacity: 0.85,
              }}>Toutes les listes</Text>
              <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
                <Text style={{ fontFamily: FONTS.display, fontSize: 52, color: '#FFFFFF' }}>{totalDone}</Text>
                <Text style={{ fontSize: 16, color: '#FFFFFF', opacity: 0.85 }}>/ {total} faites</Text>
              </View>
              <View style={{
                marginTop: 16, height: 5, borderRadius: 3,
                backgroundColor: 'rgba(255,255,255,0.25)', overflow: 'hidden', width: '75%',
              }}>
                <View style={{
                  width: total > 0 ? `${(totalDone / total) * 100}%` : '0%',
                  height: '100%', backgroundColor: '#FFFFFF',
                }} />
              </View>
            </LinearGradient>
          </View>
        </View>

        <View style={{
          paddingHorizontal: 24, paddingTop: 24, paddingBottom: 12,
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <Text style={{
            fontFamily: FONTS.bodyMedium, fontSize: 11,
            letterSpacing: 1.4, textTransform: 'uppercase', color: COLORS.textMuted,
          }}>Vos listes</Text>
        </View>

        <View style={{ paddingHorizontal: 16, gap: 10 }}>
          {pairs.map((row, ri) => (
            <View key={ri} style={{ flexDirection: 'row', gap: 10 }}>
              {row.filter(Boolean).map((cat) => {
                const count = todos.filter((t) => t.categoryId === cat.id).length;
                const done = todos.filter((t) => t.categoryId === cat.id && t.completed).length;
                return (
                  <CategoryCard key={cat.id} cat={cat} count={count} done={done}
                    onPress={() => navigation.navigate('Detail', { todoId: '' })} />
                );
              })}
              {row.length === 1 && <View style={{ flex: 1 }} />}
            </View>
          ))}
        </View>
      </ScrollView>

      <TabBar active="cats" onTab={(tab) => {
        if (!navigation) return;
        if (tab === 'home')  navigation.navigate('Home');
        if (tab === 'stats') navigation.navigate('Stats');
      }} />
    </SafeAreaView>
  );
}
