import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from "firebase/auth";
import { useRef, useState } from "react";
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { authentication } from "../../firebase/config";
import { styles } from "./login";
export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const passwordRef = useRef();
  const confirmRef = useRef();

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      setError("Заповніть всі поля");
      return;
    }
    if (password !== confirmPassword) {
      setError("Паролі не співпадають");
      return;
    }
    if (password.length < 6) {
      setError("Пароль повинен містити мінімум 6 символів");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const { user } = await createUserWithEmailAndPassword(authentication, email, password);
      await sendEmailVerification(user);
      await signOut(authentication);
      
      Alert.alert(
        "Підтвердьте пошту",
        "Ми надіслали лист на вашу пошту. Підтвердьте її, перш ніж входити в систему.",
        [{ text: "OK", onPress: () => router.replace("/(auth)/login") }]
      );
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("Акаунт з таким email вже існує");
      } else if (err.code === "auth/invalid-email") {
        setError("Невірний формат email адреси");
      } else {
        setError("Помилка реєстрації. Спробуйте ще раз.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Реєстрація</Text>
      
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
        returnKeyType="next"
        onSubmitEditing={() => confirmRef.current.focus()}
      />

      <TextInput
        ref={confirmRef}
        style={styles.input}
        placeholder="Підтвердження паролю"
        placeholderTextColor="#666"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        returnKeyType="done"
        onSubmitEditing={handleSignUp}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={handleSignUp} 
        disabled={isLoading}
      >
        {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Зареєструватись</Text>}
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Вже маєте акаунт? </Text>
        <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
          <Text style={styles.linkText}>Увійти</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}