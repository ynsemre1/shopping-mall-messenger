import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/types";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { auth } from "../services/firebase";

const CURRENT_USER_ID = "user1"; // Şimdilik sabit kullanıcı

const ChatScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, "Chat">>();
  const { mallId, mallName } = route.params;

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");

  const uid = auth.currentUser?.uid;

  useEffect(() => {
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
    if (input.trim() === "") return;

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

  const renderItem = ({ item }: { item: any }) => {
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
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{mallName} Chat Odası</Text>

      <FlatList
        data={messages}
        inverted
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />

      <View style={styles.inputContainer}>
        <TextInput
          value={input}
          onChangeText={setInput}
          style={styles.input}
          placeholder="Mesaj yaz..."
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Text style={styles.sendText}>Gönder</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: "#fff" },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  messageContainer: {
    flexDirection: "row",
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingHorizontal: 6,
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
  sendText: {
    color: "#fff",
    fontWeight: "bold",
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 6,
    maxWidth: "80%",
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
});
