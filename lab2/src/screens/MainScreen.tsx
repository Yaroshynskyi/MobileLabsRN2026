import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import NewsItem from '../components/NewsItem';
import { newsData } from '../data/newsData';

const PAGE_SIZE = 10;

const MainScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    setData(newsData.slice(0, PAGE_SIZE));
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setData(newsData.slice(0, PAGE_SIZE));
      setPage(1);
      setIsRefreshing(false);
    }, 1500);
  };

  const handleLoadMore = () => {
    if (isLoadingMore || data.length >= newsData.length) return;

    setIsLoadingMore(true);
    setTimeout(() => {
      const nextPage = page + 1;
      const newItems = newsData.slice(0, nextPage * PAGE_SIZE);
      setData(newItems);
      setPage(nextPage);
      setIsLoadingMore(false);
    }, 1500);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerText}>Стрічка новин</Text>
    </View>
  );

  const renderFooter = () => {
    if (!isLoadingMore) return <View style={{ height: 20 }} />;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#0000ff" />
      </View>
    );
  };

  const renderSeparator = () => <View style={styles.separator} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('Details', item)}>
            <NewsItem title={item.title} description={item.description} image={item.image} />
          </TouchableOpacity>
        )}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.2}
        
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ItemSeparatorComponent={renderSeparator}

        initialNumToRender={10}
        maxToRenderPerBatch={5}
        windowSize={5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  footer: {
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 10,
  },
});

export default MainScreen;