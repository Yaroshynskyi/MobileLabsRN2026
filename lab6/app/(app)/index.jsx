import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { authentication, db } from "../../firebase/config";

export default function ProfileScreen() {
  const { firebaseUser, setFirebaseUser } = useAuth();
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!firebaseUser) return;
      try {
        const docRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || "");
          setAge(data.age ? data.age.toString() : "");
          setCity(data.city || "");
        }
      } catch (error) {
        console.error("Помилка завантаження профілю:", error);
      } finally {
        setIsFetching(false);
      }
    };

    loadProfile();
  }, [firebaseUser]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const docRef = doc(db, "users", firebaseUser.uid);
      await setDoc(docRef, {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name,
        age: parseInt(age, 10) || null,
        city,
      }, { merge: true });
      
      Alert.alert("Успіх", "Дані профілю збережено!");
    } catch (error) {
      Alert.alert("Помилка", "Не вдалося зберегти дані.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(authentication);
    setFirebaseUser(null);
  };

  if (isFetching) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#3d5af1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Мій Профіль</Text>
      <Text style={styles.emailText}>{firebaseUser?.email}</Text>

      <TextInput
        style={styles.input}
        placeholder="Ім'я"
        placeholderTextColor="#666"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Вік"
        placeholderTextColor="#666"
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
      />
      <TextInput
        style={styles.input}
        placeholder="Місто"
        placeholderTextColor="#666"
        value={city}
        onChangeText={setCity}
      />

      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={handleSave} 
        disabled={isLoading}
      >
        {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Зберегти дані</Text>}
      </TouchableOpacity>

      <View style={styles.footerContainer}>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Вийти з акаунту</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteNavButton} onPress={() => router.push("/(app)/delete-account")}>
          <Text style={styles.deleteNavText}>Видалити акаунт</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff", justifyContent: "center" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 5, textAlign: "center", color: "#333" },
  emailText: { fontSize: 16, color: "#666", textAlign: "center", marginBottom: 30 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 15, marginBottom: 15, fontSize: 16 },
  button: { backgroundColor: "#3d5af1", padding: 15, borderRadius: 8, alignItems: "center", marginTop: 10 },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  footerContainer: { marginTop: 40, gap: 15 },
  signOutButton: { padding: 15, borderRadius: 8, borderWidth: 1, borderColor: "#3d5af1", alignItems: "center" },
  signOutText: { color: "#3d5af1", fontSize: 16, fontWeight: "bold" },
  deleteNavButton: { padding: 15, borderRadius: 8, backgroundColor: "#fffEFE", borderWidth: 1, borderColor: "red", alignItems: "center" },
  deleteNavText: { color: "red", fontSize: 16, fontWeight: "bold" },
});