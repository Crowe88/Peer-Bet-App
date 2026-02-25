// screens/BetDetailScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { db, auth } from '../firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

export default function BetDetailScreen({ route, navigation }) {
  const { betId } = route.params;
  const [bet, setBet] = useState(null);

  useEffect(() => {
    const fetchBet = async () => {
      try {
        const betRef = doc(db, 'bets', betId);
        const betSnap = await getDoc(betRef);
        if (betSnap.exists()) {
          setBet({ id: betSnap.id, ...betSnap.data() });
        } else {
          Alert.alert('Error', 'Bet not found');
          navigation.goBack();
        }
      } catch (error) {
        console.log('Fetch bet error:', error);
      }
    };

    fetchBet();
  }, [betId]);

  const settleBet = async (winnerId) => {
    if (!bet) return;
    try {
      const betRef = doc(db, 'bets', bet.id);
      await updateDoc(betRef, {
        winner_id: winnerId,
        status: 'settled',
        settled_at: serverTimestamp(),
      });

      Alert.alert('Success', 'Bet settled successfully');
      navigation.navigate('Home');
    } catch (error) {
      console.log('Settle bet error:', error);
      Alert.alert('Error', 'Failed to settle bet');
    }
  };

  if (!bet) return <Text>Loading...</Text>;

  const isCreator = bet.creator_id === auth.currentUser.uid;
  const isAcceptor = bet.acceptor_id === auth.currentUser.uid;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{bet.description}</Text>
      <Text>Stake: ${bet.stake}</Text>
      <Text>Creator: {bet.creator_name}</Text>
      <Text>Status: {bet.status}</Text>

      {bet.status === 'accepted' && (isCreator || isAcceptor) && (
        <View style={styles.buttonContainer}>
          <Button title="Settle: I Won" onPress={() => settleBet(auth.currentUser.uid)} />
          <Button title="Settle: Opponent Won" onPress={() => settleBet(isCreator ? bet.acceptor_id : bet.creator_id)} />
        </View>
      )}

      {bet.status === 'settled' && (
        <Text>Winner: {bet.winner_id === auth.currentUser.uid ? 'You' : 'Opponent'}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  buttonContainer: { marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' },
});
