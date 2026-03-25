import React, { useState, useEffect } from "react";
import { StatusBar, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HomeScreen from "./screens/HomeScreen";
import DetailScreen from "./screens/DetailScreen";
import CategoriesScreen from "./screens/CategoriesScreen";
import { STORAGE_KEY, DARK, LIGHT } from "./constants/theme";

export default function App() {
  const isDark = useColorScheme() === "dark";
  const C = isDark ? DARK : LIGHT;
  const [todos, setTodos] = useState([]);
  const [screen, setScreen] = useState("home");
  const [currentTodo, setCurrentTodo] = useState(null);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) setTodos(JSON.parse(saved));
    })();
  }, []);

  const navigate = (screenName, todo = null) => {
    setCurrentTodo(todo);
    setScreen(screenName);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      {screen === "home" && (
        <HomeScreen
          todos={todos}
          setTodos={setTodos}
          navigate={navigate}
          isDark={isDark}
          C={C}
        />
      )}
      {screen === "detail" && currentTodo && (
        <DetailScreen
          todo={currentTodo}
          todos={todos}
          setTodos={setTodos}
          navigate={navigate}
          isDark={isDark}
          C={C}
        />
      )}
      {screen === "categories" && (
        <CategoriesScreen
          todos={todos}
          navigate={navigate}
          isDark={isDark}
          C={C}
        />
      )}
    </GestureHandlerRootView>
  );
}
