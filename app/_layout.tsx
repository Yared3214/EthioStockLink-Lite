import { Stack } from "expo-router";
import { RegistrationProvider } from './context/UserRegistrationContext';

export default function RootLayout() {
  return <RegistrationProvider>
  <Stack screenOptions={{
    headerShown: false
  }} />
  </RegistrationProvider>
;
}
