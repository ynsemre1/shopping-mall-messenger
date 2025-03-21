import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import useLocation from '../hooks/useLocation';

const HomeScreen = () => {
  const { location, errorMsg } = useLocation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AVM Sohbet Uygulaması</Text>

      {errorMsg ? (
        <Text style={styles.error}>{errorMsg}</Text>
      ) : location ? (
        <Text>Konumunuz: {location.latitude}, {location.longitude}</Text>
      ) : (
        <Text>Konum alınıyor...</Text>
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
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
  },
});