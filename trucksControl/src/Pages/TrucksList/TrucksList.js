import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../../database/firebaseConfig';
import CardTruck from '../../components/CardTruck/CardTruck';

const TrucksList = () => {
  const [trucks, setTrucks] = useState([]);

  useEffect(() => {
    const fetchTrucks = async () => {
      try {
        const trucksCollection = collection(firestore, 'trucks');
        const trucksSnapshot = await getDocs(trucksCollection);
        const trucksList = trucksSnapshot.docs.map((doc) => ({
          plate: doc.id,
          ...doc.data(),
        }));
        setTrucks(trucksList);
      } catch (error) {
        console.error('Erro ao buscar caminhões:', error);
      }
    };

    fetchTrucks();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Caminhões</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {trucks.map((truck) => (
          <CardTruck key={truck.plate} truck={truck} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center', 
    marginTop: 20
  },
  scrollContainer: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
});

export default TrucksList;
