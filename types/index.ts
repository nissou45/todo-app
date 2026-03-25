export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  categoryId: string;
  dueDate: string | null;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  bg: string;
}

export interface ColorScheme {
  bg: string;
  card: string;
  text: string;
  textMuted: string;
  border: string;
}

export type ScreenName = 'home' | 'detail' | 'categories';
export type NavigateFn = (screen: ScreenName, todo?: Todo | null) => void;
