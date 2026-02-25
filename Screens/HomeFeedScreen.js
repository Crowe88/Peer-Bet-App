// screens/HomeFeedScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';

export default function HomeFeedScreen({ navigation }) {
  const [bets, setBets] = useState([]);

  useEffect(() => {
    // Listen to all open bets
    const q = query(collection(db, 'bets'), where('status', '==', 'open'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const betList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBets(betList);
    });

    return unsubscribe;
  }, []);

  const acceptBet = async (betId) => {
    try {
      const betRef = doc(db, 'bets', betId);
      await updateDoc(betRef, {
        status: 'accepted',
        acceptor_id: auth.currentUser.uid,
      });
      navigation.navigate('BetDetail', { betId });
    } catch (error) {
      console.log('Accept bet error:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.description}</Text>
      <Text>Stake: ${item.stake}</Text>
      <Text>Created by: {item.creator_name || 'Anonymous'}</Text>
      <TouchableOpacity onPress={() => acceptBet(item.id)} style={styles.button}>
        <Text style={styles.buttonText}>Accept Bet</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {bets.length === 0 ? (
        <Text style={styles.emptyText}>No open bets right now.</Text>
      ) : (
        <FlatList
          data={bets}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}
      <Button title="Create New Bet" onPress={() => navigation.navigate('CreateBet')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  card: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 15, marginBottom: 10 },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  button: { marginTop: 10, backgroundColor: '#007bff', padding: 10, borderRadius: 5 },
  buttonText: { color: 'white', textAlign: 'center' },
  emptyText: { textAlign: 'center', marginTop: 20, fontSize: 16 },
});
