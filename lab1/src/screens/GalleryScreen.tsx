import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';

const galleryData = Array.from({ length: 10 }).map((_, index) => ({
  id: index.toString(),
}));

export default function GalleryScreen({ navigation }: any) {
  const renderItem = () => (
    <View style={styles.photoCard} />
  );

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <FlatList data={galleryData} renderItem={renderItem} keyExtractor={item => item.id} numColumns={2}  columnWrapperStyle={styles.row}  contentContainerStyle={styles.listContent}/>
      <Footer/>
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
  row: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  photoCard: {
    width: '47%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
  }
});