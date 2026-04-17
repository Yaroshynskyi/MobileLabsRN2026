import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Ой!' }} />
      <View style={styles.container}>
        <Text style={styles.title}>Екран не знайдено</Text>
        
        <Link href="/" style={styles.link}>
          Повернутися на головну
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  link: {
    fontSize: 16,
    color: '#007AFF',
    marginTop: 15,
  },
});