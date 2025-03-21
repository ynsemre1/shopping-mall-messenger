import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import useLocation from '../hooks/useLocation';
import { getNearbyMalls } from '../api/googlePlaces';
import { GooglePlace } from '../models/GooglePlace';

const HomeScreen = () => {
  const { location, errorMsg } = useLocation();
  const [malls, setMalls] = useState<GooglePlace[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (location) {
      fetchMalls();
    }
  }, [location]);

  const fetchMalls = async () => {
    if (!location) return;
    setLoading(true);
    const nearbyMalls = await getNearbyMalls(location.latitude, location.longitude);
    setMalls(nearbyMalls);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Yakındaki AVM’ler 🏢</Text>

      {errorMsg ? (
        <Text style={styles.error}>{errorMsg}</Text>
      ) : loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : malls.length > 0 ? (
        <FlatList
          data={malls}
          keyExtractor={(item: GooglePlace) => item.place_id}
          renderItem={({ item }: { item: GooglePlace }) => (
            <TouchableOpacity style={styles.mallCard} onPress={() => console.log(`Seçilen AVM: ${item.name}`)}>
              <Text style={styles.mallName}>{item.name}</Text>
              <Text style={styles.mallAddress}>{item.geometry.location.lat}, {item.geometry.location.lng}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.infoText}>Yakında AVM bulunamadı.</Text>
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
  infoText: {
    fontSize: 16,
    color: 'gray',
  },
  mallCard: {
    width: '100%',
    backgroundColor: '#f8f8f8',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  mallName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  mallAddress: {
    fontSize: 14,
    color: 'gray',
    marginTop: 4,
  },
});