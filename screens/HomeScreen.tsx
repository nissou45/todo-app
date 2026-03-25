import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Header from '../components/Header';
import TodoRow from '../components/TodoRow';
import { CATEGORIES, STORAGE_KEY } from '../constants/theme';
import { formatDate } from '../utils/dateHelpers';
import { getStyles } from '../constants/styles';
import { Todo, ColorScheme, NavigateFn } from '../types';

interface HomeScreenProps {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  navigate: NavigateFn;
  isDark: boolean;
  C: ColorScheme;
}

export default function HomeScreen({ todos, setTodos, navigate, isDark, C }: HomeScreenProps) {
  const styles = getStyles(isDark, C);
  const [inputText, setInputText] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [selectedCat, setSelectedCat] = useState(CATEGORIES[0].id);
  const [filterCat, setFilterCat] = useState('all');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());

  const save = (next: Todo[]) =>
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));

  const addTodo = () => {
    if (!inputText.trim()) return;
    const next: Todo[] = [
      ...todos,
      {
        id: Date.now().toString(),
        text: inputText.trim(),
        completed: false,
        categoryId: selectedCat,
        dueDate: dueDate ? dueDate.toISOString() : null,
      },
    ];
    setTodos(next);
    save(next);
    setInputText('');
    setDueDate(null);
  };

  const toggleTodo = (id: string) => {
    const next = todos.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t,
    );
    setTodos(next);
    save(next);
  };

  const deleteTodo = (id: string) =>
    Alert.alert('Supprimer', 'Confirmer ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: () => {
          const next = todos.filter((t) => t.id !== id);
          setTodos(next);
          save(next);
        },
      },
    ]);

  const filtered = todos.filter((t) => {
    const matchStatus =
      filter === 'active'
        ? !t.completed
        : filter === 'completed'
          ? t.completed
          : true;
    const matchCat = filterCat === 'all' || t.categoryId === filterCat;
    return matchStatus && matchCat;
  });

  const remaining = todos.filter((t) => !t.completed).length;
  const activeCat =
    CATEGORIES.find((c) => c.id === selectedCat) || CATEGORIES[0];

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Header
        title="Mes tâches"
        C={C}
        onRight={() => navigate('categories')}
        rightLabel="⚙ Catégories"
      />

      <View style={styles.statsRow}>
        <Text style={styles.subtitle}>
          {remaining === 0 ? 'Tout est fait !' : `${remaining} à compléter`}
        </Text>
        <View style={styles.statsCircle}>
          <Text style={styles.statsNum}>
            {todos.filter((t) => t.completed).length}
          </Text>
          <Text style={styles.statsLabel}>faites</Text>
        </View>
      </View>

      <View style={styles.inputCard}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Nouvelle tâche..."
          placeholderTextColor={C.textMuted}
          onSubmitEditing={addTodo}
          returnKeyType="done"
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 10 }}
          contentContainerStyle={{ gap: 6 }}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setSelectedCat(cat.id)}
              style={[
                styles.catPill,
                selectedCat === cat.id
                  ? { backgroundColor: cat.color }
                  : { backgroundColor: isDark ? '#2A2A42' : cat.bg },
              ]}
            >
              <Text
                style={[
                  styles.catPillText,
                  { color: selectedCat === cat.id ? '#fff' : cat.color },
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={styles.inputBottom}>
          <TouchableOpacity
            onPress={() => setShowPicker(true)}
            style={[
              styles.datePill,
              dueDate && {
                backgroundColor: activeCat.color + '22',
                borderColor: activeCat.color,
              },
            ]}
          >
            <Text
              style={[
                styles.datePillText,
                { color: dueDate ? activeCat.color : C.textMuted },
              ]}
            >
              {dueDate ? `📅 ${formatDate(dueDate)}` : '+ Date'}
            </Text>
          </TouchableOpacity>
          {dueDate && (
            <TouchableOpacity onPress={() => setDueDate(null)}>
              <Text style={{ color: C.textMuted, fontSize: 13 }}>✕</Text>
            </TouchableOpacity>
          )}
          <View style={{ flex: 1 }} />
          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: activeCat.color }]}
            onPress={addTodo}
          >
            <Text style={styles.addBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

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
            <TouchableOpacity
              onPress={() => setShowPicker(false)}
              style={styles.pickerCancel}
            >
              <Text style={{ color: C.textMuted, fontWeight: '500' }}>
                Annuler
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setDueDate(tempDate);
                setShowPicker(false);
              }}
              style={[
                styles.pickerConfirm,
                { backgroundColor: activeCat.color },
              ]}
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>
                Confirmer
              </Text>
            </TouchableOpacity>
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
            if (date) setDueDate(date);
          }}
        />
      )}

      <View style={styles.filterRow}>
        {(['all', 'active', 'completed'] as const).map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={[styles.filterTab, filter === f && styles.filterTabActive]}
          >
            <Text
              style={[
                styles.filterTabText,
                filter === f && styles.filterTabTextActive,
              ]}
            >
              {f === 'all' ? 'Tout' : f === 'active' ? 'En cours' : 'Terminé'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 8 }}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 6 }}
      >
        <TouchableOpacity
          onPress={() => setFilterCat('all')}
          style={[
            styles.catPill,
            filterCat === 'all'
              ? { backgroundColor: isDark ? '#EDE8E0' : '#1A1220' }
              : { backgroundColor: isDark ? '#2A2A42' : '#E8E0D8' },
          ]}
        >
          <Text
            style={[
              styles.catPillText,
              {
                color:
                  filterCat === 'all'
                    ? isDark
                      ? '#1A1220'
                      : '#EDE8E0'
                    : C.textMuted,
              },
            ]}
          >
            Toutes
          </Text>
        </TouchableOpacity>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            onPress={() => setFilterCat(cat.id)}
            style={[
              styles.catPill,
              filterCat === cat.id
                ? { backgroundColor: cat.color }
                : { backgroundColor: isDark ? '#2A2A42' : cat.bg },
            ]}
          >
            <Text
              style={[
                styles.catPillText,
                { color: filterCat === cat.id ? '#fff' : cat.color },
              ]}
            >
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
        renderItem={({ item }) => (
          <TodoRow
            item={item}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onPress={(todo) => navigate('detail', todo)}
            C={C}
            styles={styles}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>○</Text>
            <Text style={styles.emptyText}>Aucune tâche ici</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
