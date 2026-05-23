import React, { useState, useEffect } from "react";
import {
  useColorScheme,
  View,
  Platform,
  ActivityIndicator,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
const FinalRootView = Platform.OS === "web" ? View : GestureHandlerRootView;
import { SafeAreaProvider } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./screens/HomeScreen";
import DetailScreen from "./screens/DetailScreen";
import CategoriesScreen from "./screens/CategoriesScreen";
import AuthScreen from "./screens/AuthScreen";
import StatsScreen from "./screens/StatsScreen";
import CalendarScreen from "./screens/CalendarScreen";
import CreateScreen from "./screens/CreateScreen";
import { STORAGE_KEY, DARK, LIGHT, COLORS } from "./constants/colors";
import { useAppFonts } from "./constants/typography";
import { Todo, RootStackParamList } from "./types";
import { useNotifications } from "./hooks/useNotifications";
import { useAuth } from "./hooks/useAuth";
import { useSync } from "./hooks/useSync";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [fontsLoaded] = useAppFonts();
  const isDark = useColorScheme() === "dark";
  const C = isDark ? DARK : LIGHT;
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isReady, setIsReady] = useState(false);

  const { registerForPushNotificationsAsync } = useNotifications();
  const { user, loading: authLoading } = useAuth();
  const { syncTodos } = useSync();

  useEffect(() => {
    (async () => {
      await registerForPushNotificationsAsync();

      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      let localTodos: Todo[] = [];

      if (saved) {
        const parsed = JSON.parse(saved);
        localTodos = parsed.map((t: any) => ({
          ...t,
          reminderEnabled: t.reminderEnabled ?? false,
          updatedAt: t.updatedAt ?? new Date().toISOString(),
          pomodoroCount: t.pomodoroCount ?? 0,
        }));
      }

      if (user) {
        const merged = await syncTodos(localTodos, user.id);
        setTodos(merged);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      } else {
        setTodos(localTodos);
      }

      setIsReady(true);
    })();
  }, [user]);

  const saveTodos = async (newTodos: Todo[]) => {
    setTodos(newTodos);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTodos));

    if (user) {
      syncTodos(newTodos, user.id);
    }
  };

  if (!fontsLoaded || authLoading || !isReady) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.background,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator color={COLORS.accent} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <FinalRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: C.bg },
            }}
          >
            <Stack.Screen name="Home">
              {(props) => (
                <HomeScreen
                  {...props}
                  todos={todos}
                  setTodos={saveTodos}
                  isDark={isDark}
                  C={C}
                  user={user}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Detail">
              {(props) => (
                <DetailScreen
                  {...props}
                  todos={todos}
                  setTodos={saveTodos}
                  isDark={isDark}
                  C={C}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Categories">
              {(props) => (
                <CategoriesScreen
                  {...props}
                  todos={todos}
                  isDark={isDark}
                  C={C}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Auth">
              {(props) => <AuthScreen {...props} isDark={isDark} C={C} />}
            </Stack.Screen>
            <Stack.Screen name="Stats">
              {(props) => (
                <StatsScreen {...props} todos={todos} isDark={isDark} C={C} />
              )}
            </Stack.Screen>
            <Stack.Screen name="Calendar">
              {(props) => (
                <CalendarScreen {...props} todos={todos} isDark={isDark} C={C} />
              )}
            </Stack.Screen>
            <Stack.Screen name="Create"
              options={{ presentation: 'transparentModal', animation: 'fade' }}>
              {(props) => (
                <CreateScreen
                  {...props}
                  todos={todos}
                  setTodos={saveTodos}
                  isDark={isDark}
                  C={C}
                />
              )}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </FinalRootView>
    </SafeAreaProvider>
  );
}
