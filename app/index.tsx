import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  Keyboard,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

export default function App() {
  const router = useRouter();

  const [roomNumber, setRoomNumber] = useState('');
  const [guestName, setGuestName] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [guestCount, setGuestCount] = useState(0);

  const handleCheckIn = async () => {
    Keyboard.dismiss();
    try {
      const res = await fetch(
        'https://goood-morning-verified-clean.onrender.com/checkin/room',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ room_number: roomNumber }),
        }
      );
      const data = await res.json();
      if (data.message === 'Room check simulated') {
        data.message = 'Room data received.';
      }
      setResponse(data);

      // Default guestCount to remaining entitlement
      const entitled = data.entitlement?.num_people || 0;
      const consumed = data.entitlement?.consumed || 0;
      const remaining = Math.max(entitled - consumed, 0);
      setGuestCount(remaining);
    } catch (error) {
      setResponse({ error: 'Could not reach server' });
    }
  };

  const handleNameSearch = () => {
    Keyboard.dismiss();
    setResponse({ message: `Searching for guest "${guestName}"...` });
  };

  const confirmGuests = () => {
    router.push({
      pathname: '/confirmation',
      params: {
        room: response.room,
        entitled: response.entitlement?.num_people || 0,
        entered: guestCount,
      },
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* Hotel Bar */}
          <View style={styles.hotelBar}>
            <Image
              source={{
                uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Hotell_Icon.svg/1024px-Hotell_Icon.svg.png',
              }}
              style={styles.logo}
            />
            <Text style={styles.hotelName}>HOTEL NORDIC SUN</Text>
          </View>

          {/* Title */}
          <Text style={styles.heading}>GOOOD MORNING</Text>

          {/* Staff Greeting */}
          <Text style={styles.greeting}>
            {'\n'}Welcome! Tap below to check in guest.{'\n'}
          </Text>

          {/* Room Input + CHECK Button */}
          <View style={styles.row}>
            <TextInput
              style={styles.inputField}
              placeholder="ROOM NUMBER"
              placeholderTextColor="#555"
              value={roomNumber}
              onChangeText={(text) => setRoomNumber(text.toUpperCase())}
              autoCapitalize="characters"
              keyboardType="number-pad"
            />
            <Pressable style={styles.actionButton} onPress={handleCheckIn}>
              <Text style={styles.buttonText}>CHECK</Text>
            </Pressable>
          </View>

          {/* Name Search Row */}
          <View style={styles.row}>
            <TextInput
              style={styles.inputField}
              placeholder="SEARCH LAST NAME"
              placeholderTextColor="#555"
              value={guestName}
              onChangeText={setGuestName}
              autoCapitalize="words"
            />
            <Pressable style={styles.actionButton} onPress={handleNameSearch}>
              <Text style={styles.buttonText}>SEARCH</Text>
            </Pressable>
          </View>

          {/* Response Summary */}
          {response && (
            <View style={styles.result}>
              <Text style={styles.resultText}>
                Room: {response.room || 'N/A'}
              </Text>
              <Text style={styles.resultText}>
                Breakfast Included:{' '}
                {response.entitlement?.breakfast_included ? 'Yes' : 'No'}
              </Text>
              <Text style={styles.resultText}>
                People Entitled: {response.entitlement?.num_people}
              </Text>
              <Text style={styles.resultText}>
                {response.message || response.error}
              </Text>
            </View>
          )}

          {/* Guest Count Picker */}
          {response?.entitlement && (
            <View style={styles.guestSelector}>
              <Text style={styles.resultText}>Guests now arriving:</Text>
              <View style={styles.counterRow}>
                <Pressable
                  style={styles.counterButton}
                  onPress={() => setGuestCount(Math.max(guestCount - 1, 0))}
                >
                  <Text style={styles.counterText}>–</Text>
                </Pressable>
                <View style={styles.circle}>
                  <Text style={styles.circleText}>{guestCount}</Text>
                </View>
                <Pressable
                  style={styles.counterButton}
                  onPress={() => setGuestCount(guestCount + 1)}
                >
                  <Text style={styles.counterText}>+</Text>
                </Pressable>
              </View>
              <Pressable style={styles.actionButton} onPress={confirmGuests}>
                <Text style={styles.buttonText}>CONFIRM</Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#c0c0c0',
  },
  container: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  hotelBar: {
    width: '100%',
    backgroundColor: '#FFB100',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  hotelName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
  },
  heading: {
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#FF6600',
    textAlign: 'center',
  },
  greeting: {
    fontSize: 18,
    color: '#444',
    marginBottom: 10,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginVertical: 10,
    width: '85%',
  },
  inputField: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 14,
    fontSize: 20,
    backgroundColor: '#fff',
  },
  actionButton: {
    width: 120,
    backgroundColor: '#FFB100',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    paddingVertical: 14,
  },
  result: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '85%',
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  resultText: {
    fontSize: 18,
    marginBottom: 8,
    color: '#333',
  },
  guestSelector: {
    marginTop: 20,
    alignItems: 'center',
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  counterButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFB100',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterText: {
    fontSize: 32,
    color: '#fff',
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFB100',
  },
  circleText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6600',
  },
});
