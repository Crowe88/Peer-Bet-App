// screens/CreateBetScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function CreateBetScreen({ navigation }) {
  const [description, setDescription] = useState('');
  const [stake, setStake] = useState('');

  const handleCreateBet = async () => {
    if (!description || !stake) {
      Alert.alert('Error', 'Please enter a description and stake amount');
      return;
    }

    try {
      await addDoc(collection(db, 'bets'), {
        description: description,
        stake: parseFloat(stake),
        creator_id: auth.currentUser.uid,
        creator_name: auth.currentUser.email, // optionally store username
        status: 'open',
        acceptor_id: null,
        winner_id: null,
        created_at: serverTimestamp(),
      });

      Alert.alert('Success', 'Bet created successfully');
      setDescription('');
      setStake('');
      navigation.navigate('Home');
    } catch (error) {
      console.log('Create bet error:', error);
      Alert.alert('Error', 'Failed to create bet');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a New Bet</Text>
      <TextInput
        placeholder="Bet description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <TextInput
        placeholder="Stake ($)"
        value={stake}
        onChangeText={setStake}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button title="Create Bet" onPress={handleCreateBet} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 },
});
