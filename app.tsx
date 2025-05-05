import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function App() {
  const [roomNumber, setRoomNumber] = useState('');
  const [response, setResponse] = useState<any>(null);

  const handleCheckIn = async () => {
    try {
      const res = await fetch('https://goood-morning-verified-clean.onrender.com/checkin/room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ room_number: roomNumber }),
      });
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setResponse({ error: 'Could not reach server' });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Goood Morning</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Room Number"
        value={roomNumber}
        onChangeText={setRoomNumber}
        keyboardType="numeric"
      />
      <Button title="Check In" onPress={handleCheckIn} />

      {response && (
        <View style={styles.result}>
          <Text>Room: {response.room || 'N/A'}</Text>
          <Text>Breakfast Included: {response.entitlement?.breakfast_included ? 'Yes' : 'No'}</Text>
          <Text>People: {response.entitlement?.num_people}</Text>
          <Text>{response.message || response.error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 },
  result: { marginTop: 20 },
});
