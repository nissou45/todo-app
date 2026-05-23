import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { supabase } from '../lib/supabase';
import { COLORS } from '../constants/colors';
import { FONTS } from '../constants/typography';
import { SHADOWS } from '../constants/shadows';
import { ColorScheme, RootStackParamList } from '../types';
import Icon from '../components/Icon';

type Props = NativeStackScreenProps<RootStackParamList, 'Auth'> & {
  isDark: boolean;
  C: ColorScheme;
};

export default function AuthScreen({ navigation, isDark, C }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  async function handleAuth() {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }
    setLoading(true);
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) Alert.alert('Erreur', error.message);
      else Alert.alert('Succès', 'Vérifiez votre email pour confirmer votre compte');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) Alert.alert('Erreur', error.message);
    }
    setLoading(false);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8,
      }}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={[{
            width: 40, height: 40, borderRadius: 20,
            backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
            alignItems: 'center', justifyContent: 'center',
          }, SHADOWS.sm]}>
          <Icon name="chevronL" size={18} color={COLORS.textSecondary} />
        </Pressable>
        <Text style={{
          flex: 1, fontFamily: FONTS.displayBold, fontSize: 17,
          color: COLORS.textPrimary, textAlign: 'center',
        }}>{isSignUp ? 'Inscription' : 'Connexion'}</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 24, flexGrow: 1, justifyContent: 'center' }}>
          <View style={{ marginBottom: 40, alignItems: 'center' }}>
            <View style={{
              width: 80, height: 80, borderRadius: 40,
              backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
              alignItems: 'center', justifyContent: 'center', marginBottom: 16,
            }}>
              <Icon name="user" size={36} color={COLORS.accent} />
            </View>
            <Text style={{ fontFamily: FONTS.display, fontSize: 28, color: COLORS.textPrimary }}>
              {isSignUp ? 'Créer un compte' : 'Bon retour !'}
            </Text>
            <Text style={{ fontFamily: FONTS.body, fontSize: 14, color: COLORS.textSecondary, marginTop: 8 }}>
              Synchronisez vos tâches sur tous vos appareils
            </Text>
          </View>

          <View style={{ gap: 16 }}>
            <View>
              <Text style={{
                fontFamily: FONTS.bodyMedium, fontSize: 11,
                letterSpacing: 1.4, textTransform: 'uppercase',
                color: COLORS.textMuted, marginBottom: 8, marginTop: 0,
              }}>Email</Text>
              <TextInput
                style={{
                  backgroundColor: COLORS.surface, borderRadius: 14,
                  padding: 14, fontSize: 16, color: COLORS.textPrimary,
                  borderWidth: 1, borderColor: COLORS.border,
                }}
                value={email}
                onChangeText={setEmail}
                placeholder="votre@email.com"
                placeholderTextColor={COLORS.textMuted}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View>
              <Text style={{
                fontFamily: FONTS.bodyMedium, fontSize: 11,
                letterSpacing: 1.4, textTransform: 'uppercase',
                color: COLORS.textMuted, marginBottom: 8, marginTop: 0,
              }}>Mot de passe</Text>
              <TextInput
                style={{
                  backgroundColor: COLORS.surface, borderRadius: 14,
                  padding: 14, fontSize: 16, color: COLORS.textPrimary,
                  borderWidth: 1, borderColor: COLORS.border,
                }}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={COLORS.textMuted}
                secureTextEntry
              />
            </View>

            <Pressable
              style={({ pressed }) => ({
                height: 56, borderRadius: 28,
                backgroundColor: COLORS.accent, marginTop: 24,
                alignItems: 'center', justifyContent: 'center',
                transform: [{ scale: pressed ? 0.97 : 1 }],
                ...SHADOWS.tinted(COLORS.accent),
              })}
              onPress={handleAuth}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ fontFamily: FONTS.bodySemi, fontSize: 16, color: '#FFFFFF' }}>
                  {isSignUp ? "S'inscrire" : 'Se connecter'}
                </Text>
              )}
            </Pressable>

            <Pressable onPress={() => setIsSignUp(!isSignUp)} style={{ alignSelf: 'center', marginTop: 16 }}>
              <Text style={{ fontFamily: FONTS.body, fontSize: 14, color: COLORS.textSecondary }}>
                {isSignUp
                  ? 'Déjà un compte ? Connectez-vous'
                  : "Pas de compte ? Inscrivez-vous"}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
