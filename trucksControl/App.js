import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import  Login  from './src/Pages/Login/Login'
import HomePage from './src/Pages/HomePage/HomePage'
import TrucksList from './src/Pages/TrucksList/TrucksList';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="HomePage" component={HomePage} />
        <Stack.Screen name="TrucksList" component={TrucksList} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
