import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../../database/firebaseConfig';
import CardMechanics from '../../components/CardMechanics/CardMechanics';

const MechanicsList = () => {
  const [mechanics, setMechanics] = useState([]);

  useEffect(() => {
    const fetchMechanics = async () => {
      try {
        const mechanicsCollection = collection(firestore, 'users');
        const trucksSnapshot = await getDocs(mechanicsCollection);
        const mechanicsList = trucksSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((mechanic) => mechanic.isManager === false);

        setMechanics(mechanicsList);
      } catch (error) {
        console.error('Erro ao buscar mecanicos:', error);
      }
    };

    fetchMechanics();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Mecânicos</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {mechanics.map((mechanic) => (
          <CardMechanics key={mechanic.id} mechanic={mechanic} />
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
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 22
  },
  scrollContainer: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
});

export default MechanicsList;
