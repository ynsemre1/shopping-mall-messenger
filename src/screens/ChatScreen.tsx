import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/types";
import { RouteProp } from "@react-navigation/native";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db, auth } from "../services/firebase";
import useLocation from "../hooks/testUseLocation";
import { getCurrentMall } from "../utils/mallLocator";
import { SafeAreaView } from 'react-native-safe-area-context';

type ChatRouteProp = RouteProp<RootStackParamList, "Chat">;

const ChatScreen = () => {
  const route = useRoute<ChatRouteProp>();
  const [mallId, setMallId] = useState<string | null>(
    route.params?.mallId || null
  );
  const [mallName, setMallName] = useState<string | null>(
    route.params?.mallName || null
  );
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const { location } = useLocation();
  const uid = auth.currentUser?.uid;

  useEffect(() => {
    if (!mallId && location) {
      const matchedMall = getCurrentMall(location.latitude, location.longitude);
      if (matchedMall) {
        setMallId(matchedMall.id);
        setMallName(matchedMall.name);
      }
    }
  }, [location]);

  useEffect(() => {
    if (!mallId) return;

    const q = query(
      collection(db, "chats", mallId, "messages"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [mallId]);

  const handleSend = async () => {
    if (input.trim() === "" || !mallId || !uid) return;

    await addDoc(collection(db, "chats", mallId, "messages"), {
      text: input,
      createdAt: new Date(),
      user: {
        _id: uid,
        name: "Kullanıcı",
      },
    });

    setInput("");
  };

  if (!mallId || !mallName) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Konumdan AVM bilgisi alınıyor...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90} // iOS için tab bar yüksekliğine göre ayarlanabilir
    >
      <SafeAreaView style={styles.container} edges={['top']}>
        <Text style={styles.header}>{mallName} Chat Odası</Text>

        <View style={styles.messagesWrapper}>
          <FlatList
            data={messages}
            inverted
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const isOwnMessage = item.user?._id === uid;

              return (
                <View
                  style={[
                    styles.messageRow,
                    isOwnMessage ? styles.myMessage : styles.otherMessage,
                  ]}
                >
                  {!isOwnMessage && (
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>
                        {item.user?.name?.charAt(0).toUpperCase() || "?"}
                      </Text>
                    </View>
                  )}

                  <View
                    style={[
                      styles.bubble,
                      { backgroundColor: isOwnMessage ? "#DCF8C6" : "#f1f1f1" },
                    ]}
                  >
                    {!isOwnMessage && (
                      <Text style={styles.sender}>{item.user?.name}</Text>
                    )}
                    <Text style={styles.messageText}>{item.text}</Text>
                  </View>
                </View>
              );
            }}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            value={input}
            onChangeText={setInput}
            style={styles.input}
            placeholder="Mesaj yaz..."
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <Text style={{ color: "#fff" }}>Gönder</Text>
          </TouchableOpacity>
        </View>
        </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 12,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  messagesWrapper: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 6,
    maxWidth: "80%",
  },
  myMessage: {
    alignSelf: "flex-end",
    justifyContent: "flex-end",
  },
  otherMessage: {
    alignSelf: "flex-start",
    justifyContent: "flex-start",
  },
  bubble: {
    padding: 10,
    borderRadius: 10,
  },
  sender: {
    fontWeight: "bold",
    marginBottom: 4,
    color: "#555",
  },
  messageText: {
    fontSize: 16,
    color: "#000",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  avatarText: {
    color: "#fff",
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  loadingText: {
    fontSize: 16,
    marginTop: 12,
    color: "#555",
  },
});