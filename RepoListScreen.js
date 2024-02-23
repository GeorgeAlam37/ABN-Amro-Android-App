import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Animated, Easing } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';
import { initDatabase, saveReposToDatabase, getReposFromDatabase } from './database';
import partner from './assets/partner1.png';

// Logo component
const Logo = () => (
  <View style={styles.logoContainer}>
    <Image source={partner} style={styles.logo} />
  </View>
);

const RepoListScreen = ({ navigation }) => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listHeight] = useState(new Animated.Value(0));
  const [scrollY] = useState(new Animated.Value(0));
  const logoOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  const netInfo = useNetInfo();

  useEffect(() => {
    // Initialize database when the component mounts
    initDatabase();

    const fetchData = async () => {
      try {
        if (netInfo.isConnected) {
          const response = await fetch(
            'https://api.github.com/users/abnamrocoesd/repos?page=1&per_page=10'
          );
          const jsonData = await response.json();
          setRepos(jsonData);
          setLoading(false);
          animateList();
          // Cache the fetched data
          saveReposToDatabase(jsonData);
        } else {
          // If no network connection, use cached data from the database
          const cachedRepos = await getReposFromDatabase();
          if (cachedRepos.length > 0) {
            setRepos(cachedRepos);
            setLoading(false);
            animateList();
          } else {
            console.log('No cached data available and no network connection.');
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [netInfo.isConnected]);

  const animateList = () => {
    Animated.timing(listHeight, {
      toValue: 1,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('RepoDetail', { repo: item })}>
      <Animated.View style={[styles.itemContainer, { height: listHeight.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 120],
      }) }]}>
        {item && item.owner && item.owner.avatar_url && ( // Check if item and its properties are defined
          <>
            <Image source={{ uri: item.owner.avatar_url }} style={styles.avatar} />
            <View style={styles.textContainer}>
              <Text style={styles.repoName}>{item.name}</Text>
              <Text>Visibility: {item.visibility}</Text>
              <Text>{item.private ? 'Private' : 'Public'}</Text>
            </View>
          </>
        )}
      </Animated.View>
    </TouchableOpacity>
  );

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
  );

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, { opacity: logoOpacity, top: 0 }]}>
        <Logo />
      </Animated.View>
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" style={styles.loadingIndicator} />
      ) : (
        <Animated.FlatList
          data={repos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingTop: 200 }}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    padding: 25,
    backgroundColor: 'white',
  },
  logoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    alignItems: 'center',
    marginBottom: 0,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  loadingIndicator: {
    marginTop: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'lightgreen',
    borderRadius: 30,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  textContainer: {
    marginLeft: 15,
  },
  repoName: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
  },
});

export default RepoListScreen;
