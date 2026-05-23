import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Platform,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Icon from '../components/Icon';
import { CATEGORIES, COLORS, getCategory } from '../constants/colors';
import { FONTS } from '../constants/typography';
import { SHADOWS } from '../constants/shadows';
import { formatDate } from '../utils/dateHelpers';
import { getStyles } from '../constants/styles';
import { Todo, ColorScheme, RootStackParamList } from '../types';
import { useNotifications } from '../hooks/useNotifications';
import PomodoroTimer from '../components/PomodoroTimer';

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'> & {
  todos: Todo[];
  setTodos: (todos: Todo[] | ((prev: Todo[]) => Todo[])) => void;
  isDark: boolean;
  C: ColorScheme;
};

function MetaPill({ icon, label, value, color }: { icon: string; label: string; value: string; color?: string }): JSX.Element {
  return (
    <View style={[{
      flex: 1, padding: 14,
      backgroundColor: COLORS.surface, borderRadius: 16,
      borderWidth: 1, borderColor: COLORS.border,
    }, SHADOWS.sm]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Icon name={icon} size={12} color={color || COLORS.textMuted} />
        <Text style={{
          fontFamily: FONTS.bodyMedium, fontSize: 10,
          letterSpacing: 1, textTransform: 'uppercase', color: COLORS.textMuted,
        }}>{label}</Text>
      </View>
      <Text style={{
        marginTop: 6, fontFamily: FONTS.bodyMedium, fontSize: 14,
        color: color || COLORS.textPrimary,
      }} numberOfLines={1}>{value}</Text>
    </View>
  );
}

export default function DetailScreen({ route, navigation, todos, setTodos, isDark, C }: Props): JSX.Element | null {
  const { todoId } = route.params;
  const todo = todos.find((t) => t.id === todoId);
  const styles = getStyles(isDark, C);
  const { scheduleTodoNotification, cancelTodoNotification } = useNotifications();

  useEffect(() => {
    if (!todo) navigation.goBack();
  }, [todo, navigation]);

  const [text, setText] = useState(todo?.text ?? '');
  const [categoryId, setCategoryId] = useState<string>(todo?.categoryId || CATEGORIES[0].id);
  const [dueDate, setDueDate] = useState<Date | null>(
    todo?.dueDate ? new Date(todo.dueDate) : null,
  );
  const [reminderEnabled, setReminderEnabled] = useState(todo?.reminderEnabled ?? false);
  const [pomodoroCount, setPomodoroCount] = useState(todo?.pomodoroCount || 0);
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState(dueDate || new Date());

  if (!todo) return null;

  const cat = getCategory(categoryId);

  const handlePomodoroComplete = useCallback(() => {
    setPomodoroCount((prev) => prev + 1);
  }, []);

  const save = useCallback(async () => {
    if (!todo) return;
    const updatedTodo: Todo = {
      ...todo,
      text,
      categoryId,
      dueDate: dueDate ? dueDate.toISOString() : null,
      reminderEnabled,
      pomodoroCount,
      updatedAt: new Date().toISOString(),
    };

    setTodos(todos.map((t) => (t.id === todo.id ? updatedTodo : t)));

    if (updatedTodo.completed) {
      await cancelTodoNotification(todo.id);
    } else {
      await scheduleTodoNotification(updatedTodo);
    }

    navigation.goBack();
  }, [todo, todos, text, categoryId, dueDate, reminderEnabled, pomodoroCount, setTodos, cancelTodoNotification, scheduleTodoNotification, navigation]);

  const deleteTodo = () =>
    Alert.alert('Supprimer', 'Confirmer ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          const next = todos.filter((t) => t.id !== todo.id);
          setTodos(next);
          await cancelTodoNotification(todo.id);
          navigation.goBack();
        },
      },
    ]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 130 }} showsVerticalScrollIndicator={false}>
        {/* Top nav */}
        <View style={{
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          paddingHorizontal: 16, paddingTop: 8,
        }}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={[{
              width: 40, height: 40, borderRadius: 20,
              backgroundColor: COLORS.surface,
              borderWidth: 1, borderColor: COLORS.border,
              alignItems: 'center', justifyContent: 'center',
            }, SHADOWS.sm]}>
            <Icon name="chevronL" size={18} color={COLORS.textSecondary} />
          </Pressable>

          <View style={{
            flexDirection: 'row', alignItems: 'center', gap: 6,
            paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18,
            backgroundColor: cat.color + '24',
          }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: cat.color }} />
            <Text style={{ fontFamily: FONTS.bodyMedium, fontSize: 12, color: COLORS.textPrimary }}>
              {cat.name}
            </Text>
          </View>

          <Pressable onPress={deleteTodo} style={{
            width: 40, height: 40, borderRadius: 20,
            backgroundColor: COLORS.surface,
            borderWidth: 1, borderColor: COLORS.border,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="x" size={18} color={COLORS.textSecondary} />
          </Pressable>
        </View>

        {/* Title */}
        <View style={{ paddingHorizontal: 24, paddingTop: 20 }}>
          <TextInput
            value={text}
            onChangeText={setText}
            multiline
            style={{
              fontFamily: FONTS.display, fontSize: 30, lineHeight: 33,
              color: COLORS.titleDetail, letterSpacing: -0.4,
              padding: 0,
            }}
            placeholderTextColor={COLORS.textMuted}
          />
        </View>

        {/* Meta pills */}
        <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingTop: 24 }}>
          <MetaPill icon="calendar" label="Échéance"
            value={dueDate ? formatDate(dueDate) || 'Définir' : 'Définir'}
            color={dueDate ? cat.color : undefined} />
          <MetaPill icon="clock" label="Statut"
            value={todo.completed ? 'Terminée' : 'En cours'}
            color={todo.completed ? COLORS.done : cat.color} />
          <MetaPill icon="repeat" label="Pomodoro"
            value={`${pomodoroCount} sessions`} />
        </View>

        {/* Date picker + reminder */}
        <View style={{ paddingHorizontal: 24, paddingTop: 20 }}>
          <Text style={{
            fontFamily: FONTS.bodyMedium, fontSize: 11,
            letterSpacing: 1.4, textTransform: 'uppercase', color: COLORS.textMuted,
          }}>Date d'échéance</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8 }}>
            <Pressable
              onPress={() => setShowPicker(true)}
              style={{
                flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8,
                paddingHorizontal: 14, paddingVertical: 10,
                borderRadius: 14, backgroundColor: COLORS.surface,
                borderWidth: 1, borderColor: dueDate ? cat.color : COLORS.border,
              }}>
              <Icon name="calendar" size={16} color={dueDate ? cat.color : COLORS.textMuted} />
              <Text style={{
                fontFamily: FONTS.bodyMedium, fontSize: 13,
                color: dueDate ? cat.color : COLORS.textMuted,
              }}>{dueDate ? formatDate(dueDate) : '+ Ajouter une date'}</Text>
            </Pressable>
            {dueDate && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ fontFamily: FONTS.body, fontSize: 13, color: COLORS.textMuted }}>Rappel</Text>
                <Switch
                  value={reminderEnabled}
                  onValueChange={setReminderEnabled}
                  trackColor={{ false: COLORS.border, true: cat.color + '88' }}
                  thumbColor={reminderEnabled ? cat.color : '#f4f3f4'}
                />
              </View>
            )}
          </View>
        </View>

        {showPicker && Platform.OS === 'ios' && (
          <View style={[{
            marginHorizontal: 16, marginTop: 12,
            backgroundColor: COLORS.surface, borderRadius: 18,
            borderWidth: 1, borderColor: COLORS.border, padding: 12,
          }, SHADOWS.sm]}>
            <DateTimePicker
              value={tempDate}
              mode="date"
              display="inline"
              minimumDate={new Date()}
              onChange={(_e: DateTimePickerEvent, date?: Date) => {
                if (date) setTempDate(date);
              }}
              themeVariant={isDark ? 'dark' : 'light'}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
              <Pressable
                onPress={() => setShowPicker(false)}
                style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, backgroundColor: COLORS.surface2 }}>
                <Text style={{ fontFamily: FONTS.bodyMedium, fontSize: 13, color: COLORS.textMuted }}>Annuler</Text>
              </Pressable>
              <Pressable
                onPress={() => { setDueDate(tempDate); if (!reminderEnabled) setReminderEnabled(true); setShowPicker(false); }}
                style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, backgroundColor: cat.color }}>
                <Text style={{ fontFamily: FONTS.bodyMedium, fontSize: 13, color: '#FFFFFF' }}>Confirmer</Text>
              </Pressable>
            </View>
          </View>
        )}
        {showPicker && Platform.OS === 'android' && (
          <DateTimePicker
            value={tempDate}
            mode="date"
            display="default"
            minimumDate={new Date()}
            onChange={(_e: DateTimePickerEvent, date?: Date) => {
              setShowPicker(false);
              if (date) { setDueDate(date); if (!reminderEnabled) setReminderEnabled(true); }
            }}
          />
        )}

        {/* Category selector */}
        <View style={{ paddingHorizontal: 24, paddingTop: 24 }}>
          <Text style={{
            fontFamily: FONTS.bodyMedium, fontSize: 11,
            letterSpacing: 1.4, textTransform: 'uppercase', color: COLORS.textMuted,
          }}>Catégorie</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
            {CATEGORIES.map((c) => (
              <Pressable
                key={c.id}
                onPress={() => setCategoryId(c.id)}
                style={({ pressed }) => ({
                  paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18,
                  backgroundColor: categoryId === c.id ? c.color : COLORS.surface,
                  borderWidth: 1, borderColor: categoryId === c.id ? c.color : COLORS.border,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                  ...(categoryId === c.id ? SHADOWS.tinted(c.color) : {}),
                })}>
                <Text style={{
                  fontFamily: FONTS.bodyMedium, fontSize: 13,
                  color: categoryId === c.id ? '#FFFFFF' : c.color,
                }}>{c.name}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Pomodoro */}
        <View style={{ paddingHorizontal: 24, paddingTop: 24 }}>
          <Text style={{
            fontFamily: FONTS.bodyMedium, fontSize: 11,
            letterSpacing: 1.4, textTransform: 'uppercase', color: COLORS.textMuted,
          }}>Mode Pomodoro</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10, marginBottom: 4 }}>
            <Text style={{ fontSize: 16 }}>🍅</Text>
            <Text style={{ fontFamily: FONTS.bodySemi, fontSize: 14, color: COLORS.textPrimary }}>
              {pomodoroCount} sessions terminées
            </Text>
          </View>
          <PomodoroTimer onSessionComplete={handlePomodoroComplete} />
        </View>

        {/* Actions */}
        <View style={{ paddingVertical: 24, paddingHorizontal: 16 }}>
          <Pressable
            onPress={save}
            style={({ pressed }) => ({
              height: 56, borderRadius: 28,
              backgroundColor: COLORS.accent,
              alignItems: 'center', justifyContent: 'center',
              flexDirection: 'row', gap: 8,
              transform: [{ scale: pressed ? 0.97 : 1 }],
              ...SHADOWS.tinted(COLORS.accent),
            })}>
            <Icon name="check" size={20} color="#FFFFFF" strokeWidth={2.4} />
            <Text style={{ fontFamily: FONTS.bodySemi, fontSize: 15, color: '#FFFFFF' }}>
              Enregistrer
            </Text>
          </Pressable>

          <Pressable
            onPress={deleteTodo}
            style={({ pressed }) => ({
              marginTop: 10, height: 56, borderRadius: 28,
              backgroundColor: COLORS.surface,
              borderWidth: 1, borderColor: COLORS.red + '44',
              alignItems: 'center', justifyContent: 'center',
              flexDirection: 'row', gap: 8,
              transform: [{ scale: pressed ? 0.97 : 1 }],
            })}>
            <Icon name="x" size={18} color={COLORS.red} />
            <Text style={{ fontFamily: FONTS.bodySemi, fontSize: 15, color: COLORS.red }}>
              Supprimer la tâche
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
