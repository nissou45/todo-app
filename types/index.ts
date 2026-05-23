export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  categoryId: string;
  dueDate: string | null;
  reminderEnabled: boolean;
  updatedAt: string;
  pomodoroCount: number;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  isLight: boolean;
}

export interface ColorScheme {
  bg: string;
  card: string;
  text: string;
  textMuted: string;
  border: string;
}

export type ScreenName = 'home' | 'detail' | 'categories' | 'auth' | 'stats' | 'calendar' | 'create';
export type NavigateFn = (screen: ScreenName, todo?: Todo | null) => void;

export type RootStackParamList = {
  Home: undefined;
  Detail: { todoId: string };
  Categories: undefined;
  Auth: undefined;
  Stats: undefined;
  Calendar: undefined;
  Create: undefined;
};
