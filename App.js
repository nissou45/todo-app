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
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@todos_v1";

const CATEGORIES = [
  { id: "1", name: "Perso", color: "#7C3AED", bg: "#F3EEFF" },
  { id: "2", name: "Travail", color: "#0369A1", bg: "#E8F4FC" },
  { id: "3", name: "Sport", color: "#047857", bg: "#E6F7F1" },
  { id: "4", name: "Courses", color: "#B45309", bg: "#FEF3E2" },
];

const DARK = {
  bg: "#0E0E1A",
  card: "#18182A",
  cardAlt: "#1E1E32",
  text: "#EDE8E0",
  textMuted: "#6B6B8A",
  border: "#2A2A42",
  inputBg: "#18182A",
};

const LIGHT = {
  bg: "#F5F0EA",
  card: "#FFFFFF",
  cardAlt: "#F0EBE3",
  text: "#1A1220",
  textMuted: "#9A8FA0",
  border: "#E8E0D8",
  inputBg: "#FFFFFF",
};

export default function TodoApp() {
  const isDark = useColorScheme() === "dark";
  const C = isDark ? DARK : LIGHT;
  const styles = getStyles(isDark, C);

  const [todos, setTodos] = useState([]);
  const [inputText, setInputText] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedCat, setSelectedCat] = useState(CATEGORIES[0].id);
  const [filterCat, setFilterCat] = useState("all");

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
        categoryId: selectedCat,
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

  const getCat = (id) => CATEGORIES.find((c) => c.id === id) || CATEGORIES[0];

  const filtered = todos.filter((t) => {
    const matchStatus =
      filter === "active"
        ? !t.completed
        : filter === "completed"
          ? t.completed
          : true;
    const matchCat = filterCat === "all" || t.categoryId === filterCat;
    return matchStatus && matchCat;
  });

  const remaining = todos.filter((t) => !t.completed).length;
  const activeCat = getCat(selectedCat);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Mes tâches</Text>
          <Text style={styles.subtitle}>
            {remaining === 0 ? "Tout est fait !" : `${remaining} à compléter`}
          </Text>
        </View>
        <View style={styles.statsCircle}>
          <Text style={styles.statsNum}>
            {todos.filter((t) => t.completed).length}
          </Text>
          <Text style={styles.statsLabel}>faites</Text>
        </View>
      </View>

      {/* Input */}
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
        <View style={styles.inputBottom}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 6 }}
          >
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCat(cat.id)}
                style={[
                  styles.catPill,
                  selectedCat === cat.id
                    ? { backgroundColor: cat.color }
                    : { backgroundColor: isDark ? "#2A2A42" : cat.bg },
                ]}
              >
                <Text
                  style={[
                    styles.catPillText,
                    { color: selectedCat === cat.id ? "#fff" : cat.color },
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: activeCat.color }]}
            onPress={addTodo}
          >
            <Text style={styles.addBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Filtres statut */}
      <View style={styles.filterRow}>
        {["all", "active", "completed"].map((f) => (
          <TouchableOpacity
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
              {f === "all" ? "Tout" : f === "active" ? "En cours" : "Terminé"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Filtre catégorie */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 8 }}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 6 }}
      >
        <TouchableOpacity
          onPress={() => setFilterCat("all")}
          style={[
            styles.catPill,
            filterCat === "all"
              ? { backgroundColor: isDark ? "#EDE8E0" : "#1A1220" }
              : { backgroundColor: isDark ? "#2A2A42" : "#E8E0D8" },
          ]}
        >
          <Text
            style={[
              styles.catPillText,
              {
                color:
                  filterCat === "all"
                    ? isDark
                      ? "#1A1220"
                      : "#EDE8E0"
                    : C.textMuted,
              },
            ]}
          >
            Toutes
          </Text>
        </TouchableOpacity>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            onPress={() => setFilterCat(cat.id)}
            style={[
              styles.catPill,
              filterCat === cat.id
                ? { backgroundColor: cat.color }
                : { backgroundColor: isDark ? "#2A2A42" : cat.bg },
            ]}
          >
            <Text
              style={[
                styles.catPillText,
                { color: filterCat === cat.id ? "#fff" : cat.color },
              ]}
            >
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Liste */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
        renderItem={({ item }) => {
          const cat = getCat(item.categoryId);
          return (
            <View style={styles.todoCard}>
              <View
                style={[styles.catStripe, { backgroundColor: cat.color }]}
              />
              <TouchableOpacity
                onPress={() => toggleTodo(item.id)}
                style={[
                  styles.checkbox,
                  { borderColor: cat.color },
                  item.completed && { backgroundColor: cat.color },
                ]}
              >
                {item.completed && (
                  <Text
                    style={{ color: "#fff", fontSize: 11, fontWeight: "700" }}
                  >
                    ✓
                  </Text>
                )}
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <Text style={[styles.todoText, item.completed && styles.done]}>
                  {item.text}
                </Text>
                <Text style={[styles.catLabel, { color: cat.color }]}>
                  {cat.name}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => deleteTodo(item.id)}
                style={styles.delBtn}
              >
                <Text style={styles.delText}>✕</Text>
              </TouchableOpacity>
            </View>
          );
        }}
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

