import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';

export default function Header({ navigation }: any) {
  const route = useRoute();
  const currentRouteName = route.name;

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Image 
          source={require('../../assets/logoUni.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>FirstMobileApp</Text>
      </View>
      
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Home')}>
          <Text style={[styles.navText, currentRouteName === 'Home' && styles.activeNavText]}>
            Головна
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Gallery')}>
          <Text style={[styles.navText, currentRouteName === 'Gallery' && styles.activeNavText]}>
            Фотогалерея
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Profile')}>
          <Text style={[styles.navText, currentRouteName === 'Profile' && styles.activeNavText]}>
            Профіль
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  logo: {
    width: 150,
    height: 50,
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f8f8f8',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  navButton: { padding: 5 },
  navText: { 
    fontSize: 16, 
    color: '#888' 
  },
  activeNavText: { 
    color: '#007BFF'
  }
});