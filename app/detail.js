import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { CATEGORIES, DARK, LIGHT } from "./index";

const STORAGE_KEY = "@todos_v1";

const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  if (d.toDateString() === today.toDateString()) return "Aujourd'hui";
  if (d.toDateString() === tomorrow.toDateString()) return "Demain";
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function DetailScreen() {
  const isDark = useColorScheme() === "dark";
  const C = isDark ? DARK : LIGHT;
  const styles = getStyles(isDark, C);
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [todo, setTodo] = useState(null);
  const [text, setText] = useState("");
  const [categoryId, setCategoryId] = useState("1");
  const [dueDate, setDueDate] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        const todos = JSON.parse(saved);
        const found = todos.find((t) => t.id === id);
        if (found) {
          setTodo(found);
          setText(found.text);
          setCategoryId(found.categoryId || "1");
          setDueDate(found.dueDate ? new Date(found.dueDate) : null);
        }
      }
    })();
  }, [id]);

  const save = async () => {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    const todos = JSON.parse(saved);
    const next = todos.map((t) =>
      t.id === id
        ? {
            ...t,
            text,
            categoryId,
            dueDate: dueDate ? dueDate.toISOString() : null,
          }
        : t,
    );
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    router.back();
  };

  const deleteTodo = () =>
    Alert.alert("Supprimer", "Confirmer ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          const saved = await AsyncStorage.getItem(STORAGE_KEY);
          if (!saved) return;
          const todos = JSON.parse(saved);
          const next = todos.filter((t) => t.id !== id);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          router.back();
        },
      },
    ]);

  const cat = CATEGORIES.find((c) => c.id === categoryId) || CATEGORIES[0];

  if (!todo) return null;

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Champ texte */}
        <Text style={styles.label}>Tâche</Text>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          multiline
          placeholderTextColor={C.textMuted}
        />

        {/* Catégorie */}
        <Text style={styles.label}>Catégorie</Text>
        <View style={styles.catRow}>
          {CATEGORIES.map((c) => (
            <TouchableOpacity
              key={c.id}
              onPress={() => setCategoryId(c.id)}
              style={[
                styles.catChip,
                categoryId === c.id
                  ? { backgroundColor: c.color }
                  : { backgroundColor: isDark ? "#2A2A42" : c.bg },
              ]}
            >
              <Text
                style={[
                  styles.catChipText,
                  { color: categoryId === c.id ? "#fff" : c.color },
                ]}
              >
                {c.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Date */}
        <Text style={styles.label}>Date d'échéance</Text>
        <TouchableOpacity
          onPress={() => setShowPicker(true)}
          style={[styles.datePill, dueDate && { borderColor: cat.color }]}
        >
          <Text
            style={[
              styles.datePillText,
              { color: dueDate ? cat.color : C.textMuted },
            ]}
          >
            {dueDate ? `📅 ${formatDate(dueDate)}` : "+ Ajouter une date"}
          </Text>
        </TouchableOpacity>
        {dueDate && (
          <TouchableOpacity
            onPress={() => setDueDate(null)}
            style={{ marginTop: 8 }}
          >
            <Text style={{ color: C.textMuted, fontSize: 13 }}>
              Supprimer la date
            </Text>
          </TouchableOpacity>
        )}

        {showPicker && Platform.OS === "ios" && (
          <View style={styles.pickerCard}>
            <DateTimePicker
              value={tempDate}
              mode="date"
              display="inline"
              minimumDate={new Date()}
              onChange={(e, date) => {
                if (date) setTempDate(date);
              }}
              themeVariant={isDark ? "dark" : "light"}
            />
            <View style={styles.pickerBtns}>
              <TouchableOpacity
                onPress={() => setShowPicker(false)}
                style={styles.pickerCancel}
              >
                <Text style={{ color: C.textMuted, fontWeight: "500" }}>
                  Annuler
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setDueDate(tempDate);
                  setShowPicker(false);
                }}
                style={[styles.pickerConfirm, { backgroundColor: cat.color }]}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>
                  Confirmer
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {showPicker && Platform.OS === "android" && (
          <DateTimePicker
            value={tempDate}
            mode="date"
            display="default"
            minimumDate={new Date()}
            onChange={(e, date) => {
              setShowPicker(false);
              if (date) setDueDate(date);
            }}
          />
        )}

        {/* Statut */}
        <Text style={styles.label}>Statut</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: todo.completed ? "#04784722" : "#7C3AED22" },
          ]}
        >
          <Text
            style={{
              color: todo.completed ? "#047857" : "#7C3AED",
              fontWeight: "600",
              fontSize: 13,
            }}
          >
            {todo.completed ? "✓ Terminée" : "○ En cours"}
          </Text>
        </View>

        {/* Boutons */}
        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: cat.color }]}
          onPress={save}
        >
          <Text style={styles.saveBtnText}>Enregistrer</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteBtn} onPress={deleteTodo}>
          <Text style={styles.deleteBtnText}>Supprimer la tâche</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (isDark, C) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: C.bg },
    label: {
      fontSize: 12,
      fontWeight: "600",
      color: C.textMuted,
      letterSpacing: 0.5,
      textTransform: "uppercase",
      marginBottom: 8,
      marginTop: 20,
    },
    input: {
      backgroundColor: C.card,
      borderRadius: 14,
      padding: 14,
      fontSize: 16,
      color: C.text,
      borderWidth: 1,
      borderColor: C.border,
      minHeight: 80,
      textAlignVertical: "top",
    },
    catRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    catChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
    catChipText: { fontSize: 13, fontWeight: "600" },
    datePill: {
      backgroundColor: C.card,
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: C.border,
    },
    datePillText: { fontSize: 14, fontWeight: "500" },
    pickerCard: {
      marginTop: 12,
      backgroundColor: C.card,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: C.border,
      padding: 12,
    },
    pickerBtns: {
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: 10,
      marginTop: 8,
    },
    pickerCancel: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 10,
      backgroundColor: isDark ? "#2A2A42" : "#F0EBE3",
    },
    pickerConfirm: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 10,
    },
    statusBadge: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 12,
      alignSelf: "flex-start",
    },
    saveBtn: {
      marginTop: 32,
      padding: 16,
      borderRadius: 16,
      alignItems: "center",
    },
    saveBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
    deleteBtn: {
      marginTop: 12,
      padding: 16,
      borderRadius: 16,
      alignItems: "center",
      backgroundColor: isDark ? "#2A1818" : "#FFF5F5",
      borderWidth: 1,
      borderColor: "#EF444444",
    },
    deleteBtnText: { color: "#EF4444", fontSize: 15, fontWeight: "600" },
  });
