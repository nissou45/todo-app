import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '../components/Icon';
import Chip from '../components/Chip';
import FAB from '../components/FAB';
import TabBar from '../components/TabBar';
import { CATEGORIES, COLORS } from '../constants/colors';
import { FONTS } from '../constants/typography';
import { SHADOWS } from '../constants/shadows';
import { formatDate } from '../utils/dateHelpers';
import { getStyles } from '../constants/styles';
import { Todo, ColorScheme, RootStackParamList } from '../types';
import { useNotifications } from '../hooks/useNotifications';
import { User } from '@supabase/supabase-js';
import { useAuth } from '../hooks/useAuth';
import TodoRow from '../components/TodoRow';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'> & {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  isDark: boolean;
  C: ColorScheme;
  user: User | null;
};

type Period = 'matin' | 'aprem' | 'soir' | 'none';

function getPeriod(t: Todo): Period {
  if (!t.dueDate) return 'none';
  const h = new Date(t.dueDate).getHours();
  if (h < 12) return 'matin';
  if (h < 17) return 'aprem';
  return 'soir';
}

const PERIOD_META: Record<Period, { label: string; emoji: string }> = {
  matin: { label: 'Matin', emoji: '☀️' },
  aprem: { label: 'Après-midi', emoji: '🌤️' },
  soir: { label: 'Soir', emoji: '🌙' },
  none: { label: 'Sans date', emoji: '📌' },
};

