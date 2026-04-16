import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Головна сторінка</Text>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="Перейти до Фотогалереї" 
          onPress={() => navigation.navigate('Gallery')} 
        />
      </View>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="Перейти до Профілю" 
          onPress={() => navigation.navigate('Profile')} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 30 
  },
  buttonContainer: {
    marginVertical: 10,
    width: '60%'
  }
});