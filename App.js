import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StatusBar,
  Alert,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@todos_v1";

export default function TodoApp() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const styles = getStyles(isDark);
  const accent = isDark ? "#818cf8" : "#6366f1";

  const [todos, setTodos] = useState([]);
  const [inputText, setInputText] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) setTodos(JSON.parse(saved));
    })();
  }, []);

  const save = (next) =>
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));

  const addTodo = () => {
    if (!inputText.trim()) return;
    const next = [
      ...todos,
      {
        id: Date.now().toString(),
        text: inputText.trim(),
        completed: false,
      },
    ];
    setTodos(next);
    save(next);
    setInputText("");
  };

  const toggleTodo = (id) => {
    const next = todos.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t,
    );
    setTodos(next);
    save(next);
  };

  const deleteTodo = (id) =>
    Alert.alert("Supprimer", "Confirmer ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: () => {
          const next = todos.filter((t) => t.id !== id);
          setTodos(next);
          save(next);
        },
      },
    ]);

  const filtered = todos.filter((t) =>
    filter === "active"
      ? !t.completed
      : filter === "completed"
        ? t.completed
        : true,
  );

  const remaining = todos.filter((t) => !t.completed).length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <Text style={styles.title}>Mes tâches</Text>
      <Text style={styles.subtitle}>
        {remaining} tâche{remaining !== 1 ? "s" : ""} restante
        {remaining !== 1 ? "s" : ""}
      </Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Nouvelle tâche..."
          placeholderTextColor={isDark ? "#666" : "#aaa"}
          onSubmitEditing={addTodo}
          returnKeyType="done"
        />
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: accent }]}
          onPress={addTodo}
        >
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.filters}>
        {["all", "active", "completed"].map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={[
              styles.filterBtn,
              filter === f && { backgroundColor: accent },
            ]}
          >
            <Text
              style={[styles.filterText, filter === f && { color: "#fff" }]}
            >
              {f === "all" ? "Tout" : f === "active" ? "Actif" : "Terminé"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <TouchableOpacity
              onPress={() => toggleTodo(item.id)}
              style={[
                styles.checkbox,
                item.completed && {
                  backgroundColor: accent,
                  borderColor: accent,
                },
              ]}
            >
              {item.completed && (
                <Text style={{ color: "#fff", fontSize: 12 }}>✓</Text>
              )}
            </TouchableOpacity>
            <Text style={[styles.todoText, item.completed && styles.done]}>
              {item.text}
            </Text>
            <TouchableOpacity
              onPress={() => deleteTodo(item.id)}
              style={styles.delBtn}
            >
              <Text style={styles.delText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Aucune tâche !</Text>}
      />
    </SafeAreaView>
  );
}

const getStyles = (isDark) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: isDark ? "#1a1a2e" : "#f5f5f5" },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      paddingHorizontal: 20,
      paddingTop: 20,
      color: isDark ? "#f1f5f9" : "#1e1e2e",
    },
    subtitle: {
      fontSize: 13,
      color: isDark ? "#94a3b8" : "#888",
      paddingHorizontal: 20,
      marginBottom: 12,
    },
    inputRow: { flexDirection: "row", padding: 16, gap: 8 },
    input: {
      flex: 1,
      backgroundColor: isDark ? "#2d2d44" : "white",
      borderRadius: 12,
      padding: 12,
      fontSize: 16,
      color: isDark ? "#f1f5f9" : "#1e1e2e",
      borderWidth: 1,
      borderColor: isDark ? "#3d3d5c" : "#ddd",
    },
    addBtn: {
      padding: 12,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      width: 48,
    },
    addBtnText: {
      color: "white",
      fontSize: 24,
      fontWeight: "bold",
      lineHeight: 26,
    },
    filters: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 8,
      marginBottom: 16,
    },
    filterBtn: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: isDark ? "#2d2d44" : "#e5e7eb",
    },
    filterText: { fontSize: 13, color: isDark ? "#94a3b8" : "#666" },
    todoItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      backgroundColor: isDark ? "#2d2d44" : "white",
      margin: 4,
      marginHorizontal: 16,
      padding: 14,
      borderRadius: 12,
    },
    checkbox: {
      width: 22,
      height: 22,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: isDark ? "#4d4d6e" : "#ccc",
      alignItems: "center",
      justifyContent: "center",
    },
    todoText: { flex: 1, fontSize: 15, color: isDark ? "#f1f5f9" : "#1e1e2e" },
    done: {
      textDecorationLine: "line-through",
      color: isDark ? "#4d4d6e" : "#aaa",
    },
    delBtn: { padding: 6 },
    delText: { color: "#ef4444", fontSize: 16 },
    empty: {
      textAlign: "center",
      color: isDark ? "#4d4d6e" : "#aaa",
      marginTop: 60,
      fontSize: 15,
    },
  });
