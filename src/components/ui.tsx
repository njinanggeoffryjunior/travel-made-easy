import type { ReactNode } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const colors = {
  bg: '#F7F5F0',
  surface: '#FFFFFF',
  text: '#1C1B19',
  muted: '#5F5B53',
  border: '#E3DED3',
  accent: '#0B7A4B',
  accentSoft: '#E3F2EA',
  warn: '#A15C00',
  warnSoft: '#FCF0DC',
  danger: '#B3261E',
};

export function Screen({ children }: { children: ReactNode }) {
  return (
    <SafeAreaView style={styles.safe} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.column}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

export function Button({
  label,
  onPress,
  variant = 'primary',
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}) {
  const primary = variant === 'primary';
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.button, primary ? styles.buttonPrimary : styles.buttonSecondary, pressed && { opacity: 0.8 }]}
    >
      <Text style={[styles.buttonText, { color: primary ? '#fff' : colors.accent }]}>{label}</Text>
    </Pressable>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function H1({ children }: { children: ReactNode }) {
  return <Text style={styles.h1}>{children}</Text>;
}

export function H2({ children }: { children: ReactNode }) {
  return <Text style={styles.h2}>{children}</Text>;
}

export function P({ children, muted }: { children: ReactNode; muted?: boolean }) {
  return <Text style={[styles.p, muted && { color: colors.muted }]}>{children}</Text>;
}

export function Bullets({ items, tone = 'plain' }: { items: string[]; tone?: 'plain' | 'good' | 'warn' }) {
  const mark = tone === 'good' ? '✓' : tone === 'warn' ? '!' : '•';
  const color = tone === 'good' ? colors.accent : tone === 'warn' ? colors.warn : colors.muted;
  return (
    <View style={{ gap: 6 }}>
      {items.map((item) => (
        <View key={item} style={styles.bulletRow}>
          <Text style={[styles.bulletMark, { color }]}>{mark}</Text>
          <Text style={[styles.p, { flex: 1 }]}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

export function ExternalLink({ label, url }: { label: string; url: string }) {
  return (
    <Pressable accessibilityRole="link" onPress={() => Linking.openURL(url)}>
      <Text style={styles.link}>{label} ↗</Text>
    </Pressable>
  );
}

export function ScoreBadge({ score }: { score: number }) {
  const tone = score >= 55 ? colors.accent : score >= 35 ? colors.warn : colors.danger;
  return (
    <View style={[styles.badge, { borderColor: tone }]}>
      <Text style={[styles.badgeText, { color: tone }]}>{score}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flexGrow: 1, paddingHorizontal: 16, paddingVertical: 20 },
  column: { width: '100%', maxWidth: 720, alignSelf: 'center', gap: 16 },
  button: { paddingVertical: 14, paddingHorizontal: 20, borderRadius: 10, alignItems: 'center' },
  buttonPrimary: { backgroundColor: colors.accent },
  buttonSecondary: { backgroundColor: colors.accentSoft },
  buttonText: { fontSize: 16, fontWeight: '600' },
  card: { backgroundColor: colors.surface, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 16, gap: 10 },
  h1: { fontSize: 28, fontWeight: '700', color: colors.text, lineHeight: 34 },
  h2: { fontSize: 19, fontWeight: '700', color: colors.text },
  p: { fontSize: 15, lineHeight: 22, color: colors.text },
  bulletRow: { flexDirection: 'row', gap: 8 },
  bulletMark: { fontSize: 15, lineHeight: 22, fontWeight: '700', width: 12 },
  link: { fontSize: 15, lineHeight: 24, color: colors.accent, fontWeight: '500' },
  badge: { width: 48, height: 48, borderRadius: 24, borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
  badgeText: { fontSize: 16, fontWeight: '700' },
});
