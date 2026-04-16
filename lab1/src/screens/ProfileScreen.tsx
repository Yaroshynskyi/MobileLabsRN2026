import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ProfileScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const handleRegister = () => {
    Alert.alert('Успіх', `Користувач ${firstName} ${lastName} успішно зареєстрований!`);
  };

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>Реєстрація</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Електронна пошта</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none"/>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Пароль</Text>
          <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry/>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Пароль (ще раз)</Text>
          <TextInput style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry/>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Прізвище</Text>
          <TextInput style={styles.input} value={lastName} onChangeText={setLastName}/>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ім'я</Text>
          <TextInput style={styles.input} value={firstName}   onChangeText={setFirstName} />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Зареєструватися</Text>
        </TouchableOpacity>
      </ScrollView>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'normal',
    textAlign: 'center',
    marginBottom: 20,
    color: '#000'
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});