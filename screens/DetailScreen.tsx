import React, { useState } from 'react';
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
import Header from '../components/Header';
import { CATEGORIES } from '../constants/theme';
import { formatDate } from '../utils/dateHelpers';
import { getStyles } from '../constants/styles';
import { Todo, ColorScheme, RootStackParamList } from '../types';
import { useNotifications } from '../hooks/useNotifications';

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'> & {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  isDark: boolean;
  C: ColorScheme;
};

import PomodoroTimer from '../components/PomodoroTimer';

export default function DetailScreen({ route, navigation, todos, setTodos, isDark, C }: Props) {
  const { todoId } = route.params;
  const todo = todos.find((t) => t.id === todoId);
  const styles = getStyles(isDark, C);
  const { scheduleTodoNotification, cancelTodoNotification } = useNotifications();

  if (!todo) {
    navigation.goBack();
    return null;
  }

  const [text, setText] = useState(todo.text);
  const [categoryId, setCategoryId] = useState(todo.categoryId || '1');
  const [dueDate, setDueDate] = useState<Date | null>(
    todo.dueDate ? new Date(todo.dueDate) : null,
  );
  const [reminderEnabled, setReminderEnabled] = useState(todo.reminderEnabled);
  const [pomodoroCount, setPomodoroCount] = useState(todo.pomodoroCount || 0);
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState(dueDate || new Date());

  const handlePomodoroComplete = () => {
    setPomodoroCount((prev) => prev + 1);
    // On pourrait sauvegarder immédiatement ici aussi
  };

  const save = async () => {
    const updatedTodo: Todo = {
      ...todo,
      text,
      categoryId,
      dueDate: dueDate ? dueDate.toISOString() : null,
      reminderEnabled,
      pomodoroCount,
      updatedAt: new Date().toISOString(),
    };

    const next = todos.map((t) => (t.id === todo.id ? updatedTodo : t));
    setTodos(next);

    // Gérer les notifications
    if (updatedTodo.completed) {
      await cancelTodoNotification(todo.id);
    } else {
      await scheduleTodoNotification(updatedTodo);
    }

    navigation.goBack();
  };

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
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Header
        title="Détail"
        onBack={() => navigation.goBack()}
        onRight={save}
        rightLabel="Sauvegarder"
        C={C}
      />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.detailLabel}>Tâche</Text>
        <TextInput
          style={styles.detailInput}
          value={text}
          onChangeText={setText}
          multiline
          placeholderTextColor={C.textMuted}
        />

        <Text style={styles.detailLabel}>Catégorie</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {CATEGORIES.map((c) => (
            <Pressable
              key={c.id}
              onPress={() => setCategoryId(c.id)}
              style={[
                styles.catPill,
                categoryId === c.id
                  ? { backgroundColor: c.color }
                  : { backgroundColor: isDark ? '#2A2A42' : c.bg },
              ]}
            >
              <Text
                style={[
                  styles.catPillText,
                  { color: categoryId === c.id ? '#fff' : c.color },
                ]}
              >
                {c.name}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.detailLabel}>Date d'échéance</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <Pressable
            onPress={() => setShowPicker(true)}
            style={[
              styles.datePill,
              { flex: 1 },
              dueDate && { borderColor: cat.color },
            ]}
          >
            <Text
              style={[
                styles.datePillText,
                { color: dueDate ? cat.color : C.textMuted },
              ]}
            >
              {dueDate ? `📅 ${formatDate(dueDate)}` : '+ Ajouter une date'}
            </Text>
          </Pressable>
          {dueDate && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ color: C.text, fontSize: 13 }}>Rappel</Text>
              <Switch
                value={reminderEnabled}
                onValueChange={setReminderEnabled}
                trackColor={{ false: C.border, true: cat.color + '88' }}
                thumbColor={reminderEnabled ? cat.color : '#f4f3f4'}
              />
            </View>
          )}
        </View>

        {dueDate && (
          <Pressable onPress={() => { setDueDate(null); setReminderEnabled(false); }}>
            <Text style={{ color: C.textMuted, fontSize: 13, marginBottom: 20 }}>
              Supprimer la date
            </Text>
          </Pressable>
        )}

        {showPicker && Platform.OS === 'ios' && (
          <View style={styles.pickerCard}>
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
            <View style={styles.pickerBtns}>
              <Pressable
                onPress={() => setShowPicker(false)}
                style={styles.pickerCancel}
              >
                <Text style={{ color: C.textMuted, fontWeight: '500' }}>
                  Annuler
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setDueDate(tempDate);
                  if (!reminderEnabled) setReminderEnabled(true);
                  setShowPicker(false);
                }}
                style={[styles.pickerConfirm, { backgroundColor: cat.color }]}
              >
                <Text style={{ color: '#fff', fontWeight: '600' }}>
                  Confirmer
                </Text>
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
              if (date) {
                setDueDate(date);
                if (!reminderEnabled) setReminderEnabled(true);
              }
            }}
          />
        )}

        <Text style={styles.detailLabel}>Mode Pomodoro</Text>
        <View style={{ marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ fontSize: 16 }}>🍅</Text>
          <Text style={{ color: C.text, fontWeight: '600' }}>{pomodoroCount} sessions terminées</Text>
        </View>
        <PomodoroTimer onSessionComplete={handlePomodoroComplete} C={C} isDark={isDark} />

        <Text style={styles.detailLabel}>Statut</Text>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: todo.completed ? '#04784722' : '#7C3AED22',
              marginBottom: 32,
            },
          ]}
        >
          <Text
            style={{
              color: todo.completed ? '#047857' : '#7C3AED',
              fontWeight: '600',
              fontSize: 13,
            }}
          >
            {todo.completed ? '✓ Terminée' : '○ En cours'}
          </Text>
        </View>

        <Pressable
          style={[styles.saveBtn, { backgroundColor: cat.color }]}
          onPress={save}
        >
          <Text style={styles.saveBtnText}>Enregistrer</Text>
        </Pressable>

        <Pressable style={styles.deleteBtn} onPress={deleteTodo}>
          <Text style={styles.deleteBtnText}>Supprimer la tâche</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
