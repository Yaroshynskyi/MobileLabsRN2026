import { Link, Stack } from 'expo-router';
import { Button, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { PRODUCTS } from '../../data/products';

export default function CatalogScreen() {
  const { logout } = useAuth();

  const renderItem = ({ item }) => (
    <Link href={`/details/${item.id}`} asChild>
      <Pressable style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>{item.price} $</Text>
        </View>
      </Pressable>
    </Link>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Text style={styles.header}>Каталог товарів</Text>
      
      <FlatList
        data={PRODUCTS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
      
      <View style={styles.footer}>
        <Button title="Вийти" onPress={logout} color="#ff3b30" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f7' },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 },
  list: { paddingHorizontal: 15 },
  card: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    marginBottom: 15, 
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3
  },
  image: { width: 80, height: 80, borderRadius: 8, backgroundColor: '#e5e5ea' },
  info: { marginLeft: 15, justifyContent: 'center', flex: 1 },
  name: { fontSize: 18, fontWeight: '600', marginBottom: 5 },
  price: { fontSize: 16, color: '#007AFF', fontWeight: 'bold' },
  footer: { padding: 20, paddingBottom: 40 }
});