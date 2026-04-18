import { useRouter } from "expo-router";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useRef, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { authentication } from "../../firebase/config";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { setFirebaseUser } = useAuth();
  const router = useRouter();
  const passwordRef = useRef();

  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Заповніть всі поля");
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const res = await signInWithEmailAndPassword(authentication, email, password);
      const user = res.user;

      if (!user.emailVerified) {
        Alert.alert("Email не підтверджено", "Підтвердьте акаунт перед входом.");
        await signOut(authentication);
        setFirebaseUser(null);
        return;
      }
      
      setFirebaseUser(user);
    } catch (err) {
      setError("Невірний Email або Пароль");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Увійти</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#666"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current.focus()}
      />
      
      <TextInput
        ref={passwordRef}
        style={styles.input}
        placeholder="Пароль"
        placeholderTextColor="#666"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        returnKeyType="done"
        onSubmitEditing={handleSignIn}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={handleSignIn} 
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Увійти</Text>
        )}
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Немає облікового запису? </Text>
        <TouchableOpacity onPress={() => router.replace("/(auth)/register")}>
          <Text style={styles.linkText}>Зареєструватись</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={{marginTop: 15}} onPress={() => router.push("/(auth)/reset-password")}>
        <Text style={styles.linkText}>Забули пароль?</Text>
      </TouchableOpacity>
    </View>
  );
}

export const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 30, textAlign: "center", color: "#333" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 15, marginBottom: 15, fontSize: 16 },
  button: { backgroundColor: "#3d5af1", padding: 15, borderRadius: 8, alignItems: "center", marginTop: 10 },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  errorText: { color: "red", marginBottom: 10, textAlign: "center" },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
  footerText: { color: "#666", fontSize: 14 },
  linkText: { color: "#3d5af1", fontSize: 14, fontWeight: "bold" },
  description: { textAlign: 'center', marginBottom: 20, color: '#666', fontSize: 16 }
});