function TimeSection({ period, tasks, onToggle, onDelete, onPress, C, styles }: {
  period: Period;
  tasks: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onPress: (todo: Todo) => void;
  C: ColorScheme;
  styles: ReturnType<typeof getStyles>;
}) {
  if (!tasks.length) return null;
  const meta = PERIOD_META[period];
  const doneCount = tasks.filter(t => t.completed).length;
  return (
    <View style={{ marginTop: 18 }}>
      <View style={{
        flexDirection: 'row', alignItems: 'center', gap: 8,
        paddingHorizontal: 24, paddingBottom: 10,
      }}>
        <Text style={{ fontSize: 16 }}>{meta.emoji}</Text>
        <Text style={{
          fontFamily: FONTS.bodyMedium, fontSize: 11,
          letterSpacing: 1.4, color: COLORS.textMuted,
          textTransform: 'uppercase',
        }}>{meta.label}</Text>
        <Text style={{ marginLeft: 'auto', fontSize: 11, color: COLORS.textMuted }}>
          {doneCount}/{tasks.length}
        </Text>
      </View>
      <View style={[{
        marginHorizontal: 16, backgroundColor: COLORS.surface,
        borderRadius: 22, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden',
      }, SHADOWS.sm]}>
        {tasks.map(t => (
          <TodoRow
            key={t.id}
            item={t}
            onToggle={onToggle}
            onDelete={onDelete}
            onPress={onPress}
            C={C}
            styles={styles}
          />
        ))}
      </View>
    </View>
  );
}

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
      pomodoroCount: 0,
      priority: false,
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

  const filtered = useMemo(() =>
    todos.filter((t) => {
      const matchStatus =
        filter === 'active' ? !t.completed
          : filter === 'completed' ? t.completed
            : true;
      const matchCat = filterCat === 'all' || t.categoryId === filterCat;
      const matchSearch = t.text.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchCat && matchSearch;
    }),
    [todos, filter, filterCat, searchQuery]
  );

  const grouped = useMemo(() => {
    const groups: Record<Period, Todo[]> = { matin: [], aprem: [], soir: [], none: [] };
    for (const t of filtered) groups[getPeriod(t)].push(t);
    return groups;
  }, [filtered]);

  const remaining = todos.filter((t) => !t.completed).length;
  const doneCount = todos.filter((t) => t.completed).length;
  const activeCat = CATEGORIES.find((c) => c.id === selectedCat) || CATEGORIES[0];
  const isCompletelyEmpty = todos.length === 0 && !searchQuery && filter === 'all' && filterCat === 'all';

  const periods: Period[] = ['matin', 'aprem', 'soir', 'none'];
  const hasAnyTasks = periods.some(p => grouped[p].length > 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 130 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{
          paddingHorizontal: 24, paddingTop: 8,
          flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
        }}>
          <View>
            <Text style={{
              fontFamily: FONTS.display, fontSize: 32,
              color: COLORS.titleHome, letterSpacing: -0.5,
            }}>{new Date().toLocaleDateString('fr-FR', { weekday: 'long' }).replace(/^\w/, c => c.toUpperCase())}</Text>
            <Text style={{
              fontFamily: FONTS.bodyMedium, fontSize: 13, marginTop: 8,
              letterSpacing: 0.4, textTransform: 'uppercase', color: COLORS.textSecondary,
            }}>
              {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} · {todos.length} tâches
            </Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Pressable
              onPress={() => navigation.navigate('Calendar')}
              style={{
                width: 38, height: 38, borderRadius: 19,
                borderWidth: 1, borderColor: COLORS.border,
                alignItems: 'center', justifyContent: 'center',
              }}>
              <Icon name="calendar" size={18} color={COLORS.textSecondary} />
            </Pressable>
            <LinearGradient
              colors={['#FF6B6B', '#FFE66D']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={{
                width: 38, height: 38, borderRadius: 19,
                alignItems: 'center', justifyContent: 'center',
              }}>
              <Pressable onPress={handleProfilePress}>
                <Text style={{ fontFamily: FONTS.displayBold, fontSize: 16, color: '#fff' }}>
                  {user ? (user.email?.[0] || 'u').toLowerCase() : '?'}
                </Text>
              </Pressable>
            </LinearGradient>
          </View>
        </View>

        {/* Progress card */}
        <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
          <View style={[{
            backgroundColor: COLORS.surface, borderRadius: 22,
            borderWidth: 1, borderColor: COLORS.border, padding: 22,
          }, SHADOWS.sm]}>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
              <Text style={{ fontFamily: FONTS.display, fontSize: 34, color: COLORS.textPrimary }}>
                {doneCount}
              </Text>
              <Text style={{ fontFamily: FONTS.body, fontSize: 15, color: COLORS.textSecondary }}>
                sur {todos.length} aujourd'hui
              </Text>
            </View>
            <View style={{
              marginTop: 14, height: 6, borderRadius: 3,
              backgroundColor: COLORS.surface2, overflow: 'hidden',
            }}>
              <View style={{
                width: todos.length > 0 ? `${(doneCount / todos.length) * 100}%` : '0%',
                height: '100%', backgroundColor: COLORS.teal, borderRadius: 3,
              }} />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
              <Text style={{ fontSize: 12, color: COLORS.textMuted }}>
                {remaining} à faire
              </Text>
              <Pressable onPress={() => navigation.navigate('Stats')}>
                <Text style={{ fontSize: 12, color: COLORS.accent }}>Voir les stats →</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 20, gap: 8 }}>
          <Chip label="Tout" active={filter === 'all'} onPress={() => setFilter('all')} C={C} />
          <Chip label="En cours" active={filter === 'active'} count={remaining}
            onPress={() => setFilter('active')} C={C} />
          <Chip label="Terminé" active={filter === 'completed'} count={doneCount}
            onPress={() => setFilter('completed')} C={C} />
        </ScrollView>

        {/* Category filter chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 10, gap: 6 }}>
          <Chip label="Toutes" active={filterCat === 'all'} onPress={() => setFilterCat('all')} C={C} />
          {CATEGORIES.map((cat) => (
            <Chip key={cat.id} label={cat.name} color={cat.color}
              active={filterCat === cat.id} count={todos.filter(t => t.categoryId === cat.id).length}
              onPress={() => setFilterCat(cat.id)} C={C} />
          ))}
        </ScrollView>

        {/* Add todo input */}
        <View style={{
          marginHorizontal: 16, marginTop: 16, marginBottom: 8,
          backgroundColor: COLORS.surface, borderRadius: 22,
          borderWidth: 1, borderColor: COLORS.border, padding: 16,
        }}>
          <TextInput
            style={{
              fontFamily: FONTS.body, fontSize: 15, color: COLORS.textPrimary,
              paddingVertical: 4,
            }}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Nouvelle tâche..."
            placeholderTextColor={COLORS.textMuted}
            onSubmitEditing={addTodo}
            returnKeyType="done"
          />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 }}>
            <Pressable
              onPress={() => setShowPicker(true)}
              style={{
                paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
                borderWidth: 1, borderColor: dueDate ? activeCat.color : COLORS.border,
                backgroundColor: dueDate ? activeCat.color + '22' : 'transparent',
                flexDirection: 'row', alignItems: 'center', gap: 4,
              }}>
              <Icon name="calendar" size={12} color={dueDate ? activeCat.color : COLORS.textMuted} />
              <Text style={{
                fontFamily: FONTS.bodyMedium, fontSize: 12,
                color: dueDate ? activeCat.color : COLORS.textMuted,
              }}>{dueDate ? formatDate(dueDate) : 'Date'}</Text>
            </Pressable>
            {dueDate && (
              <Pressable onPress={() => setDueDate(null)}>
                <Icon name="x" size={14} color={COLORS.textMuted} />
              </Pressable>
            )}
            <View style={{ flex: 1 }} />
            <Pressable
              onPress={addTodo}
              style={({ pressed }) => ({
                width: 36, height: 36, borderRadius: 18,
                backgroundColor: activeCat.color,
                alignItems: 'center', justifyContent: 'center',
                transform: [{ scale: pressed ? 0.95 : 1 }],
              })}>
              <Icon name="plus" size={18} color="#FFFFFF" strokeWidth={2.2} />
            </Pressable>
          </View>
        </View>

        {/* Empty state */}
        {isCompletelyEmpty ? (
          <View style={{ alignItems: 'center', paddingTop: 20, paddingHorizontal: 24 }}>
            <View style={{ width: 180, height: 150 }}>
              <View style={[{
                position: 'absolute', top: 0, left: 40, width: 70, height: 70,
                borderRadius: 35, backgroundColor: COLORS.yellow,
              }, SHADOWS.tinted(COLORS.yellow)]} />
              <View style={[{
                position: 'absolute', bottom: 20, left: 10, width: 70, height: 55,
                borderRadius: 12, backgroundColor: COLORS.red, padding: 8, transform: [{ rotate: '-8deg' }],
              }, SHADOWS.tinted(COLORS.red)]}>
                <View style={{ width: 14, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.6)' }} />
                <View style={{ marginTop: 5, width: 30, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.6)' }} />
              </View>
              <View style={[{
                position: 'absolute', bottom: 28, right: 10, width: 70, height: 55,
                borderRadius: 12, backgroundColor: COLORS.teal, padding: 8, transform: [{ rotate: '6deg' }],
              }, SHADOWS.tinted(COLORS.teal)]}>
                <View style={{ width: 14, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.6)' }} />
                <View style={{ marginTop: 5, width: 36, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.6)' }} />
              </View>
            </View>
            <Text style={{
              marginTop: 32, fontFamily: FONTS.display, fontSize: 26,
              color: COLORS.titleHome, letterSpacing: -0.4, textAlign: 'center',
            }}>Tout est fait ! 🎉</Text>
            <Text style={{
              marginTop: 8, fontFamily: FONTS.body, fontSize: 15,
              color: COLORS.textSecondary, textAlign: 'center',
            }}>Pas de tâches pour aujourd'hui.</Text>
          </View>
        ) : !hasAnyTasks ? (
          <View style={{ alignItems: 'center', paddingTop: 40 }}>
            <Text style={{ fontFamily: FONTS.body, fontSize: 14, color: COLORS.textMuted }}>
              {searchQuery ? 'Aucun résultat' : 'Aucune tâche ici'}
            </Text>
          </View>
        ) : (
          /* Time sections */
          periods.map(p => (
            <TimeSection
              key={p}
              period={p}
              tasks={grouped[p]}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onPress={(todo) => navigation.navigate('Detail', { todoId: todo.id })}
              C={C}
              styles={styles}
            />
          ))
        )}
      </ScrollView>

      {showPicker && Platform.OS === 'ios' && (
        <View style={[{
          marginHorizontal: 16, marginBottom: 160,
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
              style={{
                paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10,
                backgroundColor: COLORS.surface2,
              }}>
              <Text style={{ fontFamily: FONTS.bodyMedium, fontSize: 13, color: COLORS.textMuted }}>Annuler</Text>
            </Pressable>
            <Pressable
              onPress={() => { setDueDate(tempDate); setShowPicker(false); }}
              style={{
                paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10,
                backgroundColor: activeCat.color,
              }}>
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
            if (date) setDueDate(date);
          }}
        />
      )}

      <FAB onPress={() => navigation && navigation.navigate('Create')} C={C} />
      <TabBar active="home" C={C} onTab={(tab) => {
        if (!navigation) return;
        if (tab === 'cats')  navigation.navigate('Categories');
        if (tab === 'stats') navigation.navigate('Stats');
        if (tab === 'me')    handleProfilePress();
      }} />
    </SafeAreaView>
  );
}
