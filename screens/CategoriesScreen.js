import React from "react";
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import { CATEGORIES } from "../constants/theme";
import { getStyles } from "../constants/styles";

export default function CategoriesScreen({ todos, navigate, isDark, C }) {
  const styles = getStyles(isDark, C);

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Header title="Catégories" onBack={() => navigate("home")} C={C} />
      <FlatList
        data={CATEGORIES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => {
          const count = todos.filter((t) => t.categoryId === item.id).length;
          const done = todos.filter(
            (t) => t.categoryId === item.id && t.completed,
          ).length;
          return (
            <View style={styles.todoCard}>
              <View
                style={[styles.catStripe, { backgroundColor: item.color }]}
              />
              <View style={[styles.catDot, { backgroundColor: item.color }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.todoText}>{item.name}</Text>
                <Text style={[styles.catLabel, { color: C.textMuted }]}>
                  {done}/{count} tâches terminées
                </Text>
              </View>
              <View
                style={[styles.catPill, { backgroundColor: item.color + "22" }]}
              >
                <Text style={[styles.catPillText, { color: item.color }]}>
                  {count}
                </Text>
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}
