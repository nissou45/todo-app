import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Header from '../components/Header';
import TodoRow from '../components/TodoRow';
import { CATEGORIES } from '../constants/theme';
import { formatDate } from '../utils/dateHelpers';
import { getStyles } from '../constants/styles';
import { Todo, ColorScheme, RootStackParamList } from '../types';
import { useNotifications } from '../hooks/useNotifications';

import { User } from '@supabase/supabase-js';
import { useAuth } from '../hooks/useAuth';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'> & {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  isDark: boolean;
  C: ColorScheme;
  user: User | null;
};

import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';

import SearchBar from '../components/SearchBar';

export default function HomeScreen({ navigation, todos, setTodos, isDark, C, user }: Props) {
  const styles = getStyles(isDark, C);
  const { signOut } = useAuth();
  const { scheduleTodoNotification, cancelTodoNotification } = useNotifications();
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [selectedCat, setSelectedCat] = useState(CATEGORIES[0].id);
  const [filterCat, setFilterCat] = useState('all');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());

  const onDragEnd = ({ data }: { data: Todo[] }) => {
    // Si on a des filtres actifs, le réordonnancement est complexe.
    // Pour simplifier, on ne permet le drag que si "Tout" est sélectionné.
    if (filter !== 'all' || filterCat !== 'all') return;
    setTodos(data);
  };

  const addTodo = async () => {
    if (!inputText.trim()) return;
    const now = new Date().toISOString();
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: inputText.trim(),
      completed: false,
      categoryId: selectedCat,
      dueDate: dueDate ? dueDate.toISOString() : null,
      reminderEnabled: !!dueDate,
      updatedAt: now,
    };
    const next = [...todos, newTodo];
    setTodos(next);
    setInputText('');
    setDueDate(null);

    if (newTodo.reminderEnabled) {
      await scheduleTodoNotification(newTodo);
    }
  };

  const toggleTodo = async (id: string) => {
    const now = new Date().toISOString();
    const next = todos.map((t) => {
      if (t.id === id) {
        const updated = { ...t, completed: !t.completed, updatedAt: now };
        if (updated.completed) {
          cancelTodoNotification(id);
        } else if (updated.reminderEnabled) {
          scheduleTodoNotification(updated);
        }
        return updated;
      }
      return t;
    });
    setTodos(next);
  };

  const handleProfilePress = () => {
    if (user) {
      Alert.alert('Profil', `Connecté en tant que ${user.email}`, [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Se déconnecter', style: 'destructive', onPress: signOut },
      ]);
    } else {
      navigation.navigate('Auth');
    }
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
          cancelTodoNotification(id);
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
    const matchSearch = t.text.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchCat && matchSearch;
  });

  const remaining = todos.filter((t) => !t.completed).length;
  const activeCat =
    CATEGORIES.find((c) => c.id === selectedCat) || CATEGORIES[0];

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Header
        title="Mes tâches"
        C={C}
        onLeft={handleProfilePress}
        leftLabel={user ? '👤' : '🔑'}
        onRight={() => navigation.navigate('Categories')}
        rightLabel="⚙ Catégories"
      />

      <Pressable
        style={styles.statsRow}
        onPress={() => navigation.navigate('Stats')}
      >
        <View>
          <Text style={styles.subtitle}>
            {remaining === 0 ? 'Tout est fait !' : `${remaining} à compléter`}
          </Text>
          <Text style={{ fontSize: 11, color: '#7C3AED', fontWeight: '600', marginTop: 2 }}>
            Voir les stats ›
          </Text>
        </View>
        <View style={styles.statsCircle}>
          <Text style={styles.statsNum}>
            {todos.filter((t) => t.completed).length}
          </Text>
          <Text style={styles.statsLabel}>faites</Text>
        </View>
      </Pressable>

      <SearchBar value={searchQuery} onChangeText={setSearchQuery} C={C} />

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
            <Pressable
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
            </Pressable>
          ))}
        </ScrollView>
        <View style={styles.inputBottom}>
          <Pressable
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
          </Pressable>
          {dueDate && (
            <Pressable onPress={() => setDueDate(null)}>
              <Text style={{ color: C.textMuted, fontSize: 13 }}>✕</Text>
            </Pressable>
          )}
          <View style={{ flex: 1 }} />
          <Pressable
            style={[styles.addBtn, { backgroundColor: activeCat.color }]}
            onPress={addTodo}
          >
            <Text style={styles.addBtnText}>+</Text>
          </Pressable>
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
            if (date) setDueDate(date);
          }}
        />
      )}

      <View style={styles.filterRow}>
        {(['all', 'active', 'completed'] as const).map((f) => (
          <Pressable
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
          </Pressable>
        ))}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 8 }}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 6 }}
      >
        <Pressable
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
        </Pressable>
        {CATEGORIES.map((cat) => (
          <Pressable
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
          </Pressable>
        ))}
      </ScrollView>

      <DraggableFlatList
        data={filtered}
        onDragEnd={onDragEnd}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
        renderItem={({ item, drag, isActive }: RenderItemParams<Todo>) => (
          <TodoRow
            item={item}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onPress={(todo) => navigation.navigate('Detail', { todoId: todo.id })}
            drag={drag}
            isActive={isActive}
            searchQuery={searchQuery}
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
