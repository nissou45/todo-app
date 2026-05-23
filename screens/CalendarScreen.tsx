import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from '../components/Icon';
import FAB from '../components/FAB';
import TabBar from '../components/TabBar';
import { COLORS, CATEGORIES, getCategory } from '../constants/colors';
import { FONTS } from '../constants/typography';
import { SHADOWS } from '../constants/shadows';
import { Todo, ColorScheme, RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Calendar'> & {
  todos: Todo[];
  isDark: boolean;
  C: ColorScheme;
};

const TODAY = 18;
const DAYS_IN_MONTH = 31;
const PREV_DAYS = [23, 24, 25, 26, 27, 28];
const WEEK_LABELS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

const WEEK_TASKS: Record<number, string[]> = {
  1: ['travail'], 3: ['loisirs'], 5: ['personnel', 'travail'],
  8: ['urgent'], 10: ['travail'], 12: ['loisirs', 'travail'],
  15: ['personnel'], 17: ['travail', 'travail', 'urgent'],
  18: ['travail', 'loisirs', 'urgent', 'personnel'],
  19: ['travail'], 20: ['loisirs'],
  22: ['personnel'], 24: ['travail', 'urgent'],
  27: ['loisirs'], 28: ['travail'],
};

const TODAY_TASKS = [
  { title: 'Course matinale', cat: 'loisirs', time: '07:30' },
  { title: 'Design review Q1', cat: 'travail', time: '10:00' },
  { title: 'Cours React Native', cat: 'urgent', time: '16:00' },
];

function DayCell({ day, isToday, tasks }: { day: number; isToday: boolean; tasks: string[] }) {
  return (
    <View style={[{
      aspectRatio: 0.9, borderRadius: 12,
      backgroundColor: isToday ? COLORS.accent : (tasks.length ? COLORS.surface : 'transparent'),
      borderWidth: isToday ? 0 : (tasks.length ? 1 : 1),
      borderColor: tasks.length ? COLORS.border : 'transparent',
      padding: 6, justifyContent: 'space-between',
    }, isToday ? SHADOWS.tinted(COLORS.accent) : undefined,
       tasks.length > 0 && !isToday ? SHADOWS.sm : undefined]}>
      <Text style={{
        fontFamily: isToday ? FONTS.bodySemi : FONTS.bodyMedium,
        fontSize: 13,
        color: isToday ? '#FFFFFF' : COLORS.textPrimary,
      }}>{day}</Text>
      {tasks.length > 0 && (
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 2 }}>
          {tasks.slice(0, 3).map((catId, i) => {
            const c = getCategory(catId);
            return (
              <View key={i} style={{
                width: 5, height: 5, borderRadius: 2.5,
                backgroundColor: isToday ? 'rgba(255,255,255,0.85)' : c.color,
              }} />
            );
          })}
        </View>
      )}
    </View>
  );
}

export default function CalendarScreen({ navigation, todos }: Props) {
  const cells: { day: number; prev?: boolean; isToday?: boolean; tasks: string[] }[] = [];
  for (const d of PREV_DAYS) cells.push({ day: d, prev: true, tasks: [] });
  for (let d = 1; d <= DAYS_IN_MONTH; d++) {
    cells.push({ day: d, isToday: d === TODAY, tasks: WEEK_TASKS[d] || [] });
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 130 }} showsVerticalScrollIndicator={false}>
        <View style={{
          paddingHorizontal: 24, paddingTop: 8,
          flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between',
        }}>
          <View>
            <Text style={{
              fontFamily: FONTS.display, fontSize: 32,
              color: COLORS.yellow, letterSpacing: -0.5,
            }}>{new Date().toLocaleDateString('fr-FR', { month: 'long' }).replace(/^\w/, c => c.toUpperCase())}</Text>
            <Text style={{
              fontFamily: FONTS.bodyMedium, fontSize: 13, marginTop: 8,
              letterSpacing: 0.4, textTransform: 'uppercase', color: COLORS.textSecondary,
            }}>{new Date().getFullYear()} · {todos.length} tâches</Text>
          </View>
        </View>

        <View style={{
          paddingHorizontal: 16, paddingTop: 20, paddingBottom: 8,
          flexDirection: 'row',
        }}>
          {WEEK_LABELS.map((d, i) => (
            <View key={i} style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{
                fontFamily: FONTS.bodyMedium, fontSize: 11,
                letterSpacing: 0.6, textTransform: 'uppercase', color: COLORS.textMuted,
              }}>{d}</Text>
            </View>
          ))}
        </View>

        <View style={{ paddingHorizontal: 16, flexDirection: 'row', flexWrap: 'wrap' }}>
          {cells.map((cell, i) => (
            <View key={i} style={{ width: `${100 / 7}%`, padding: 2 }}>
              {cell.prev ? (
                <View style={{ aspectRatio: 0.9, padding: 6, opacity: 0.4 }}>
                  <Text style={{ fontSize: 13, color: COLORS.textMuted }}>{cell.day}</Text>
                </View>
              ) : (
                <DayCell day={cell.day} isToday={cell.isToday || false} tasks={cell.tasks} />
              )}
            </View>
          ))}
        </View>

        <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
          <View style={[{
            backgroundColor: COLORS.surface, borderRadius: 22,
            borderWidth: 1, borderColor: COLORS.border, padding: 20,
          }, SHADOWS.sm]}>
            <View style={{
              flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14,
            }}>
              <View>
                <Text style={{
                  fontFamily: FONTS.bodyMedium, fontSize: 11,
                  letterSpacing: 1, textTransform: 'uppercase', color: COLORS.textMuted,
                }}>Aujourd'hui</Text>
                <Text style={{ marginTop: 4, fontFamily: FONTS.display, fontSize: 22, color: COLORS.textPrimary, letterSpacing: -0.2 }}>
                  {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </Text>
              </View>
              <View style={{
                paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10,
                backgroundColor: 'rgba(78,205,196,0.12)',
              }}>
                <Text style={{ fontFamily: FONTS.bodySemi, fontSize: 12, color: COLORS.teal }}>
                  {todos.length} tâches
                </Text>
              </View>
            </View>

            {TODAY_TASKS.map((t, i) => {
              const c = getCategory(t.cat);
              return (
                <Pressable
                  key={i}
                  onPress={() => navigation && navigation.navigate('Detail', { todoId: '' })}
                  style={{
                    flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10,
                    borderBottomWidth: i < TODAY_TASKS.length - 1 ? 0.5 : 0,
                    borderBottomColor: COLORS.border,
                  }}>
                  <View style={{
                    width: 3, height: 32, borderRadius: 2, backgroundColor: c.color,
                  }} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: FONTS.bodyMedium, fontSize: 14, color: COLORS.textPrimary }}>{t.title}</Text>
                    <Text style={{ fontSize: 12, color: COLORS.textMuted }}>{c.name}</Text>
                  </View>
                  <Text style={{ fontFamily: FONTS.body, fontSize: 13, color: COLORS.textSecondary }}>{t.time}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <FAB onPress={() => navigation && navigation.navigate('Create')} />
      <TabBar active="home" onTab={(tab) => {
        if (!navigation) return;
        if (tab === 'home') navigation.navigate('Home');
        if (tab === 'cats') navigation.navigate('Categories');
        if (tab === 'stats') navigation.navigate('Stats');
      }} />
    </SafeAreaView>
  );
}
