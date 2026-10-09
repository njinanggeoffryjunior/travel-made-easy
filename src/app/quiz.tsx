import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, colors, H1, P, Screen } from '../components/ui';
import { encodeAnswers, questions } from '../data/questions';
import type { Answers } from '../data/types';

export default function Quiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<Answers>>({});
  const q = questions[step];
  const selected = answers[q.key];

  function choose(value: string) {
    const next = { ...answers, [q.key]: value };
    setAnswers(next);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      router.push({ pathname: '/results', params: { a: encodeAnswers(next as Answers) } });
    }
  }

  return (
    <Screen>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${((step + 1) / questions.length) * 100}%` }]} />
      </View>
      <Text style={styles.counter}>
        Question {step + 1} of {questions.length}
      </Text>
      <H1>{q.title}</H1>
      {q.help ? <P muted>{q.help}</P> : null}
      <View style={{ gap: 10 }}>
        {q.options.map((o) => {
          const active = selected === o.value;
          return (
            <Pressable
              key={o.value}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
              onPress={() => choose(o.value)}
              style={({ pressed }) => [styles.option, active && styles.optionActive, pressed && { opacity: 0.85 }]}
            >
              <Text style={[styles.optionLabel, active && { color: colors.accent }]}>{o.label}</Text>
              {o.detail ? <Text style={styles.optionDetail}>{o.detail}</Text> : null}
            </Pressable>
          );
        })}
      </View>
      {step > 0 ? <Button variant="secondary" label="Back" onPress={() => setStep(step - 1)} /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  progressTrack: { height: 6, borderRadius: 3, backgroundColor: colors.border, overflow: 'hidden' },
  progressFill: { height: 6, backgroundColor: colors.accent },
  counter: { fontSize: 13, color: colors.muted, fontWeight: '600' },
  option: { backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: 12, padding: 16, gap: 4 },
  optionActive: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
  optionLabel: { fontSize: 16, fontWeight: '600', color: colors.text },
  optionDetail: { fontSize: 14, color: colors.muted },
});
