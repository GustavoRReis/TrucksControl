import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import  Login  from './src/Pages/Login/Login'
import HomePage from './src/Pages/HomePage/HomePage'
import TrucksList from './src/Pages/TrucksList/TrucksList';
import CreateRepair from './src/Pages/CreateRepair/CreateRepair';
import MechanicsList from './src/Pages/MechanicsList/MechanicsList';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          options={{ headerShown: false }}
          name="Login"
          component={Login}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="HomePage"
          component={HomePage}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="TrucksList"
          component={TrucksList}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="MechanicList"
          component={MechanicsList}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="CreateRepair"
          component={CreateRepair}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
