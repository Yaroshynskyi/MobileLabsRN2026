import { Button, Text, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function CatalogScreen() {
  const { logout } = useAuth();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Каталог товарів (в розробці)</Text>
      <Button title="Вийти" onPress={logout} color="red" />
    </View>
  );
}