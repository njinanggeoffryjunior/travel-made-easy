import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../components/ui';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.bg },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Wakavanti' }} />
        <Stack.Screen name="quiz" options={{ title: 'Your profile' }} />
        <Stack.Screen name="results" options={{ title: 'Your recommendation' }} />
        <Stack.Screen name="pathway/[id]" options={{ title: 'Pathway' }} />
      </Stack>
    </>
  );
}
