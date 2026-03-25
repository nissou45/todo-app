import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import Header from "../components/Header";
import { CATEGORIES, STORAGE_KEY } from "../constants/theme";
import { formatDate } from "../utils/dateHelpers";
import { getStyles } from "../constants/styles";

export default function DetailScreen({
  todo,
  todos,
  setTodos,
  navigate,
  isDark,
  C,
}) {
  const styles = getStyles(isDark, C);
  const [text, setText] = useState(todo.text);
  const [categoryId, setCategoryId] = useState(todo.categoryId || "1");
  const [dueDate, setDueDate] = useState(
    todo.dueDate ? new Date(todo.dueDate) : null,
  );
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  const cat = CATEGORIES.find((c) => c.id === categoryId) || CATEGORIES[0];

  const save = async () => {
    const next = todos.map((t) =>
      t.id === todo.id
        ? {
            ...t,
            text,
            categoryId,
            dueDate: dueDate ? dueDate.toISOString() : null,
          }
        : t,
    );
    setTodos(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    navigate("home");
  };

  const deleteTodo = () =>
    Alert.alert("Supprimer", "Confirmer ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          const next = todos.filter((t) => t.id !== todo.id);
          setTodos(next);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          navigate("home");
        },
      },
    ]);

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Header
        title="Détail"
        onBack={() => navigate("home")}
        onRight={save}
        rightLabel="Sauvegarder"
        C={C}
      />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.detailLabel}>Tâche</Text>
        <TextInput
          style={styles.detailInput}
          value={text}
          onChangeText={setText}
          multiline
          placeholderTextColor={C.textMuted}
        />

        <Text style={styles.detailLabel}>Catégorie</Text>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 8,
            marginBottom: 20,
          }}
        >
          {CATEGORIES.map((c) => (
            <TouchableOpacity
              key={c.id}
              onPress={() => setCategoryId(c.id)}
              style={[
                styles.catPill,
                categoryId === c.id
                  ? { backgroundColor: c.color }
                  : { backgroundColor: isDark ? "#2A2A42" : c.bg },
              ]}
            >
              <Text
                style={[
                  styles.catPillText,
                  { color: categoryId === c.id ? "#fff" : c.color },
                ]}
              >
                {c.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.detailLabel}>Date d'échéance</Text>
        <TouchableOpacity
          onPress={() => setShowPicker(true)}
          style={[
            styles.datePill,
            { marginBottom: 8 },
            dueDate && { borderColor: cat.color },
          ]}
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
          <TouchableOpacity onPress={() => setDueDate(null)}>
            <Text
              style={{ color: C.textMuted, fontSize: 13, marginBottom: 20 }}
            >
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

        <Text style={styles.detailLabel}>Statut</Text>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: todo.completed ? "#04784722" : "#7C3AED22",
              marginBottom: 32,
            },
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
