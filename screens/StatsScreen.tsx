import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Svg, { Circle } from 'react-native-svg';
import Icon from '../components/Icon';
import TabBar from '../components/TabBar';
import { CATEGORIES } from '../constants/colors';
import { FONTS } from '../constants/typography';
import { SHADOWS } from '../constants/shadows';
import { Todo, ColorScheme, RootStackParamList } from '../types';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

type Props = NativeStackScreenProps<RootStackParamList, 'Stats'> & {
  todos: Todo[];
  isDark: boolean;
  C: ColorScheme;
};

const WEEK_LABELS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'] as const;
const BAR_COLORS = ['#FF6B6B', '#FFE66D', '#4ECDC4', '#45B7D1', '#FF6B6B', '#FFE66D', '#4ECDC4'] as const;

function getWeekId(date: Date): number {
  const day = date.getDay();
  // Convert Sunday=0 → 6, Monday=1 → 0, ..., Saturday=6 → 5
  return day === 0 ? 6 : day - 1;
}

function computeWeekData(todos: Todo[]): { ratio: number; count: number; total: number }[] {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - getWeekId(now));
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const days: { total: number; done: number }[] = Array.from({ length: 7 }, () => ({ total: 0, done: 0 }));

  todos.forEach((t) => {
    if (!t.dueDate) return;
    const d = new Date(t.dueDate);
    if (d >= startOfWeek && d <= endOfWeek) {
      const wi = getWeekId(d);
      days[wi].total++;
      if (t.completed) days[wi].done++;
    }
  });

  return days.map((d) => ({
    ratio: d.total > 0 ? d.done / d.total : 0,
    count: d.done,
    total: d.total,
  }));
}

function WeekBars({ todos, C }: { todos: Todo[]; C: ColorScheme }): JSX.Element {
  const weekData = computeWeekData(todos);
  const now = new Date();
  const todayIdx = getWeekId(now);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 10, height: 130 }}>
      {weekData.map((d, i) => {
        const isToday = i === todayIdx;
        const isFuture = i > todayIdx;
        return (
          <View key={i} style={{ flex: 1, alignItems: 'center', height: '100%' }}>
            <View style={{ flex: 1, width: '100%', justifyContent: 'flex-end' }}>
              <View style={{
                height: `${Math.max(d.ratio * 100, d.total > 0 ? 4 : 0)}%`, borderRadius: 8,
                backgroundColor: isFuture ? C.border : BAR_COLORS[i],
                opacity: isFuture ? 0.6 : 1,
                minHeight: d.total > 0 ? 4 : 0,
              }} />
            </View>
            <Text style={{
              marginTop: 8, fontFamily: FONTS.bodySemi, fontSize: 11,
              color: isToday ? BAR_COLORS[i] : C.textMuted,
            }}>{WEEK_LABELS[i]}</Text>
            {d.total > 0 && (
              <Text style={{
                fontFamily: FONTS.bodyMedium, fontSize: 8,
                color: C.textMuted, marginTop: 1,
              }}>{d.count}/{d.total}</Text>
            )}
          </View>
        );
      })}
    </View>
  );
}

function CatBar({ name, color, count, total, C }: { name: string; color: string; count: number; total: number; C: ColorScheme }): JSX.Element {
  return (
    <View style={{ paddingVertical: 10 }}>
      <View style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={{ width: 9, height: 9, borderRadius: 4.5, backgroundColor: color }} />
          <Text style={{ fontFamily: FONTS.bodyMedium, fontSize: 14, color: C.textPrimary }}>{name}</Text>
        </View>
        <Text style={{ fontSize: 12, color: C.textMuted }}>{count} / {total}</Text>
      </View>
      <View style={{ height: 6, borderRadius: 3, backgroundColor: C.surface2, overflow: 'hidden' }}>
        <View style={{
          width: total > 0 ? `${(count / total) * 100}%` : '0%',
          height: '100%', backgroundColor: color,
        }} />
      </View>
    </View>
  );
}

