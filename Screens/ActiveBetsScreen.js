// screens/ActiveBetsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export default function ActiveBetsScreen({ navigation }) {
  const [bets, setBets] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, 'bets'),
      where('creator_id', '==', auth.currentUser.uid)
    );

    const unsubscribeCreator = onSnapshot(q, (snapshot) => {
      const creatorBets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBets(prev => {
        const acceptorBets = prev.filter(b => b.acceptor_id === auth.currentUser.uid && b.creator_id !== auth.currentUser.uid);
        return [...creatorBets, ...acceptorBets];
      });
    });

    const q2 = query(
      collection(db, 'bets'),
      where('acceptor_id', '==', auth.currentUser.uid)
    );

    const unsubscribeAcceptor = onSnapshot(q2, (snapshot) => {
      const acceptorBets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBets(prev => {
        const creatorBets = prev.filter(b => b.creator_id === auth.currentUser.uid);
        return [...creatorBets, ...acceptorBets];
      });
    });

    return () => {
      unsubscribeCreator();
      unsubscribeAcceptor();
    };
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('BetDetail', { betId: item.id })} style={styles.card}>
      <Text style={styles.title}>{item.description}</Text>
      <Text>Stake: ${item.stake}</Text>
      <Text>Status: {item.status}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {bets.length === 0 ? (
        <Text style={styles.emptyText}>No active bets.</Text>
      ) : (
        <FlatList
          data={bets}
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
  emptyText: { textAlign: 'center', marginTop: 20, fontSize: 16 },
});
