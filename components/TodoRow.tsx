import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { CATEGORIES } from '../constants/theme';
import { formatDate, isOverdue } from '../utils/dateHelpers';
import { Todo, ColorScheme } from '../types';
import { StyleSheet } from 'react-native';

interface TodoRowProps {
  item: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onPress: (todo: Todo) => void;
  C: ColorScheme;
  styles: ReturnType<typeof StyleSheet.create>;
}

export default function TodoRow({ item, onToggle, onDelete, onPress, C, styles }: TodoRowProps) {
  const swipeRef = useRef<Swipeable>(null);
  const cat = CATEGORIES.find((c) => c.id === item.categoryId) || CATEGORIES[0];
  const overdue = !item.completed && isOverdue(item.dueDate);

  const renderRightActions = (_progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>) => {
    const scale = dragX.interpolate({
      inputRange: [-90, 0],
      outputRange: [1, 0.5],
      extrapolate: 'clamp',
    });
    return (
      <TouchableOpacity
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
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable
      ref={swipeRef}
      renderRightActions={renderRightActions}
      rightThreshold={40}
      overshootRight={false}
      friction={2}
    >
      <TouchableOpacity onPress={() => onPress(item)} activeOpacity={0.8}>
        <View style={[styles.todoCard, overdue && styles.overdueCard]}>
          <View style={[styles.catStripe, { backgroundColor: cat.color }]} />
          <TouchableOpacity
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
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={[styles.todoText, item.completed && styles.done]}>
              {item.text}
            </Text>
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
          <Text style={{ color: C.textMuted, fontSize: 20 }}>›</Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
}