export default function StatsScreen({ navigation, todos, isDark, C }: Props): JSX.Element {
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const completion = total > 0 ? Math.round((completed / total) * 100) : 0;
  const overdueCount = todos.filter((t) => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()).length;

  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - completion / 100);

  const exportPDF = async () => {
    const html = `<html><body><h1>Rapport Todo</h1></body></html>`;
    try {
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri);
    } catch (e) { console.error(e); }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 130 }} showsVerticalScrollIndicator={false}>
        <View style={{
          paddingHorizontal: 24, paddingTop: 8,
          flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between',
        }}>
          <View>
            <Text style={{ fontFamily: FONTS.display, fontSize: 32, color: C.titleStats, letterSpacing: -0.5 }}>
              Progression
            </Text>
            <Text style={{
              fontFamily: FONTS.bodyMedium, fontSize: 13, marginTop: 8,
              letterSpacing: 0.4, textTransform: 'uppercase', color: C.textSecondary,
            }}>Cette semaine</Text>
          </View>
          <Pressable onPress={exportPDF} style={{
            flexDirection: 'row', alignItems: 'center', gap: 5,
            paddingHorizontal: 12, paddingVertical: 7, borderRadius: 14,
            backgroundColor: C.surface, borderWidth: 1, borderColor: C.border,
          }}>
            <Icon name="paperclip" size={12} color={C.textSecondary} />
            <Text style={{ fontFamily: FONTS.bodyMedium, fontSize: 12, color: C.textSecondary }}>PDF</Text>
          </Pressable>
        </View>

        <View style={{ paddingHorizontal: 16, paddingTop: 24 }}>
          <View style={[{
            backgroundColor: C.surface, borderRadius: 24, padding: 24,
            borderWidth: 1, borderColor: C.border,
            flexDirection: 'row', alignItems: 'center', gap: 22,
          }, SHADOWS.sm]}>
            <View style={{ width: 124, height: 124 }}>
              <Svg width={124} height={124} viewBox="0 0 124 124" style={{ transform: [{ rotate: '-90deg' }] }}>
                <Circle cx="62" cy="62" r={r} stroke={C.surface2} strokeWidth={10} fill="none" />
                <Circle cx="62" cy="62" r={r} stroke={C.accent} strokeWidth={10} fill="none"
                  strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
              </Svg>
              <View style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                alignItems: 'center', justifyContent: 'center',
              }}>
                <Text style={{ fontFamily: FONTS.display, fontSize: 38, color: C.textPrimary }}>
                  {completion}<Text style={{ fontSize: 18, color: C.textMuted }}>%</Text>
                </Text>
                <Text style={{ fontSize: 10, letterSpacing: 1, color: C.textMuted, textTransform: 'uppercase' }}>
                  Terminé
                </Text>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontFamily: FONTS.display, fontSize: 22, lineHeight: 26,
                color: C.textPrimary, letterSpacing: -0.3,
              }}>
                {completion >= 80 ? 'Super rythme cette semaine !' : completion >= 50 ? 'Continue comme ça !' : 'Cette semaine peut mieux faire'}
              </Text>
              <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Icon name="trend" size={13} color={C.accent} />
                <Text style={{ fontFamily: FONTS.bodyMedium, fontSize: 12, color: C.accent }}>
                  {overdueCount === 0 ? 'Aucun retard' : `${overdueCount} tâche(s) en retard`}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
          <View style={[{
            backgroundColor: C.surface, borderRadius: 24, padding: 22,
            borderWidth: 1, borderColor: C.border,
          }, SHADOWS.sm]}>
            <View style={{
              flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18,
            }}>
              <Text style={{
                fontFamily: FONTS.bodyMedium, fontSize: 11,
                letterSpacing: 1.4, textTransform: 'uppercase', color: C.textMuted,
              }}>Tâches terminées</Text>
              <Text style={{ fontSize: 12, color: C.textMuted }}>{completed} cette semaine</Text>
            </View>
            <WeekBars todos={todos} C={C} />
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingTop: 12 }}>
          <View style={[{
            flex: 1, padding: 18, backgroundColor: C.yellow, borderRadius: 20,
          }, SHADOWS.tinted(C.yellow)]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Icon name="flame" size={16} color={C.textPrimary} strokeWidth={1.9} />
              <Text style={{
                fontFamily: FONTS.bodyBold, fontSize: 10,
                letterSpacing: 1, textTransform: 'uppercase', color: C.textPrimary,
              }}>Taux</Text>
            </View>
            <Text style={{ marginTop: 10, fontFamily: FONTS.display, fontSize: 38, color: C.textPrimary }}>
              {completion}<Text style={{ fontSize: 16, fontFamily: FONTS.body, opacity: 0.6 }}>%</Text>
            </Text>
            <Text style={{ marginTop: 4, fontSize: 12, color: C.textPrimary, opacity: 0.7 }}>
              de complétion
            </Text>
          </View>

          <View style={[{
            flex: 1, padding: 18, backgroundColor: C.teal, borderRadius: 20,
          }, SHADOWS.tinted(C.teal)]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Icon name="clock" size={16} color="#fff" strokeWidth={1.9} />
              <Text style={{
                fontFamily: FONTS.bodyBold, fontSize: 10,
                letterSpacing: 1, textTransform: 'uppercase', color: '#fff',
              }}>Retard</Text>
            </View>
            <Text style={{ marginTop: 10, fontFamily: FONTS.display, fontSize: 38, color: '#fff' }}>
              {overdueCount}
            </Text>
            <Text style={{ marginTop: 4, fontSize: 12, color: '#fff', opacity: 0.85 }}>
              tâches en retard
            </Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
          <View style={[{
            backgroundColor: C.surface, borderRadius: 24, padding: 22,
            borderWidth: 1, borderColor: C.border,
          }, SHADOWS.sm]}>
            <Text style={{
              fontFamily: FONTS.bodyMedium, fontSize: 11,
              letterSpacing: 1.4, textTransform: 'uppercase',
              color: C.textMuted, marginBottom: 8,
            }}>Par catégorie</Text>
            {CATEGORIES.map((cat) => {
              const count = todos.filter((t) => t.categoryId === cat.id).length;
              const done = todos.filter((t) => t.categoryId === cat.id && t.completed).length;
              return <CatBar key={cat.id} name={cat.name} color={cat.color} count={done} total={count} C={C} />;
            })}
          </View>
        </View>
      </ScrollView>

      <TabBar active="stats" C={C} onTab={(tab) => {
        if (!navigation) return;
        if (tab === 'home') navigation.navigate('Home');
        if (tab === 'cats') navigation.navigate('Categories');
      }} />
    </SafeAreaView>
  );
}
