import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';

const newsData = [
  { id: '1', title: 'Заголовок новини 1', date: '16.04.2026', text: 'Короткий текст новини...', imageUrl: 'https://picsum.photos/id/1/200/150' },
  { id: '2', title: 'Заголовок новини 2', date: '15.04.2026', text: 'Короткий текст новини...', imageUrl: 'https://picsum.photos/id/2/200/150' },
  { id: '3', title: 'Заголовок новини 3', date: '14.04.2026', text: 'Короткий текст новини...', imageUrl: 'https://picsum.photos/id/3/200/150' },
  { id: '4', title: 'Заголовок новини 4', date: '13.04.2026', text: 'Короткий текст новини...', imageUrl: 'https://picsum.photos/id/4/200/150' },
  { id: '5', title: 'Заголовок новини 5', date: '12.04.2026', text: 'Короткий текст новини...', imageUrl: 'https://picsum.photos/id/5/200/150' },
];

export default function HomeScreen({ navigation }: any) {
  const renderItem = ({ item }: any) => (
    <View style={styles.newsItem}>
      <Image source={{ uri: item.imageUrl }} style={styles.newsImage} />
      <View style={styles.newsContent}>
        <Text style={styles.newsTitle}>{item.title}</Text>
        <Text style={styles.newsDate}>{item.date}</Text>
        <Text style={styles.newsText}>{item.text}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      
      <FlatList
        data={newsData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
      
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  listContent: { 
    padding: 15 
  },
  newsItem: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#fff',
    borderWidth: 1,         
    borderColor: '#ddd',
    alignItems: 'center', 
  },
  newsImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  newsContent: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  newsTitle: { 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  newsDate: { 
    fontSize: 12, 
    color: '#888', 
    marginVertical: 4 
  },
  newsText: { 
    fontSize: 13, 
    color: '#444' 
  }
});