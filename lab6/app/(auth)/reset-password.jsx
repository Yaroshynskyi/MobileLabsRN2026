import { useRouter } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { authentication } from "../../firebase/config";
import { styles } from "./login";

export default function ResetPasswordScreen() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handlePasswordReset = async () => {
    if (!email) {
      setError("Введіть email адресу");
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(authentication, email);
      Alert.alert(
        "Лист надіслано",
        "Перевірте свою пошту для відновлення паролю.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (e) {
      if (e.code === "auth/user-not-found") {
        setError("Акаунт з таким email не знайдено");
      } else if (e.code === "auth/invalid-email") {
        setError("Невірний формат email адреси");
      } else {
        setError("Не вдалося надіслати лист. Спробуйте ще раз.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Відновлення паролю</Text>
      <Text style={styles.description}>
        Введіть email адресу вашого облікового запису. 
        Ми надішлемо вам посилання для встановлення нового паролю.
      </Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#666"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        returnKeyType="done"
        onSubmitEditing={handlePasswordReset}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={handlePasswordReset} 
        disabled={isLoading}
      >
        {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Надіслати лист</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={{alignItems: 'center', marginTop: 20}} onPress={() => router.back()}>
        <Text style={styles.linkText}>Повернутись до входу</Text>
      </TouchableOpacity>
    </View>
  );
}