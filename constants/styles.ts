import { StyleSheet } from 'react-native';
import { ColorScheme } from '../types';

export const getStyles = (isDark: boolean, C: ColorScheme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: C.bg, overflow: 'hidden' },
    subtitle: { fontSize: 13, color: C.textMuted },
    todoCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: C.card,
      borderWidth: 1,
      borderColor: C.border,
      padding: 14,
      overflow: 'hidden',
    },
    overdueCard: {
      borderColor: '#EF444444',
      backgroundColor: isDark ? '#2A1818' : '#FFF5F5',
    },
    catStripe: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3 },
    todoText: { fontSize: 15, color: C.text, fontWeight: '400' },
    done: { textDecorationLine: 'line-through', color: C.textMuted },
    catLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 0.3 },
    dateLabel: { fontSize: 11, fontWeight: '500' },
    deleteAction: {
      backgroundColor: '#EF4444',
      justifyContent: 'center',
      alignItems: 'center',
      width: 90,
      borderRadius: 14,
    },
    deleteActionText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  });
