export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  categoryId: string;
  dueDate: string | null;
  reminderEnabled: boolean;
  updatedAt: string;
  pomodoroCount: number;
  priority?: boolean;
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
  background: string;
  surface: string;
  surface2: string;
  accent: string;
  teal: string;
  yellow: string;
  red: string;
  done: string;
  titleHome: string;
  titleCats: string;
  titleDetail: string;
  titleStats: string;
  textPrimary: string;
  textSecondary: string;
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
