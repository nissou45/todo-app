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
import { getStyles } from '../constants/styles';
import { ColorScheme, RootStackParamList } from '../types';
import Header from '../components/Header';

type Props = NativeStackScreenProps<RootStackParamList, 'Auth'> & {
  isDark: boolean;
  C: ColorScheme;
};

export default function AuthScreen({ navigation, isDark, C }: Props) {
  const styles = getStyles(isDark, C);
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
    <SafeAreaView style={styles.container}>
      <Header title={isSignUp ? "Inscription" : "Connexion"} onBack={() => navigation.goBack()} C={C} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ padding: 24, flexGrow: 1, justifyContent: 'center' }}>
          <View style={{ marginBottom: 40, alignItems: 'center' }}>
            <Text style={{ fontSize: 48, marginBottom: 16 }}>🚀</Text>
            <Text style={{ fontSize: 24, fontWeight: '700', color: C.text }}>
              {isSignUp ? "Créer un compte" : "Bon retour !"}
            </Text>
            <Text style={{ fontSize: 14, color: C.textMuted, marginTop: 8 }}>
              Synchronisez vos tâches sur tous vos appareils
            </Text>
          </View>

          <View style={{ gap: 16 }}>
            <View>
              <Text style={styles.detailLabel}>Email</Text>
              <TextInput
                style={styles.detailInput}
                value={email}
                onChangeText={setEmail}
                placeholder="votre@email.com"
                placeholderTextColor={C.textMuted}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View>
              <Text style={styles.detailLabel}>Mot de passe</Text>
              <TextInput
                style={styles.detailInput}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={C.textMuted}
                secureTextEntry
              />
            </View>

            <Pressable
              style={[styles.saveBtn, { backgroundColor: '#7C3AED', marginTop: 24 }]}
              onPress={handleAuth}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveBtnText}>
                  {isSignUp ? "S'inscrire" : "Se connecter"}
                </Text>
              )}
            </Pressable>

            <Pressable onPress={() => setIsSignUp(!isSignUp)} style={{ alignSelf: 'center', marginTop: 16 }}>
              <Text style={{ color: C.textMuted, fontSize: 14 }}>
                {isSignUp
                  ? "Déjà un compte ? Connectez-vous"
                  : "Pas de compte ? Inscrivez-vous"}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
