import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function Header({ title, onBack, onRight, rightLabel, C }) {
  return (
    <View
      style={[
        styles.container,
        { borderBottomColor: C.border, backgroundColor: C.bg },
      ]}
    >
      {onBack && (
        <TouchableOpacity onPress={onBack} style={styles.back}>
          <Text style={styles.backText}>‹ Retour</Text>
        </TouchableOpacity>
      )}
      <Text style={[styles.title, { color: C.text }]}>{title}</Text>
      {onRight ? (
        <TouchableOpacity onPress={onRight}>
          <Text style={styles.rightText}>{rightLabel}</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  back: { marginRight: 12 },
  backText: { fontSize: 16, color: "#7C3AED", fontWeight: "600" },
  title: { flex: 1, fontSize: 17, fontWeight: "700" },
  rightText: { fontSize: 15, color: "#7C3AED", fontWeight: "600" },
  placeholder: { width: 60 },
});
