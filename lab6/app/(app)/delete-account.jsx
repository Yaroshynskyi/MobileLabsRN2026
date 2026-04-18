import { useRouter } from "expo-router";
import { deleteUser, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { deleteDoc, doc } from "firebase/firestore";
import { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { authentication, db } from "../../firebase/config";

export default function DeleteAccountScreen() {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { setFirebaseUser } = useAuth();
  const router = useRouter();

  const handleDelete = () => {
    if (!password) {
      setError("Введіть пароль для підтвердження");
      return;
    }

    Alert.alert(
      "Увага!",
      "Ви впевнені, що хочете назавжди видалити акаунт та всі свої дані?",
      [
        { text: "Скасувати", style: "cancel" },
        { 
          text: "Видалити", 
          style: "destructive",
          onPress: confirmDeletion 
        }
      ]
    );
  };

  const confirmDeletion = async () => {
    setIsLoading(true);
    setError(null);
    const user = authentication.currentUser;

    if (!user) {
      setError("Сесія закінчилась. Перезайдіть в акаунт.");
      setIsLoading(false);
      return;
    }

    try {
      //створюємо кренденціали для повторної перевірки
      const credential = EmailAuthProvider.credential(user.email, password);
      
      //повторна автентифікація
      await reauthenticateWithCredential(user, credential);

      //видаляємо дані з Firestore
      const userDocRef = doc(db, "users", user.uid);
      await deleteDoc(userDocRef);

      //видаляємо акаунт з FirebaseAuth
      await deleteUser(user);
      
      //очищаємо стан додатку
      setFirebaseUser(null);
      
      Alert.alert("Акаунт видалено", "Ваш обліковий запис успішно видалено.");
    } catch (err) {
      if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setError("Невірний пароль. Спробуйте ще раз.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Забагато спроб. Спробуйте пізніше.");
      } else {
        setError("Помилка видалення акаунту: " + err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Видалення акаунту</Text>
      <Text style={styles.warningText}>
        Ця дія є незворотною. Ваш профіль, налаштування та всі персональні дані будуть видалені назавжди.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Для підтвердження введіть пароль"
        placeholderTextColor="#666"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity 
        style={[styles.deleteButton, isLoading && styles.buttonDisabled]} 
        onPress={handleDelete} 
        disabled={isLoading}
      >
        {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.deleteButtonText}>Видалити назавжди</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()} disabled={isLoading}>
        <Text style={styles.cancelButtonText}>Скасувати</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff", justifyContent: "center" },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 15, textAlign: "center", color: "red" },
  warningText: { fontSize: 16, color: "#333", textAlign: "center", marginBottom: 30, backgroundColor: "#ffe6e6", padding: 15, borderRadius: 8, overflow: "hidden" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 15, marginBottom: 15, fontSize: 16 },
  deleteButton: { backgroundColor: "red", padding: 15, borderRadius: 8, alignItems: "center", marginTop: 10 },
  buttonDisabled: { opacity: 0.7 },
  deleteButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  cancelButton: { padding: 15, borderRadius: 8, alignItems: "center", marginTop: 15 },
  cancelButtonText: { color: "#666", fontSize: 16, fontWeight: "bold" },
  errorText: { color: "red", marginBottom: 10, textAlign: "center" },
});