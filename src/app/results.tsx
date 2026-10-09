import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Bullets, Button, Card, colors, ExternalLink, H1, H2, P, ScoreBadge, Screen } from '../components/ui';
import { decodeAnswers, labelFor } from '../data/questions';
import { recommend } from '../lib/recommend';

export default function Results() {
  const { a } = useLocalSearchParams<{ a?: string }>();
  const answers = decodeAnswers(a);

  if (!answers) {
    return (
      <Screen>
        <H1>We couldn't read your answers</H1>
        <Button label="Take the questionnaire" onPress={() => router.replace('/quiz')} />
      </Screen>
    );
  }

  const results = recommend(answers);
  const top = results[0];
  const { country } = top;
  // Show up to three routes worth considering; the rest go in a compact list.
  const worth = top.ranked.filter((r, i) => i === 0 || r.assessment.score >= 25);
  const shown = worth.slice(0, 3);
  const others = top.ranked.filter((r) => !shown.includes(r));

  return (
    <Screen>
      <Card style={{ borderColor: colors.accent }}>
        <Text style={styles.eyebrow}>Recommended country</Text>
        <View style={styles.row}>
          <Text style={styles.flag}>{country.flag}</Text>
          <View style={{ flex: 1 }}>
            <H1>{country.name}</H1>
            <Text style={styles.verdict}>
              {top.verdict} · fit {top.fit}/100
            </Text>
          </View>
        </View>
        <P muted>
          Based on: {labelFor('stage', answers.stage).toLowerCase()}, {labelFor('area', answers.area).toLowerCase()}, aiming
          for {labelFor('objective', answers.objective).toLowerCase()}.
        </P>
        {results.length === 1 ? (
          <P muted>Italy is the only country we cover so far, so the score shows how well it fits you rather than a ranking.</P>
        ) : null}
      </Card>

      <H2>Best routes for you</H2>
      {shown.map(({ pathway, assessment }, i) => (
        <Pressable
          key={pathway.id}
          accessibilityRole="button"
          onPress={() => router.push({ pathname: '/pathway/[id]', params: { id: pathway.id, c: country.id, a } })}
        >
          <Card style={i === 0 ? { borderColor: colors.accent } : undefined}>
            <View style={styles.row}>
              <View style={{ flex: 1, gap: 4 }}>
                {i === 0 ? <Text style={styles.eyebrow}>Top pick</Text> : null}
                <H2>{pathway.title}</H2>
              </View>
              <ScoreBadge score={assessment.score} />
            </View>
            {assessment.reasons.length ? <Bullets tone="good" items={assessment.reasons.slice(0, 3)} /> : null}
            {assessment.cautions.length ? <Bullets tone="warn" items={assessment.cautions.slice(0, 2)} /> : null}
            <Text style={styles.more}>See requirements, costs and steps →</Text>
          </Card>
        </Pressable>
      ))}

      {others.length ? (
        <Card>
          <H2>Other routes</H2>
          {others.map(({ pathway, assessment }) => (
            <Pressable
              key={pathway.id}
              onPress={() => router.push({ pathname: '/pathway/[id]', params: { id: pathway.id, c: country.id, a } })}
            >
              <Text style={styles.otherRow}>
                {pathway.title} <Text style={{ color: colors.muted }}>· {assessment.score}</Text>
              </Text>
            </Pressable>
          ))}
          {top.notEligible.map(({ pathway, assessment }) => (
            <Text key={pathway.id} style={[styles.otherRow, { color: colors.muted }]}>
              {pathway.title}: {assessment.cautions[0]}
            </Text>
          ))}
        </Card>
      ) : null}

      <H2>Why {country.name}</H2>
      <Card>
        {country.essentials.map((e) => (
          <View key={e.title} style={{ gap: 2 }}>
            <Text style={styles.essentialTitle}>{e.title}</Text>
            <P muted>{e.body}</P>
          </View>
        ))}
      </Card>

      <H2>Visa and arrival</H2>
      <Card>
        <Bullets items={country.visa[answers.citizenship]} />
        <ExternalLink label="Check the official visa finder" url="https://vistoperitalia.esteri.it" />
      </Card>

      <H2>Places to look at</H2>
      <Card>
        {country.institutionsByArea[answers.area].map((inst) => (
          <View key={inst.name} style={{ gap: 2 }}>
            <ExternalLink label={`${inst.name}, ${inst.city}`} url={inst.url} />
            <P muted>{inst.note}</P>
          </View>
        ))}
      </Card>

      <P muted>
        Rules, fees and deadlines change every year. Information last reviewed {country.lastReviewed}; always confirm on the
        official sites linked in each route.
      </P>
      <Button variant="secondary" label="Start again" onPress={() => router.replace('/quiz')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  eyebrow: { fontSize: 12, fontWeight: '700', color: colors.accent, textTransform: 'uppercase', letterSpacing: 0.6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  flag: { fontSize: 44 },
  verdict: { fontSize: 15, color: colors.accent, fontWeight: '600', marginTop: 2 },
  more: { fontSize: 14, color: colors.accent, fontWeight: '600' },
  otherRow: { fontSize: 15, lineHeight: 24, color: colors.text },
  essentialTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
});
