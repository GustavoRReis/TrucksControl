import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  Modal,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { firestore } from '../../../database/firebaseConfig';
import CardTruck from '../../components/CardTruck/CardTruck';
import { Picker } from '@react-native-picker/picker';

const CreateRepair = () => {
  const [plate, setPlate] = useState('');
  const [truck, setTruck] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tires, setTires] = useState([]);
  const [tireConditions, setTireConditions] = useState({});

  console.log('Truck', truck);

  const handleSearch = async () => {
    if (plate === '') {
      return setTruck(null);
    }

    if (!plate) {
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
      let tireCount = 0;

      switch (truck.model.toLowerCase()) {
        case '3/4':
        case 'toco':
          tireCount = 4;
          break;
        case 'truck':
          tireCount = 6;
          break;
        case 'carreta':
          tireCount = 10;
          break;
        default:
          tireCount = 0;
      }

      const tireList = Array.from({ length: tireCount }, (_, index) => ({
        id: index + 1,
        name: `Pneu ${index + 1}`,
      }));

      setTires(tireList);
      setIsModalVisible(true);
    }
  };

  const handleTireConditionChange = (id, condition) => {
    setTireConditions((prevConditions) => ({
      ...prevConditions,
      [id]: condition,
    }));
  };

  const translateConditionToEnglish = (condition) => {
    switch (condition) {
      case 'Excelente':
        return 'Excellent';
      case 'Regular':
        return 'Regular';
      case 'Péssimo':
        return 'Bad';
      default:
        return condition;
    }
  };

  const handleCompleteRepair = async () => {
    if (!truck || tires.length === 0) {
      Alert.alert('Erro', 'Nenhum caminhão ou pneus disponíveis');
      return;
    }

    const tireData = tires.map((tire) => ({
      tire: tire.name,
      condition: translateConditionToEnglish(
        tireConditions[tire.id] || 'Excellent'
      ),
    }));

    try {
      const truckDocRef = doc(firestore, 'trucks', plate.toUpperCase());
      const repairCollectionRef = collection(truckDocRef, 'repair');
      await addDoc(repairCollectionRef, {
        tires: tireData,
        createdAt: new Date(), // Data da criação do reparo
      });

      Alert.alert('Sucesso', 'Manutenção concluída com sucesso');
      setIsModalVisible(false);
    } catch (error) {
      console.error('Erro ao concluir manutenção:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao salvar o reparo');
    }
  };

  const renderTireItem = ({ item }) => (
    <View
      style={{
        padding: 10,
        marginVertical: 5,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
      }}
    >
      <Text>{item.name}</Text>
      <Picker
        selectedValue={tireConditions[item.id] || 'Excelente'}
        onValueChange={(value) => handleTireConditionChange(item.id, value)}
        style={{ height: 50, width: 150 }}
      >
        <Picker.Item label="Excelente" value="Excelente" />
        <Picker.Item label="Regular" value="Regular" />
        <Picker.Item label="Péssimo" value="Péssimo" />
      </Picker>
    </View>
  );

  return (
    <View style={{ margin: 50 }}>
      <Text>Criar um reparo</Text>
      <TextInput
        placeholder="Digite a placa do caminhão"
        value={plate}
        onChangeText={setPlate}
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          marginBottom: 10,
          paddingHorizontal: 10,
        }}
      />
      <Button title="Buscar" onPress={handleSearch} />
      {truck && (
        <TouchableOpacity onPress={handleOpenRepairModal}>
          <CardTruck truck={truck} />
        </TouchableOpacity>
      )}

      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
            Pneus do caminhão
          </Text>
          <FlatList
            data={tires}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderTireItem}
          />
          <Button title="Concluir Manutenção" onPress={handleCompleteRepair} />
          <Button title="Fechar" onPress={() => setIsModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

export default CreateRepair;
