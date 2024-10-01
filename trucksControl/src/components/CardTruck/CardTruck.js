import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'

const CardTruck = ({truck}) => {
  return (
    <View key={truck?.plate} style={styles.card}>
      <Image source={{ uri: truck?.imageTruck }} style={styles.image} />
      <Text style={styles.text}>Marca: {truck?.brand}</Text>
      <Text style={styles.text}>Modelo: {truck?.model}</Text>
      <Text style={styles.text}>Placa: {truck?.plate}</Text>
      <Text style={styles.text}>Ano: {truck?.year}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
    resizeMode: 'contain',
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default CardTruck
