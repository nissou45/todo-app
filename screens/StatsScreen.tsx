import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryPie, VictoryTheme } from 'victory-native';
import Header from '../components/Header';
import { CATEGORIES } from '../constants/theme';
import { getStyles } from '../constants/styles';
import { Todo, ColorScheme, RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Stats'> & {
  todos: Todo[];
  isDark: boolean;
  C: ColorScheme;
};

const { width } = Dimensions.get('window');

import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export default function StatsScreen({ navigation, todos, isDark, C }: Props) {
  const styles = getStyles(isDark, C);

  const exportPDF = async () => {
    const html = `
      <html>
        <head>
          <style>
            body { font-family: Helvetica, sans-serif; padding: 40px; color: #1A1220; }
            h1 { color: #7C3AED; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #E8E0D8; padding: 12px; text-align: left; }
            th { backgroundColor: #F5F0EA; }
            .status { font-weight: bold; }
            .completed { color: #047857; }
            .pending { color: #7C3AED; }
          </style>
        </head>
        <body>
          <h1>Rapport de tâches - TodoApp</h1>
          <p>Généré le ${new Date().toLocaleDateString()}</p>
          <table>
            <thead>
              <tr>
                <th>Tâche</th>
                <th>Catégorie</th>
                <th>Statut</th>
                <th>Échéance</th>
              </tr>
            </thead>
            <tbody>
              ${todos.map(t => `
                <tr>
                  <td>${t.text}</td>
                  <td>${CATEGORIES.find(c => c.id === t.categoryId)?.name || '-'}</td>
                  <td class="status ${t.completed ? 'completed' : 'pending'}">
                    ${t.completed ? 'Terminée' : 'En cours'}
                  </td>
                  <td>${t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch (e) {
      console.error(e);
    }
  };

  // 1. Calcul des KPIs
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  const overdueCount = todos.filter(
    (t) => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()
  ).length;

  // Streak (approximatif based on updatedAt)
  const streak = 0; // Serait mieux avec un historique, ici on peut juste simuler ou ignorer pour l'instant

  // 2. Préparation des données pour Bar Chart (Complétées par semaine - 7 derniers jours)
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const barData = last7Days.map((date) => {
    const count = todos.filter(
      (t) => t.completed && t.updatedAt?.split('T')[0] === date
    ).length;
    return { day: date.split('-')[2], count };
  });

  // 3. Préparation des données pour Pie Chart (Répartition par catégorie)
  const pieData = CATEGORIES.map((cat) => {
    const count = todos.filter((t) => t.categoryId === cat.id).length;
    return { x: cat.name, y: count, fill: cat.color };
  }).filter((d) => d.y > 0);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Statistiques"
        onBack={() => navigation.goBack()}
        C={C}
        onRight={exportPDF}
        rightLabel="📄 PDF"
      />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        
        {/* KPIs */}
        <View style={s.kpiRow}>
          <View style={[s.kpiCard, { backgroundColor: C.card, borderColor: C.border }]}>
            <Text style={[s.kpiVal, { color: '#7C3AED' }]}>{completionRate}%</Text>
            <Text style={[s.kpiLabel, { color: C.textMuted }]}>Complétion</Text>
          </View>
          <View style={[s.kpiCard, { backgroundColor: C.card, borderColor: C.border }]}>
            <Text style={[s.kpiVal, { color: '#EF4444' }]}>{overdueCount}</Text>
            <Text style={[s.kpiLabel, { color: C.textMuted }]}>En retard</Text>
          </View>
          <View style={[s.kpiCard, { backgroundColor: C.card, borderColor: C.border }]}>
            <Text style={[s.kpiVal, { color: '#F59E0B' }]}>{completed}</Text>
            <Text style={[s.kpiLabel, { color: C.textMuted }]}>Total fait</Text>
          </View>
        </View>

        {/* Bar Chart */}
        <View style={[s.chartCard, { backgroundColor: C.card, borderColor: C.border }]}>
          <Text style={[s.chartTitle, { color: C.text }]}>Activité (7 jours)</Text>
          <VictoryChart
            theme={VictoryTheme.grayscale}
            domainPadding={20}
            width={width - 64}
            height={200}
            padding={{ top: 20, bottom: 40, left: 40, right: 20 }}
          >
            <VictoryAxis
              tickValues={barData.map(d => d.day)}
              style={{
                axis: { stroke: C.border },
                tickLabels: { fill: C.textMuted, fontSize: 10 }
              }}
            />
            <VictoryAxis
              dependentAxis
              style={{
                axis: { stroke: C.border },
                tickLabels: { fill: C.textMuted, fontSize: 10 }
              }}
            />
            <VictoryBar
              data={barData}
              x="day"
              y="count"
              style={{
                data: { fill: '#7C3AED', width: 12 },
              }}
            />
          </VictoryChart>
        </View>

        {/* Pie Chart */}
        <View style={[s.chartCard, { backgroundColor: C.card, borderColor: C.border }]}>
          <Text style={[s.chartTitle, { color: C.text }]}>Par catégorie</Text>
          <View style={{ alignItems: 'center' }}>
            <VictoryPie
              data={pieData}
              width={width - 64}
              height={240}
              colorScale={pieData.map(d => d.fill)}
              innerRadius={50}
              labels={({ datum }) => `${datum.x}: ${datum.y}`}
              style={{
                labels: { fill: C.text, fontSize: 10, fontWeight: '600' }
              }}
            />
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  kpiRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  kpiCard: {
    flex: 1,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
  },
  kpiVal: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
  kpiLabel: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  chartCard: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 20,
  },
  chartTitle: { fontSize: 15, fontWeight: '700', marginBottom: 10 },
});
