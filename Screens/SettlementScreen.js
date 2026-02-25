// screens/SettlementScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, FlatList, TouchableOpacity } from 'react-native';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

export default function SettlementScreen({ navigation }) {
  const [pendingBets, setPendingBets] = useState([]);

  useEffect(() => {
    // Fetch bets where current user is creator or acceptor and status is accepted
    const q = query(
      collection(db, 'bets'),
      where('status', '==', 'accepted')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const filtered = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(b => b.creator_id === auth.currentUser.uid || b.acceptor_id === auth.currentUser.uid);
      setPendingBets(filtered);
    });

    return unsubscribe;
  }, []);

  const settleBet = async (bet, winnerId) => {
    try {
      const betRef = doc(db, 'bets', bet.id);
      await updateDoc(betRef, {
        winner_id: winnerId,
        status: 'settled',
        settled_at: serverTimestamp(),
      });

      Alert.alert('Bet Settled', `Winner set successfully`);
    } catch (error) {
      console.log('Settle error:', error);
      Alert.alert('Error', 'Failed to settle bet');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.description}</Text>
      <Text>Stake: ${item.stake}</Text>
      <Text>Status: {item.status}</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.buttonWinner}
          onPress={() => settleBet(item, auth.currentUser.uid)}
        >
          <Text style={styles.buttonText}>I Won</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonLoser}
          onPress={() => settleBet(item, item.creator_id === auth.currentUser.uid ? item.acceptor_id : item.creator_id)}
        >
          <Text style={styles.buttonText}>Opponent Won</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {pendingBets.length === 0 ? (
        <Text style={styles.emptyText}>No bets to settle.</Text>
      ) : (
        <FlatList
          data={pendingBets}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  card: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 15, marginBottom: 10 },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  buttonWinner: { backgroundColor: '#28a745', padding: 10, borderRadius: 5, flex: 0.48 },
  buttonLoser: { backgroundColor: '#dc3545', padding: 10, borderRadius: 5, flex: 0.48 },
  buttonText: { color: 'white', textAlign: 'center' },
  emptyText: { textAlign: 'center', marginTop: 20, fontSize: 16 },
});
