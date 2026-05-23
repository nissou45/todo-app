import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from '../components/Icon';
import FAB from '../components/FAB';
import TabBar from '../components/TabBar';
import { COLORS, getCategory } from '../constants/colors';
import { FONTS } from '../constants/typography';
import { SHADOWS } from '../constants/shadows';
import { Todo, ColorScheme, RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Calendar'> & {
  todos: Todo[];
  isDark: boolean;
  C: ColorScheme;
};

const WEEK_LABELS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

function DayCell({ day, isToday, catIds }: { day: number; isToday: boolean; catIds: string[] }) {
  return (
    <View style={[{
      aspectRatio: 0.9, borderRadius: 12,
      backgroundColor: isToday ? COLORS.accent : (catIds.length ? COLORS.surface : 'transparent'),
      borderWidth: isToday ? 0 : (catIds.length ? 1 : 1),
      borderColor: catIds.length ? COLORS.border : 'transparent',
      padding: 6, justifyContent: 'space-between',
    }, isToday ? SHADOWS.tinted(COLORS.accent) : undefined,
       catIds.length > 0 && !isToday ? SHADOWS.sm : undefined]}>
      <Text style={{
        fontFamily: isToday ? FONTS.bodySemi : FONTS.bodyMedium,
        fontSize: 13,
        color: isToday ? '#FFFFFF' : COLORS.textPrimary,
      }}>{day}</Text>
      {catIds.length > 0 && (
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 2 }}>
          {catIds.slice(0, 3).map((catId, i) => {
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

function getMonthBoundaries(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startWeekday = (firstDay.getDay() + 6) % 7; // Monday = 0
  const prevMonthDays = new Date(year, month, 0).getDate();
  return { year, month, daysInMonth, startWeekday, prevMonthDays };
}

export default function CalendarScreen({ navigation, todos }: Props) {
  const now = new Date();
  const today = now.getDate();
  const { year, month, daysInMonth, startWeekday, prevMonthDays } = getMonthBoundaries(now);

  // Build density map from real todos
  const density: Record<number, string[]> = {};
  const todayTodos: Todo[] = [];
  todos.forEach((t) => {
    if (!t.dueDate) return;
    const d = new Date(t.dueDate);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      if (!density[day]) density[day] = [];
      density[day].push(t.categoryId);
    }
    if (d.toDateString() === now.toDateString()) {
      todayTodos.push(t);
    }
  });

  const cells: { day: number; prev?: boolean; isToday?: boolean; catIds: string[] }[] = [];
  for (let d = startWeekday - 1; d >= 0; d--) {
    cells.push({ day: prevMonthDays - d, prev: true, catIds: [] });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, isToday: d === today, catIds: density[d] || [] });
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
            }}>{now.toLocaleDateString('fr-FR', { month: 'long' }).replace(/^\w/, c => c.toUpperCase())}</Text>
            <Text style={{
              fontFamily: FONTS.bodyMedium, fontSize: 13, marginTop: 8,
              letterSpacing: 0.4, textTransform: 'uppercase', color: COLORS.textSecondary,
            }}>{year} · {todos.length} tâches</Text>
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
                <DayCell day={cell.day} isToday={cell.isToday || false} catIds={cell.catIds} />
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
                  {now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </Text>
              </View>
              <View style={{
                paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10,
                backgroundColor: 'rgba(78,205,196,0.12)',
              }}>
                <Text style={{ fontFamily: FONTS.bodySemi, fontSize: 12, color: COLORS.teal }}>
                  {todayTodos.length} tâche{todayTodos.length > 1 ? 's' : ''}
                </Text>
              </View>
            </View>

            {todayTodos.length === 0 ? (
              <Text style={{ fontFamily: FONTS.body, fontSize: 14, color: COLORS.textMuted, paddingVertical: 12, textAlign: 'center' }}>
                Aucune tâche aujourd'hui
              </Text>
            ) : (
              todayTodos.map((t, i) => {
                const c = getCategory(t.categoryId);
                return (
                  <Pressable
                    key={t.id}
                    onPress={() => navigation && navigation.navigate('Detail', { todoId: t.id })}
                    style={{
                      flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10,
                      borderBottomWidth: i < todayTodos.length - 1 ? 0.5 : 0,
                      borderBottomColor: COLORS.border,
                    }}>
                    <View style={{
                      width: 3, height: 32, borderRadius: 2, backgroundColor: c.color,
                    }} />
                    <View style={{ flex: 1 }}>
                      <Text style={{
                        fontFamily: FONTS.bodyMedium, fontSize: 14, color: COLORS.textPrimary,
                        textDecorationLine: t.completed ? 'line-through' : 'none',
                        opacity: t.completed ? 0.55 : 1,
                      }}>{t.text}</Text>
                      <Text style={{ fontSize: 12, color: COLORS.textMuted }}>{c.name}</Text>
                    </View>
                  </Pressable>
                );
              })
            )}
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
