import { Stack, useLocalSearchParams } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';
import { PRODUCTS } from '../../../data/products';

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return (
      <View style={styles.centered}>
        <Stack.Screen options={{ title: 'Помилка' }} />
        <Text style={styles.errorText}>Товар не знайдено</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: product.name }} />
      
      <Image source={{ uri: product.image }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>{product.price} $</Text>
        <Text style={styles.descriptionLabel}>Опис:</Text>
        <Text style={styles.description}>{product.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: 300, backgroundColor: '#e5e5ea', resizeMode: 'contain' },
  infoContainer: { padding: 20 },
  name: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
  price: { fontSize: 24, color: '#007AFF', fontWeight: '600', marginBottom: 20 },
  descriptionLabel: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  description: { fontSize: 16, lineHeight: 24, color: '#333' },
  errorText: { fontSize: 18, color: 'red' }
});