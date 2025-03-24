import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import useLocation from "../hooks/useLocation";
import { getCurrentMall } from "../utils/mallLocator";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Button } from "react-native";

interface Mall {
  id: string;
  name: string;
  center: {
    lat: number;
    lng: number;
  };
  radius: number;
}

const HomeScreen = () => {
  const { location, errorMsg } = useLocation();
  const [currentMall, setCurrentMall] = useState<Mall | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  useEffect(() => {
    if (location) {
      const matchedMall = getCurrentMall(location.latitude, location.longitude);
      setCurrentMall(matchedMall);
      setLoading(false);
    }
  }, [location]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AVM Sohbet Uygulaması</Text>

      {errorMsg ? (
        <Text style={styles.error}>{errorMsg}</Text>
      ) : loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : currentMall ? (
        <>
          <Text style={styles.mallText}>
            Hoş geldin, {currentMall.name} içindesin 🎉
          </Text>
          <Button
            title="Sohbete Katıl"
            onPress={() => navigation.navigate("Chat")}
          />
        </>
      ) : (
        <Text style={styles.mallText}>
          Şu anda desteklenen bir AVM’de değilsin.
        </Text>
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  mallText: {
    fontSize: 18,
    textAlign: "center",
  },
  error: {
    color: "red",
    fontSize: 16,
  },
});
