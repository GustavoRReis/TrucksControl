import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../../database/firebaseConfig';

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
    <ScrollView contentContainerStyle={styles.container}>
      {trucks.map((truck) => (
        <View key={truck.plate} style={styles.card}>
          <Image source={{ uri: truck.imageTruck }} style={styles.image} />
          <Text style={styles.text}>Marca: {truck.brand}</Text>
          <Text style={styles.text}>Modelo: {truck.model}</Text>
          <Text style={styles.text}>Placa: {truck.plate}</Text>
          <Text style={styles.text}>Ano: {truck.year}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    marginTop: 24
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
    resizeMode: 'contain'
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default TrucksList;