const getStyles = (isDark, C) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: C.bg },

    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      paddingHorizontal: 20,
      paddingTop: 16,
      marginBottom: 20,
    },
    title: {
      fontSize: 30,
      fontWeight: "700",
      color: C.text,
      letterSpacing: -0.5,
    },
    subtitle: { fontSize: 13, color: C.textMuted, marginTop: 2 },
    statsCircle: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: isDark ? "#1E1E32" : "#FFFFFF",
      borderWidth: 1,
      borderColor: C.border,
      alignItems: "center",
      justifyContent: "center",
    },
    statsNum: { fontSize: 18, fontWeight: "700", color: C.text },
    statsLabel: { fontSize: 9, color: C.textMuted, letterSpacing: 0.5 },

    inputCard: {
      marginHorizontal: 16,
      marginBottom: 16,
      backgroundColor: C.card,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: C.border,
      paddingTop: 14,
      paddingHorizontal: 14,
      paddingBottom: 12,
    },
    input: {
      fontSize: 15,
      color: C.text,
      paddingVertical: 4,
      marginBottom: 12,
    },
    inputBottom: { flexDirection: "row", alignItems: "center", gap: 10 },
    addBtn: {
      width: 40,
      height: 40,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    addBtnText: {
      color: "#fff",
      fontSize: 22,
      fontWeight: "300",
      lineHeight: 24,
    },

    catPill: {
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    catPillText: { fontSize: 12, fontWeight: "600", letterSpacing: 0.2 },

    filterRow: {
      flexDirection: "row",
      marginHorizontal: 16,
      marginBottom: 12,
      backgroundColor: isDark ? "#18182A" : "#EDE8E0",
      borderRadius: 14,
      padding: 3,
    },
    filterTab: {
      flex: 1,
      paddingVertical: 8,
      borderRadius: 11,
      alignItems: "center",
    },
    filterTabActive: {
      backgroundColor: C.card,
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
    },
    filterTabText: { fontSize: 13, color: C.textMuted, fontWeight: "500" },
    filterTabTextActive: { color: C.text, fontWeight: "600" },

    todoCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      backgroundColor: C.card,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: C.border,
      marginBottom: 8,
      padding: 14,
      overflow: "hidden",
    },
    catStripe: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: 3,
      borderRadius: 3,
    },
    checkbox: {
      width: 22,
      height: 22,
      borderRadius: 7,
      borderWidth: 2,
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    todoText: {
      fontSize: 15,
      color: C.text,
      fontWeight: "400",
      marginBottom: 3,
    },
    done: { textDecorationLine: "line-through", color: C.textMuted },
    catLabel: { fontSize: 11, fontWeight: "600", letterSpacing: 0.3 },
    delBtn: { padding: 4 },
    delText: { color: C.textMuted, fontSize: 14 },

    emptyBox: { alignItems: "center", marginTop: 60 },
    emptyIcon: { fontSize: 32, color: C.textMuted, marginBottom: 10 },
    emptyText: { fontSize: 14, color: C.textMuted },
  });
