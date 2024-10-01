import { View, Text, StyleSheet, Image } from 'react-native';
import React from 'react';

const CardMechanics = ({ mechanic }) => {
  return (
    <View key={mechanic?.id} style={styles.card}>
      <Image source={ require('../../../assets/mechanicUser.png')} style={styles.image} />
      <Text style={styles.text}>Nome: {mechanic?.name}</Text>
      <Text style={styles.text}>Empresa: {mechanic?.enterprise}</Text>
      <Text style={styles.text}>Email: {mechanic?.email}</Text>
    </View>
  );
};

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
    margin: 26
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

export default CardMechanics;
