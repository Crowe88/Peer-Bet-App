// screens/LeaderboardScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { db } from '../firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

export default function LeaderboardScreen() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, 'users'),
      orderBy('reputation_score', 'desc'),
      limit(20) // top 20 users
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(userList);
    });

    return unsubscribe;
  }, []);

  const renderItem = ({ item, index }) => (
    <View style={styles.row}>
      <Text style={styles.rank}>{index + 1}</Text>
      <Text style={styles.name}>{item.username || item.email}</Text>
      <Text style={styles.score}>{item.reputation_score}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#ccc' },
  rank: { width: 30, fontWeight: 'bold' },
  name: { flex: 1 },
  score: { width: 50, textAlign: 'right' },
});
