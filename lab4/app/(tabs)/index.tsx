import { Directory, File, Paths } from 'expo-file-system';
import React, { useEffect, useState } from 'react';
import { Alert, Button, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const rootDir = new Directory(Paths.document, 'Lab4_FileManager');

export default function App() {
  const [currentDir, setCurrentDir] = useState<Directory>(rootDir);
  const [items, setItems] = useState<(Directory | File)[]>([]);

  // Стани для створення
  const [modalVisible, setModalVisible] = useState(false);
  const [creationType, setCreationType] = useState<'folder' | 'file'>('folder');
  const [newItemName, setNewItemName] = useState('');
  const [newItemContent, setNewItemContent] = useState('');

  // Стани для читання/редагування файлу
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState('');
  const [fileInfo, setFileInfo] = useState<any>(null);

  const loadDirectoryContents = async (dir: Directory) => {
    try {
      const createRes = dir.create({ intermediates: true, idempotent: true });
      if ((createRes as any) instanceof Promise) await createRes;

      const dirItems = await dir.list();
      
      const sortedItems = dirItems.sort((a, b) => {
        if (a instanceof Directory && b instanceof File) return -1;
        if (a instanceof File && b instanceof Directory) return 1;
        return a.name.localeCompare(b.name);
      });
      
      setItems([...sortedItems]);
    } catch (error: any) {
      Alert.alert("Помилка читання директорії", error.message);
    }
  };

  useEffect(() => {
    loadDirectoryContents(currentDir);
  }, [currentDir]);

  // Обробка натискання на елемент
  const handlePressItem = async (item: Directory | File) => {
    if (item instanceof Directory) {
      setCurrentDir(item); // Перехід у папку
    } else if (item instanceof File) {
      // Зчитування файлу
      try {
        const content = await item.text();
        const info = await item.info(); // Отримання метаданих файлу
        
        setSelectedFile(item);
        setFileContent(content);
        setFileInfo(info);
        setViewModalVisible(true); // Відкриваємо вікно редагування
      } catch (error: any) {
        Alert.alert("Помилка", "Не вдалося відкрити файл: " + error.message);
      }
    }
  };

  const handleGoUp = () => {
    if (currentDir.uri !== rootDir.uri) {
      setCurrentDir(currentDir.parentDirectory);
    }
  };

  const openModal = (type: 'folder' | 'file') => {
    setCreationType(type);
    setNewItemName('');
    setNewItemContent('');
    setModalVisible(true);
  };

  const handleCreate = async () => {
    if (!newItemName.trim()) {
      Alert.alert("Увага", "Введіть назву!");
      return;
    }

    try {
      if (creationType === 'folder') {
        const newDir = new Directory(currentDir, newItemName.trim());
        const res = newDir.create({ intermediates: true, idempotent: true });
        if ((res as any) instanceof Promise) await res;
      } else {
        const fileName = newItemName.trim().endsWith('.txt') ? newItemName.trim() : `${newItemName.trim()}.txt`;
        const newFile = new File(currentDir, fileName);
        const res = newFile.write(newItemContent || ' ');
        if ((res as any) instanceof Promise) await res;
      }
      
      setModalVisible(false);
      await loadDirectoryContents(currentDir);
    } catch (error: any) {
      Alert.alert("Помилка створення", error.message);
    }
  };

  // Збереження змін у файлі
  const handleSaveEdit = async () => {
    if (selectedFile) {
      try {
        const res = selectedFile.write(fileContent);
        if ((res as any) instanceof Promise) await res;
        
        Alert.alert("Успіх", "Зміни збережено!");
        setViewModalVisible(false);
        await loadDirectoryContents(currentDir); // Оновлюємо список, щоб оновилась дата модифікації
      } catch (error: any) {
        Alert.alert("Помилка збереження", error.message);
      }
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
          style={[styles.btn, currentDir.uri === rootDir.uri && styles.btnDisabled]} 
          onPress={handleGoUp}
          disabled={currentDir.uri === rootDir.uri}
        >
          <Text style={styles.btnText}>⬆ Вгору</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.btn, styles.btnSuccess]} onPress={() => openModal('folder')}>
          <Text style={styles.btnText}>+ Папка</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, styles.btnSuccess]} onPress={() => openModal('file')}>
          <Text style={styles.btnText}>+ Файл</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.uri}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>Папка порожня</Text>}
      />

      {/* Модалка створення */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {creationType === 'folder' ? 'Нова папка' : 'Новий текстовий файл'}
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder="Введіть назву..."
              value={newItemName}
              onChangeText={setNewItemName}
            />

            {creationType === 'file' && (
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Введіть початковий текст..."
                value={newItemContent}
                onChangeText={setNewItemContent}
                multiline
              />
            )}

            <View style={styles.modalButtons}>
              <Button title="Скасувати" color="#888" onPress={() => setModalVisible(false)} />
              <Button title="Створити" onPress={handleCreate} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Модалка читання/редагування */}
      <Modal visible={viewModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Редагування файлу</Text>
            
            {/* Блок з інформацією про файл (Завдання 6) */}
            {fileInfo && selectedFile && (
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>Назва: {selectedFile.name}</Text>
                <Text style={styles.infoText}>Розмір: {fileInfo.size} байт</Text>
                <Text style={styles.infoText}>
                  Змінено: {new Date(fileInfo.modificationTime).toLocaleString()}
                </Text>
              </View>
            )}

            <TextInput
              style={[styles.input, styles.textArea, { height: 150 }]}
              value={fileContent}
              onChangeText={setFileContent}
              multiline
            />

            <View style={styles.modalButtons}>
              <Button title="Закрити" color="#888" onPress={() => setViewModalVisible(false)} />
              <Button title="Зберегти" onPress={handleSaveEdit} />
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { padding: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#ddd' },
  breadcrumb: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  controls: { flexDirection: 'row', padding: 10, backgroundColor: '#fff', gap: 10, marginBottom: 5 },
  btn: { flex: 1, paddingVertical: 10, backgroundColor: '#007bff', borderRadius: 5, alignItems: 'center' },
  btnSuccess: { backgroundColor: '#28a745' },
  btnDisabled: { backgroundColor: '#ccc' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  itemContainer: { flexDirection: 'row', alignItems: 'center', padding: 15, marginHorizontal: 10, marginBottom: 5, borderRadius: 8 },
  folderItem: { backgroundColor: '#e6f2ff' },
  fileItem: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#eee' },
  itemIcon: { fontSize: 24, marginRight: 15 },
  itemName: { fontSize: 16, color: '#333' },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#888', fontSize: 16 },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '90%', backgroundColor: '#fff', padding: 20, borderRadius: 10, elevation: 5 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 15, fontSize: 16 },
  textArea: { height: 100, textAlignVertical: 'top' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-around' },
  
  // Стилі для блоку інформації
  infoBox: { backgroundColor: '#e9ecef', padding: 10, borderRadius: 5, marginBottom: 15 },
  infoText: { fontSize: 12, color: '#495057', marginBottom: 3 }
});