import { Category, ColorScheme } from '../types';

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Perso', color: '#7C3AED', bg: '#F3EEFF' },
  { id: '2', name: 'Travail', color: '#0369A1', bg: '#E8F4FC' },
  { id: '3', name: 'Sport', color: '#047857', bg: '#E6F7F1' },
  { id: '4', name: 'Courses', color: '#B45309', bg: '#FEF3E2' },
];

export const DARK: ColorScheme = {
  bg: '#0E0E1A',
  card: '#18182A',
  text: '#EDE8E0',
  textMuted: '#6B6B8A',
  border: '#2A2A42',
};

export const LIGHT: ColorScheme = {
  bg: '#F5F0EA',
  card: '#FFFFFF',
  text: '#1A1220',
  textMuted: '#9A8FA0',
  border: '#E8E0D8',
};

export const STORAGE_KEY = '@todos_v1';
