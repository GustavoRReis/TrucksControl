import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React from 'react';

const TrucksList = () => {
  const trucks = {
    // Dados dos caminhões
    ABC1234: {
      model: 'Scania',
      numeroDeManutencoes: 3,
      underRepair: true,
      type: 'truck',
      pneus: {
        pneuFrontalDireito: { estado: 'bom', km: 2000, trocas: 3 },
        pneuFrontalEsquerdo: { estado: 'bom', km: 2100, trocas: 2 },
        pneuTraseiroDireito: { estado: 'usado', km: 5000, trocas: 1 },
        pneuTraseiroEsquerdo: { estado: 'usado', km: 4800, trocas: 1 },
      },
    },
    DEF5678: {
      model: 'Volvo',
      numeroDeManutencoes: 2,
      underRepair: false,
      type: 'truck',
      pneus: {
        pneuFrontalDireito: { estado: 'novo', km: 1500, trocas: 0 },
        pneuFrontalEsquerdo: { estado: 'novo', km: 1500, trocas: 0 },
        pneuTraseiroDireito: { estado: 'bom', km: 2500, trocas: 1 },
        pneuTraseiroEsquerdo: { estado: 'bom', km: 2400, trocas: 1 },
      },
    },
    GHI9012: {
      model: 'Mercedes-Benz',
      numeroDeManutencoes: 5,
      underRepair: true,
      type: 'truck',
      pneus: {
        pneuFrontalDireito: { estado: 'usado', km: 4000, trocas: 2 },
        pneuFrontalEsquerdo: { estado: 'usado', km: 4100, trocas: 2 },
        pneuTraseiroDireito: { estado: 'ruim', km: 7000, trocas: 3 },
        pneuTraseiroEsquerdo: { estado: 'ruim', km: 6800, trocas: 3 },
      },
    },
    JKL3456: {
      model: 'Iveco',
      numeroDeManutencoes: 1,
      underRepair: false,
      type: 'truck',
      pneus: {
        pneuFrontalDireito: { estado: 'bom', km: 3500, trocas: 1 },
        pneuFrontalEsquerdo: { estado: 'bom', km: 3450, trocas: 1 },
        pneuTraseiroDireito: { estado: 'novo', km: 1000, trocas: 0 },
        pneuTraseiroEsquerdo: { estado: 'novo', km: 950, trocas: 0 },
      },
    },
    MNO7890: {
      model: 'DAF',
      numeroDeManutencoes: 4,
      underRepair: true,
      type: 'truck',
      pneus: {
        pneuFrontalDireito: { estado: 'bom', km: 2300, trocas: 1 },
        pneuFrontalEsquerdo: { estado: 'bom', km: 2250, trocas: 1 },
        pneuTraseiroDireito: { estado: 'usado', km: 5200, trocas: 2 },
        pneuTraseiroEsquerdo: { estado: 'usado', km: 5100, trocas: 2 },
      },
    },
  };

  return (
    <ScrollView style={styles.container}>
      {Object.keys(trucks).map((key) => {
        const truck = trucks[key];
        return (
          <View key={key} style={styles.card}>
            <Text style={styles.title}>Model: {truck.model}</Text>
            <Text>Manutenções: {truck.numeroDeManutencoes}</Text>
            <Text>Under Repair: {truck.underRepair ? 'Sim' : 'Não'}</Text>
            <Text>Tipo: {truck.type}</Text>
            <Text style={styles.subTitle}>Pneus:</Text>
            {Object.keys(truck.pneus).map((pneuKey) => {
              const pneu = truck.pneus[pneuKey];
              return (
                <View key={pneuKey} style={styles.pneuContainer}>
                  <Text>
                    {pneuKey.replace(/([A-Z])/g, ' $1').toUpperCase()}:
                  </Text>
                  <Text>Estado: {pneu.estado}</Text>
                  <Text>KM: {pneu.km}</Text>
                  <Text>Trocas: {pneu.trocas}</Text>
                </View>
              );
            })}
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  pneuContainer: {
    marginBottom: 10,
  },
});

export default TrucksList;
