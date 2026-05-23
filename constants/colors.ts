import { ColorScheme } from '../types';

export const COLORS = {
  background: '#FAFAFA',
  surface: '#FFFFFF',
  surface2: '#F4F4F6',

  red: '#FF6B6B',
  yellow: '#FFE66D',
  teal: '#4ECDC4',
  blue: '#45B7D1',

  textPrimary: '#2D3748',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',

  border: '#F0F0F0',
  border2: '#E5E7EB',

  done: '#4ECDC4',
  pending: '#FF6B6B',

  categories: {
    personnel: '#FF6B6B',
    travail: '#45B7D1',
    loisirs: '#4ECDC4',
    urgent: '#FFE66D',
  },

  titleHome: '#45B7D1',
  titleDetail: '#45B7D1',
  titleStats: '#45B7D1',
  titleCats: '#4ECDC4',

  accent: '#45B7D1',
};

export const CATEGORIES = [
  { id: 'personnel', name: 'Personnel', color: COLORS.categories.personnel, icon: 'heart', isLight: false },
  { id: 'travail', name: 'Travail', color: COLORS.categories.travail, icon: 'briefcase', isLight: false },
  { id: 'loisirs', name: 'Loisirs', color: COLORS.categories.loisirs, icon: 'leaf', isLight: false },
  { id: 'urgent', name: 'Urgent', color: COLORS.categories.urgent, icon: 'flag', isLight: true },
];

export const getCategory = (id: string) => CATEGORIES.find((c) => c.id === id) || CATEGORIES[0];

export const DARK: ColorScheme = {
  bg: '#1A1A2E',
  card: '#252540',
  text: '#EDE8E0',
  textMuted: '#8888AA',
  border: '#333355',
  background: '#1A1A2E',
  surface: '#252540',
  surface2: '#1E1E38',
  accent: '#45B7D1',
  teal: '#4ECDC4',
  yellow: '#FFE66D',
  red: '#FF6B6B',
  done: '#4ECDC4',
  titleHome: '#45B7D1',
  titleCats: '#4ECDC4',
  titleDetail: '#45B7D1',
  titleStats: '#45B7D1',
  textPrimary: '#EDE8E0',
  textSecondary: '#8888AA',
};

export const LIGHT: ColorScheme = {
  bg: '#FAFAFA',
  card: '#FFFFFF',
  text: '#2D3748',
  textMuted: '#9CA3AF',
  border: '#F0F0F0',
  background: '#FAFAFA',
  surface: '#FFFFFF',
  surface2: '#F4F4F6',
  accent: '#45B7D1',
  teal: '#4ECDC4',
  yellow: '#FFE66D',
  red: '#FF6B6B',
  done: '#4ECDC4',
  titleHome: '#45B7D1',
  titleCats: '#4ECDC4',
  titleDetail: '#45B7D1',
  titleStats: '#45B7D1',
  textPrimary: '#2D3748',
  textSecondary: '#6B7280',
};

export const STORAGE_KEY = '@todos_v1';
