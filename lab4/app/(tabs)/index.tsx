import { Directory, File, Paths } from 'expo-file-system';
import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const rootDir = new Directory(Paths.document);

export default function App() {
  const [currentDir, setCurrentDir] = useState<Directory>(rootDir);
  const [items, setItems] = useState<(Directory | File)[]>([]);

  const loadDirectoryContents = async (dir: Directory) => {
    try {
      if (!dir.exists) {
        dir.create({ intermediates: true });
      }
      
      const dirItems = await dir.list();
      
      const sortedItems = dirItems.sort((a: Directory | File, b: Directory | File) => {
        if (a instanceof Directory && b instanceof File) return -1;
        if (a instanceof File && b instanceof Directory) return 1;
        return a.name.localeCompare(b.name);
      });

      setItems(sortedItems);
    } catch (error) {
      console.error("Помилка читання директорії:", error);
    }
  };

  useEffect(() => {
    loadDirectoryContents(currentDir);
  }, [currentDir]);

  const handlePressItem = (item: Directory | File) => {
    if (item instanceof Directory) {
      setCurrentDir(item);
    } else {
      console.log("Клікнули на файл:", item.name);
    }
  };

  const handleGoUp = () => {
    if (currentDir.uri !== rootDir.uri) {
      setCurrentDir(currentDir.parentDirectory);
    }
  };

  const renderItem = ({ item }: { item: Directory | File }) => {
    const isFolder = item instanceof Directory;
    return (
      <TouchableOpacity 
        style={[styles.itemContainer, isFolder ? styles.folderItem : styles.fileItem]} 
        onPress={() => handlePressItem(item)}
      >
        <Text style={styles.itemIcon}>{isFolder ? '📁' : '📄'}</Text>
        <Text style={styles.itemName}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.breadcrumb} numberOfLines={1}>
          Шлях: /{Paths.relative(rootDir.uri, currentDir.uri) || 'Головна'}
        </Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity 
          style={[styles.upButton, currentDir.uri === rootDir.uri && styles.disabledButton]} 
          onPress={handleGoUp}
          disabled={currentDir.uri === rootDir.uri}
        >
          <Text style={styles.buttonText}>⬆ Вгору</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.uri}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>Папка порожня</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 40,
  },
  header: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  breadcrumb: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  controls: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  upButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 10,
    marginBottom: 5,
    borderRadius: 8,
  },
  folderItem: {
    backgroundColor: '#e6f2ff',
  },
  fileItem: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
  },
  itemIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  itemName: {
    fontSize: 16,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
    fontSize: 16,
  }
});