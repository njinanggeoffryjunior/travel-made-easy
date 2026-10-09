import { router, Stack, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { Bullets, Button, Card, ExternalLink, H1, H2, P, Screen } from '../../components/ui';
import { decodeAnswers } from '../../data/questions';
import { findPathway } from '../../lib/recommend';

export default function PathwayScreen() {
  const { id, c, a } = useLocalSearchParams<{ id: string; c?: string; a?: string }>();
  const found = findPathway(c ?? 'italy', id);
  const answers = decodeAnswers(a);

  if (!found) {
    return (
      <Screen>
        <H1>Route not found</H1>
        <Button label="Go home" onPress={() => router.replace('/')} />
      </Screen>
    );
  }

  const { country, pathway } = found;
  const assessment = answers ? pathway.assess(answers) : null;

  return (
    <Screen>
      <Stack.Screen options={{ title: `${country.flag} ${country.name}` }} />
      <View style={{ gap: 8 }}>
        <H1>{pathway.title}</H1>
        <P muted>{pathway.summary}</P>
      </View>

      {assessment ? (
        <Card>
          <H2>How it fits you · {assessment.score}/100</H2>
          {assessment.reasons.length ? <Bullets tone="good" items={assessment.reasons} /> : null}
          {assessment.cautions.length ? <Bullets tone="warn" items={assessment.cautions} /> : null}
        </Card>
      ) : null}

      <Section title="Requirements" items={pathway.requirements} />
      <Card>
        <H2>Costs</H2>
        <P>{pathway.costs}</P>
      </Card>
      <Section title="Funding" items={pathway.funding} />
      <Section title="Timeline" items={pathway.timeline} />
      <Card>
        <H2>Next steps</H2>
        <Bullets items={pathway.steps.map((s, i) => `${i + 1}. ${s}`)} />
      </Card>
      <Card>
        <H2>Official sources</H2>
        {pathway.links.map((l) => (
          <ExternalLink key={l.url} label={l.label} url={l.url} />
        ))}
      </Card>
      <P muted>Last reviewed {country.lastReviewed}. Confirm details on the official sites before applying.</P>
    </Screen>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <Card>
      <H2>{title}</H2>
      <Bullets items={items} />
    </Card>
  );
}
