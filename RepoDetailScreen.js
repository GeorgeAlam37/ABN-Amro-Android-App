import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons'; // Assuming you're using Expo and have Feather icons installed
import NetInfo from '@react-native-community/netinfo';

const RepoDetailScreen = ({ route }) => {
  const { repo } = route.params;
  const [isConnected, setIsConnected] = useState(true); // Default to true if network status is unknown

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe(); // Cleanup when component unmounts
    };
  }, []);

  const openBrowser = () => {
    if (isConnected) {
      Linking.openURL(repo.html_url);
    } else {
      // Handle case when there's no internet connection
      console.log('No internet connection. Unable to open URL.');
      // Optionally, you can show a message to the user indicating no internet connection
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{repo.name} Details</Text>
      <View style={styles.detailContainer}>
        <DetailItem label="Name" value={repo.name} />
        <DetailItem label="Full Name" value={repo.full_name} />
        <DetailItem label="Description" value={repo.description} />
        <DetailItem label="Visibility" value={repo.visibility} />
        <DetailItem label="Access" value={repo.private ? 'Private' : 'Public'} />
      </View>
      <TouchableOpacity onPress={openBrowser} style={styles.button}>
        <Feather name="external-link" size={24} color="white" style={styles.buttonIcon} />
        <Text style={styles.buttonText}>Open in Browser</Text>
      </TouchableOpacity>
    </View>
  );
};

const DetailItem = ({ label, value }) => (
  <View style={styles.detailItem}>
    <Text style={styles.label}>{label}:</Text>
    <Text numberOfLines={3} ellipsizeMode="tail" style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 70,
    marginTop: 30,
    textAlign: 'center',
  },
  detailContainer: {
    marginBottom: 70,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 20,
  },
  button: {
    backgroundColor: 'lightgreen',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 10,
    color: '#000',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 18,
  },
  value: {
    flex: 1, // Ensure the value text takes up remaining space
    flexWrap: 'wrap', // Allow wrapping of long text
  },
});

export default RepoDetailScreen;
