// App.js
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import HomeFeedScreen from './screens/HomeFeedScreen';
import CreateBetScreen from './screens/CreateBetScreen';
import BetDetailScreen from './screens/BetDetailScreen';
import ActiveBetsScreen from './screens/ActiveBetsScreen';
import SettlementScreen from './screens/SettlementScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import ProfileScreen from './screens/ProfileScreen';

import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen name="Home" component={HomeFeedScreen} />
            <Stack.Screen name="CreateBet" component={CreateBetScreen} />
            <Stack.Screen name="BetDetail" component={BetDetailScreen} />
            <Stack.Screen name="ActiveBets" component={ActiveBetsScreen} />
            <Stack.Screen name="Settlement" component={SettlementScreen} />
            <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
