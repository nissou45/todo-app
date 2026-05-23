import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from '../components/Icon';
import { COLORS, CATEGORIES } from '../constants/colors';
import { FONTS } from '../constants/typography';
import { SHADOWS } from '../constants/shadows';

export default function CreateScreen({ navigation }: { navigation: any }) {
  const [title, setTitle] = useState('');
  const [cat, setCat] = useState(CATEGORIES[0].id);
  const [priority, setPriority] = useState(false);

  const activeCat = CATEGORIES.find((c) => c.id === cat) || CATEGORIES[0];

  const translateY = useRef(new Animated.Value(800)).current;
  useEffect(() => {
    Animated.spring(translateY, {
      toValue: 0, friction: 9, tension: 80, useNativeDriver: true,
    }).start();
  }, []);

  const onClose = () => {
    Animated.timing(translateY, {
      toValue: 800, duration: 200, useNativeDriver: true,
    }).start(() => navigation && navigation.goBack());
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'rgba(45,55,72,0.35)' }}>
      <Pressable style={{ flex: 1 }} onPress={onClose} />

      <Animated.View style={{
        backgroundColor: COLORS.surface,
        borderTopLeftRadius: 32, borderTopRightRadius: 32,
        paddingTop: 14, paddingBottom: 32,
        maxHeight: '88%',
        transform: [{ translateY }],
        ...SHADOWS.lg,
      }}>
        <View style={{
          width: 40, height: 5, borderRadius: 3,
          backgroundColor: COLORS.border2, alignSelf: 'center',
          marginBottom: 16,
        }} />

        <View style={{
          paddingHorizontal: 24, paddingBottom: 16,
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <Pressable onPress={onClose} style={{
            width: 36, height: 36, borderRadius: 18,
            backgroundColor: COLORS.surface2,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="x" size={18} color={COLORS.textSecondary} />
          </Pressable>
          <Text style={{ fontFamily: FONTS.display, fontSize: 18, color: COLORS.textPrimary }}>
            Nouvelle tâche
          </Text>
          <Pressable style={({ pressed }) => ({
            paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18,
            backgroundColor: COLORS.accent,
            transform: [{ scale: pressed ? 0.95 : 1 }],
            ...SHADOWS.tinted(COLORS.accent),
          })}>
            <Text style={{ fontFamily: FONTS.bodySemi, fontSize: 13, color: '#FFFFFF' }}>
              Ajouter
            </Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 24 }} showsVerticalScrollIndicator={false}>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Que veux-tu faire ?"
            placeholderTextColor={COLORS.textMuted}
            style={{
              fontFamily: FONTS.display, fontSize: 22, lineHeight: 28,
              color: COLORS.textPrimary, letterSpacing: -0.3,
              paddingVertical: 8,
              borderBottomWidth: 1, borderBottomColor: COLORS.border,
            }}
          />
          <Text style={{ marginTop: 8, fontSize: 12, color: COLORS.textMuted }}>
            Astuce : ajoute @demain ou !important
          </Text>

          <Text style={{
            marginTop: 26, fontFamily: FONTS.bodyMedium, fontSize: 11,
            letterSpacing: 1.4, textTransform: 'uppercase', color: COLORS.textMuted,
          }}>Catégorie</Text>
          <View style={{ marginTop: 12, flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {CATEGORIES.map((c) => {
              const isActive = c.id === cat;
              const textColor = isActive ? (c.isLight ? COLORS.textPrimary : '#FFFFFF') : COLORS.textPrimary;
              return (
                <Pressable
                  key={c.id}
                  onPress={() => setCat(c.id)}
                  style={({ pressed }) => ({
                    width: '47%',
                    flexDirection: 'row', alignItems: 'center', gap: 10,
                    paddingHorizontal: 14, paddingVertical: 12, borderRadius: 14,
                    backgroundColor: isActive ? c.color : COLORS.surface,
                    borderWidth: 1, borderColor: isActive ? c.color : COLORS.border,
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                    ...(isActive ? SHADOWS.tinted(c.color) : {}),
                  })}>
                  <View style={{
                    width: 28, height: 28, borderRadius: 8,
                    backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : c.color + '22',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon name={c.icon} size={16} color={isActive ? textColor : c.color} strokeWidth={1.9} />
                  </View>
                  <Text style={{ fontFamily: FONTS.bodyMedium, fontSize: 14, color: textColor }}>{c.name}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={{
            marginTop: 26, fontFamily: FONTS.bodyMedium, fontSize: 11,
            letterSpacing: 1.4, textTransform: 'uppercase', color: COLORS.textMuted,
          }}>Quand</Text>
          <View style={{ marginTop: 12, flexDirection: 'row', gap: 10 }}>
            <View style={[{
              flex: 1, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 10,
              backgroundColor: COLORS.surface, borderRadius: 14,
              borderWidth: 1, borderColor: COLORS.border,
            }, SHADOWS.sm]}>
              <Icon name="calendar" size={18} color={activeCat.color} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 11, color: COLORS.textMuted }}>Date</Text>
                <Text style={{ fontFamily: FONTS.bodyMedium, fontSize: 13, color: COLORS.textPrimary }}>
                  Aujourd'hui
                </Text>
              </View>
            </View>
            <View style={[{
              flex: 1, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 10,
              backgroundColor: COLORS.surface, borderRadius: 14,
              borderWidth: 1, borderColor: COLORS.border,
            }, SHADOWS.sm]}>
              <Icon name="clock" size={18} color={activeCat.color} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 11, color: COLORS.textMuted }}>Heure</Text>
                <Text style={{ fontFamily: FONTS.bodyMedium, fontSize: 13, color: COLORS.textPrimary }}>
                  14:00
                </Text>
              </View>
            </View>
          </View>

          <View style={{ marginTop: 12, flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {['Matin', 'Midi', 'Après-midi', 'Soir', 'Plus tard'].map((t) => (
              <View key={t} style={{
                paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14,
                backgroundColor: COLORS.surface2,
              }}>
                <Text style={{ fontFamily: FONTS.bodyMedium, fontSize: 12, color: COLORS.textSecondary }}>{t}</Text>
              </View>
            ))}
          </View>

          <Text style={{
            marginTop: 26, fontFamily: FONTS.bodyMedium, fontSize: 11,
            letterSpacing: 1.4, textTransform: 'uppercase', color: COLORS.textMuted,
          }}>Options</Text>

          <Pressable
            onPress={() => setPriority(!priority)}
            style={({ pressed }) => ({
              marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 12,
              paddingHorizontal: 16, paddingVertical: 14, borderRadius: 14,
              backgroundColor: priority ? COLORS.red : COLORS.surface,
              borderWidth: 1, borderColor: priority ? COLORS.red : COLORS.border,
              transform: [{ scale: pressed ? 0.98 : 1 }],
              ...(priority ? SHADOWS.tinted(COLORS.red) : {}),
            })}>
            <Icon name="flag" size={18} color={priority ? '#fff' : COLORS.textSecondary} />
            <Text style={{
              flex: 1, fontFamily: FONTS.bodyMedium, fontSize: 14,
              color: priority ? '#fff' : COLORS.textPrimary,
            }}>Priorité haute</Text>
            <View style={{
              width: 36, height: 22, borderRadius: 12,
              backgroundColor: priority ? 'rgba(255,255,255,0.4)' : COLORS.border2,
              padding: 2,
            }}>
              <View style={{
                width: 18, height: 18, borderRadius: 9, backgroundColor: '#fff',
                transform: [{ translateX: priority ? 14 : 0 }],
                ...SHADOWS.sm,
              }} />
            </View>
          </Pressable>

          <View style={{
            marginTop: 8, flexDirection: 'row', alignItems: 'center', gap: 12,
            paddingHorizontal: 16, paddingVertical: 14, borderRadius: 14,
            backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
          }}>
            <Icon name="bell" size={18} color={COLORS.textSecondary} />
            <Text style={{ flex: 1, fontFamily: FONTS.bodyMedium, fontSize: 14, color: COLORS.textPrimary }}>
              Rappel
            </Text>
            <Text style={{ fontSize: 13, color: COLORS.textMuted }}>10 min avant</Text>
            <Icon name="chevronR" size={14} color={COLORS.textMuted} />
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}
