import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { Button, Card, colors, H1, H2, P, Screen } from '../components/ui';
import { countries } from '../data/italy';

export default function Home() {
  return (
    <Screen>
      <View style={{ gap: 10, paddingTop: 12 }}>
        <H1>Find where to study or work next</H1>
        <P muted>
          Answer eight quick questions about your field, your level and your goals. We match you with the countries and
          the routes that fit, and show what to do next.
        </P>
      </View>
      <Button label="Start" onPress={() => router.push('/quiz')} />
      <Card>
        <H2>What we cover right now</H2>
        {countries.map((c) => (
          <Text key={c.id} style={{ fontSize: 16, color: colors.text }}>
            {c.flag} {c.name}
          </Text>
        ))}
        <P muted>Field: education and research, from a bachelor's degree to a faculty post or a teaching job.</P>
        <P muted>More countries and fields are coming.</P>
      </Card>
    </Screen>
  );
}
