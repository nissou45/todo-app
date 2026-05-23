import React, { useState, useCallback } from 'react';
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
import { FONTS } from '../constants/typography';
import { SHADOWS } from '../constants/shadows';
import { ColorScheme, RootStackParamList } from '../types';
import Icon from '../components/Icon';

type Props = NativeStackScreenProps<RootStackParamList, 'Auth'> & {
  isDark: boolean;
  C: ColorScheme;
};

export default function AuthScreen({ navigation, isDark, C }: Props): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = useCallback(async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }
    if (!supabase) {
      Alert.alert(
        'Supabase non configuré',
        'Ajoutez vos clés Supabase dans app.json → extra pour activer l\'authentification.'
      );
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
  }, [email, password, isSignUp]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.background }}>
      <View style={{
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8,
      }}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={[{
            width: 40, height: 40, borderRadius: 20,
            backgroundColor: C.surface, borderWidth: 1, borderColor: C.border,
            alignItems: 'center', justifyContent: 'center',
          }, SHADOWS.sm]}>
          <Icon name="chevronL" size={18} color={C.textSecondary} />
        </Pressable>
        <Text style={{
          flex: 1, fontFamily: FONTS.displayBold, fontSize: 17,
          color: C.textPrimary, textAlign: 'center',
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
              backgroundColor: C.surface, borderWidth: 1, borderColor: C.border,
              alignItems: 'center', justifyContent: 'center', marginBottom: 16,
            }}>
              <Icon name="user" size={36} color={C.accent} />
            </View>
            <Text style={{ fontFamily: FONTS.display, fontSize: 28, color: C.textPrimary }}>
              {isSignUp ? 'Créer un compte' : 'Bon retour !'}
            </Text>
            <Text style={{ fontFamily: FONTS.body, fontSize: 14, color: C.textSecondary, marginTop: 8 }}>
              Synchronisez vos tâches sur tous vos appareils
            </Text>
          </View>

          <View style={{ gap: 16 }}>
            <View>
              <Text style={{
                fontFamily: FONTS.bodyMedium, fontSize: 11,
                letterSpacing: 1.4, textTransform: 'uppercase',
                color: C.textMuted, marginBottom: 8, marginTop: 0,
              }}>Email</Text>
              <TextInput
                style={{
                  backgroundColor: C.surface, borderRadius: 14,
                  padding: 14, fontSize: 16, color: C.textPrimary,
                  borderWidth: 1, borderColor: C.border,
                }}
                value={email}
                onChangeText={setEmail}
                placeholder="votre@email.com"
                placeholderTextColor={C.textMuted}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View>
              <Text style={{
                fontFamily: FONTS.bodyMedium, fontSize: 11,
                letterSpacing: 1.4, textTransform: 'uppercase',
                color: C.textMuted, marginBottom: 8, marginTop: 0,
              }}>Mot de passe</Text>
              <TextInput
                style={{
                  backgroundColor: C.surface, borderRadius: 14,
                  padding: 14, fontSize: 16, color: C.textPrimary,
                  borderWidth: 1, borderColor: C.border,
                }}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={C.textMuted}
                secureTextEntry
              />
            </View>

            <Pressable
              style={({ pressed }) => ({
                height: 56, borderRadius: 28,
                backgroundColor: C.accent, marginTop: 24,
                alignItems: 'center', justifyContent: 'center',
                transform: [{ scale: pressed ? 0.97 : 1 }],
                ...SHADOWS.tinted(C.accent),
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
              <Text style={{ fontFamily: FONTS.body, fontSize: 14, color: C.textSecondary }}>
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
