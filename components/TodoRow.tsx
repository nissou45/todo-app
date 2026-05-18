import React, { useRef } from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { CATEGORIES } from '../constants/theme';
import { formatDate, isOverdue } from '../utils/dateHelpers';
import { Todo, ColorScheme } from '../types';
import { StyleSheet } from 'react-native';

interface TodoRowProps {
  item: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onPress: (todo: Todo) => void;
  drag?: () => void;
  isActive?: boolean;
  searchQuery?: string;
  C: ColorScheme;
  styles: ReturnType<typeof StyleSheet.create>;
}

export default function TodoRow({ item, onToggle, onDelete, onPress, drag, isActive, searchQuery, C, styles }: TodoRowProps) {
  const swipeRef = useRef<Swipeable>(null);
  const cat = CATEGORIES.find((c) => c.id === item.categoryId) || CATEGORIES[0];
  const overdue = !item.completed && isOverdue(item.dueDate);

  const renderText = () => {
    if (!searchQuery || !item.text.toLowerCase().includes(searchQuery.toLowerCase())) {
      return <Text style={[styles.todoText, item.completed && styles.done]}>{item.text}</Text>;
    }

    const parts = item.text.split(new RegExp(`(${searchQuery})`, 'gi'));
    return (
      <Text style={[styles.todoText, item.completed && styles.done]}>
        {parts.map((part, i) =>
          part.toLowerCase() === searchQuery.toLowerCase() ? (
            <Text key={i} style={{ backgroundColor: '#7C3AED44', color: '#7C3AED', fontWeight: '700' }}>
              {part}
            </Text>
          ) : (
            part
          )
        )}
      </Text>
    );
  };

  const renderRightActions = (_progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>) => {
    const scale = dragX.interpolate({
      inputRange: [-90, 0],
      outputRange: [1, 0.5],
      extrapolate: 'clamp',
    });
    return (
      <Pressable
        style={styles.deleteAction}
        onPress={() => {
          swipeRef.current?.close();
          onDelete(item.id);
        }}
      >
        <Animated.Text
          style={[styles.deleteActionText, { transform: [{ scale }] }]}
        >
          Supprimer
        </Animated.Text>
      </Pressable>
    );
  };

  return (
    <Swipeable
      ref={swipeRef}
      renderRightActions={renderRightActions}
      rightThreshold={40}
      overshootRight={false}
      friction={2}
      enabled={!isActive} // Désactive le swipe pendant le drag
    >
      <Pressable
        onPress={() => onPress(item)}
        onLongPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          drag?.();
        }}
        delayLongPress={200}
        activeOpacity={0.8}
      >
        <View style={[
          styles.todoCard,
          overdue && styles.overdueCard,
          isActive && { opacity: 0.5, scale: 1.02, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 }
        ]}>
          <View style={[styles.catStripe, { backgroundColor: cat.color }]} />
          <Pressable
            onPress={() => onToggle(item.id)}
            style={[
              styles.checkbox,
              { borderColor: cat.color },
              item.completed && { backgroundColor: cat.color },
            ]}
          >
            {item.completed && (
              <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>
                ✓
              </Text>
            )}
          </Pressable>
          <View style={{ flex: 1 }}>
            {renderText()}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                marginTop: 4,
              }}
            >
              <Text style={[styles.catLabel, { color: cat.color }]}>
                {cat.name}
              </Text>
              {item.dueDate && (
                <Text
                  style={[
                    styles.dateLabel,
                    { color: overdue ? '#EF4444' : C.textMuted },
                  ]}
                >
                  {overdue ? '⚠ ' : ''}
                  {formatDate(item.dueDate)}
                </Text>
              )}
            </View>
          </View>
          <Text style={{ color: C.textMuted, fontSize: 20 }}>☰</Text>
        </View>
      </Pressable>
    </Swipeable>
  );
}
