import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  Modal,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, { useState } from 'react';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { firestore } from '../../../database/firebaseConfig';
import CardTruck from '../../components/CardTruck/CardTruck';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const CreateRepair = () => {
  const [plate, setPlate] = useState('');
  const [truck, setTruck] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tires, setTires] = useState([]);
  const [tireConditions, setTireConditions] = useState({});
  const navigation = useNavigation();

  const handleSearch = async () => {
    if (!plate.trim()) {
      Alert.alert('Erro', 'Por favor, insira uma placa');
      return;
    }

    try {
      const truckDocRef = doc(firestore, 'trucks', plate.toUpperCase());
      const truckDoc = await getDoc(truckDocRef);

      if (truckDoc.exists()) {
        setTruck(truckDoc.data());
      } else {
        Alert.alert('Erro', 'Caminhão não encontrado');
        setTruck(null);
      }
    } catch (error) {
      console.error('Erro ao buscar caminhão:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao buscar o caminhão');
    }
  };

  const handleOpenRepairModal = () => {
    if (truck) {
      const tireCount =
        {
          '3/4': 4,
          toco: 4,
          truck: 6,
          carreta: 10,
        }[truck.model.toLowerCase()] || 0;

      const tireList = Array.from({ length: tireCount }, (_, index) => ({
        id: index + 1,
        name: `Pneu ${index + 1}`,
      }));

      setTires(tireList);
      setIsModalVisible(true);
    }
  };

  const handleTireConditionChange = (id, field, value) => {
    setTireConditions((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleCompleteRepair = async () => {
    if (!truck || tires.length === 0) {
      Alert.alert('Erro', 'Nenhum caminhão ou pneus disponíveis');
      return;
    }

    const hasEmptyFields = tires.some((tire) => {
      const conditions = tireConditions[tire.id] || {};
      const isRotation = conditions.movement === 'rotation';
      return (
        !conditions.position ||
        !conditions.newPressure ||
        !conditions.grooveDepth ||
        !conditions.movement ||
        (isRotation && !conditions.rotationTarget)
      );
    });

    if (hasEmptyFields) {
      Alert.alert(
        'Erro',
        'Por favor, preencha todos os campos de todos os pneus'
      );
      return;
    }

    const tireData = tires.map((tire) => {
      const conditions = tireConditions[tire.id] || {};
      return {
        tireId: tire.id,
        name: tire.name,
        lastPressure: conditions.lastPressure || '',
        newPressure: conditions.newPressure,
        grooveDepth: conditions.grooveDepth,
        movement: conditions.movement,
        rotationTarget:
          conditions.movement === 'rotation' ? conditions.rotationTarget : null,
      };
    });

    try {
      const truckDocRef = doc(firestore, 'trucks', plate.toUpperCase());
      const repairCollectionRef = collection(truckDocRef, 'repair');

      await addDoc(repairCollectionRef, {
        tires: tireData,
        createdAt: new Date(),
      });

      const updatedTires = {};
      tireData.forEach((tire) => {
        if (tire.movement === 'rotation' && tire.rotationTarget) {
          updatedTires[tire.rotationTarget] = {
            id: tire.tireId,
            name: tire.name,
            lastPressure: tire.newPressure,
            grooveDepth: tire.grooveDepth,
          };
        } else {
          updatedTires[tire.tireId] = {
            id: tire.tireId,
            name: tire.name,
            lastPressure: tire.newPressure,
            grooveDepth: tire.grooveDepth,
          };
        }
      });

      const tiresCollectionRef = collection(truckDocRef, 'tires');
      const batch = writeBatch(firestore);

      Object.keys(updatedTires).forEach((position) => {
        const tireRef = doc(tiresCollectionRef, position);
        batch.set(tireRef, updatedTires[position]);
      });

      await batch.commit();

      Alert.alert('Sucesso', 'Manutenção concluída com sucesso');
      setIsModalVisible(false);
    } catch (error) {
      console.error('Erro ao concluir manutenção:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao salvar o reparo');
    }
  };

  const renderTireItem = ({ item }) => (
    <View style={styles.tireItem}>
      <Text style={styles.tireText}>{item.name}</Text>
      <TextInput
        placeholder="Nova pressão"
        keyboardType="numeric"
        value={tireConditions[item.id]?.newPressure || ''}
        onChangeText={(value) =>
          handleTireConditionChange(item.id, 'newPressure', value)
        }
        style={styles.input}
      />
      <TextInput
        placeholder="Profundidade do sulco (mm)"
        keyboardType="numeric"
        value={tireConditions[item.id]?.grooveDepth || ''}
        onChangeText={(value) =>
          handleTireConditionChange(item.id, 'grooveDepth', value)
        }
        style={styles.input}
      />
      <Picker
        selectedValue={tireConditions[item.id]?.movement || ''}
        onValueChange={(value) =>
          handleTireConditionChange(item.id, 'movement', value)
        }
        style={styles.picker}
      >
        <Picker.Item label="Selecione a movimentação" value="" />
        <Picker.Item label="Feito rodízio" value="rotation" />
        <Picker.Item label="Foi para o conserto" value="repair" />
        <Picker.Item label="Foi para a recapagem" value="retreading" />
        <Picker.Item label="Foi para o estoque" value="stock" />
        <Picker.Item label="Foi vendido" value="sold" />
        <Picker.Item label="Foi sucateado" value="scrapped" />
      </Picker>

      {tireConditions[item.id]?.movement === 'rotation' && (
        <Picker
          selectedValue={tireConditions[item.id]?.rotationTarget || ''}
          onValueChange={(value) =>
            handleTireConditionChange(item.id, 'rotationTarget', value)
          }
          style={styles.picker}
        >
          <Picker.Item label="Selecione a posição de destino" value="" />
          {tires
            .filter((t) => t.id !== item.id)
            .map((t) => (
              <Picker.Item key={t.id} label={`Posição ${t.id}`} value={t.id} />
            ))}
        </Picker>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text
          style={{
            marginTop: 6,
            paddingTop: 24,
            fontSize: 20,
            paddingBottom: 16,
          }}
        >
          Voltar
        </Text>
      </TouchableOpacity>
      <Text style={styles.title}>Criar um reparo</Text>
      <TextInput
        placeholder="Digite a placa do caminhão"
        value={plate}
        onChangeText={setPlate}
        style={styles.input}
      />
      <Button title="Buscar" onPress={handleSearch} />
      {truck && (
        <TouchableOpacity
          style={{ marginTop: 12 }}
          onPress={handleOpenRepairModal}
        >
          <CardTruck truck={truck} />
        </TouchableOpacity>
      )}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Pneus do caminhão</Text>
          <FlatList
            data={tires}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderTireItem}
            contentContainerStyle={styles.listContent}
          />
          <TouchableOpacity
            style={{
              backgroundColor: '#344976',
              padding: 10,
              borderRadius: 8,
              alignItems: 'center',
              marginVertical: 10,
            }}
            onPress={handleCompleteRepair}
          >
            <Text style={{ color: 'white' }}>Concluir Manutenção</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: '#b8091e',
              padding: 10,
              borderRadius: 8,
              alignItems: 'center',
            }}
            onPress={() => setIsModalVisible(false)}
          >
            <Text style={{ color: 'white' }}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  tireItem: {
    padding: 10,
    marginVertical: 5,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
  },
  picker: {
    height: 50,
    width: '100%',
    marginTop: 8,
  },
  tireText: { fontSize: 16, marginBottom: 5 },
  picker: { height: 50, width: '100%' },
  modalContainer: { flex: 1, padding: 20, backgroundColor: '#fff' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  listContent: { paddingBottom: 20 },
});

export default CreateRepair;
