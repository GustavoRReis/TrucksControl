import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Button,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { auth, firestore } from '../../../database/firebaseConfig';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import Modal from 'react-native-modal';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Asset } from 'expo-asset';

function HomePage({ navigation }) {
  const [isTruckModalVisible, setTruckModalVisible] = useState(false);
  const [isOperatorModalVisible, setOperatorModalVisible] = useState(false);
  const [isRepairModalVisible, setIsRepairModalVisible] = useState(false);

  const [truckModel, setTruckModel] = useState('3/4');
  const [truckBrand, setTruckBrand] = useState('Scania');
  const [truckYear, setTruckYear] = useState('');
  const [truckPlate, setTruckPlate] = useState('');

  const [operatorName, setOperatorName] = useState('');
  const [operatorEmail, setOperatorEmail] = useState('');
  const [operatorPassword, setOperatorPassword] = useState('');

  const { currentUser } = auth;

  const [user, setUser] = useState();
  const [loading, setLoading] = useState();

 
  useEffect(() => {
    const fetchUserByEmail = async () => {
      try {
        setLoading(true);
        const usersRef = collection(firestore, 'users');
        const q = query(usersRef, where('email', '==', currentUser.email));

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            setUser(doc.data());
          });
          setLoading(false);
        } else {
          console.log('Nenhum documento encontrado com esse email.');
          setLoading(false);
        }
      } catch (error) {
        console.error('Erro ao buscar documento:', error);
        setLoading(false);
      }
    };
    fetchUserByEmail();
  }, []);

  const imageMap = {
    '3/4': require('../../../assets/34.png'),
    Carreta: require('../../../assets/carreta.png'),
    Toco: require('../../../assets/toco.png'),
    Truck: require('../../../assets/truck.png'),
  };

  const handleSaveTruck = async () => {
    try {
      const imageSource = imageMap[truckModel];

      if (!imageSource) {
        throw new Error('Modelo de caminhão não encontrado');
      }

      const asset = Asset.fromModule(imageSource);
      await asset.downloadAsync();

      const response = await fetch(asset.localUri || asset.uri);
      const blob = await response.blob();

      const storage = getStorage();
      const imageRef = ref(storage, `truckImages/${truckModel}.png`);

      await uploadBytes(imageRef, blob);

      const downloadURL = await getDownloadURL(imageRef);

      const truckData = {
        model: truckModel,
        brand: truckBrand,
        year: truckYear,
        plate: truckPlate,
        imageTruck: downloadURL,
      };

      const truckRef = doc(firestore, 'trucks', truckPlate);
      await setDoc(truckRef, truckData);

      setTruckModel('3/4');
      setTruckBrand('');
      setTruckYear('');
      setTruckPlate('');
      setTruckModalVisible(false);
    } catch (error) {
      console.error('Erro ao salvar caminhão:', error);
    }
  };

  const handleSaveOperator = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        operatorEmail,
        operatorPassword
      );
      const uid = userCredential.user.uid;

      const operatorData = {
        name: operatorName,
        email: operatorEmail,
        isManager: false,
      };

      const userRef = doc(firestore, 'users', uid);
      await setDoc(userRef, operatorData);

      setOperatorName('');
      setOperatorEmail('');
      setOperatorPassword('');
      setOperatorModalVisible(false);
    } catch (error) {
      console.error('Erro ao salvar operador:', error);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator />
      ) : user?.isManager ? (
        <>
          <Image
            source={require('../../../assets/truckLogo.png')}
            style={styles.banner}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => setTruckModalVisible(true)}
              style={styles.button}
            >
              <MaterialCommunityIcons
                name="truck-outline"
                size={28}
                color="white"
              />
              <Text style={styles.buttonText}>Cadastrar Caminhão</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setOperatorModalVisible(true)}
              style={styles.button}
            >
              <Ionicons name="person-add-outline" size={24} color="white" />
              <Text style={styles.buttonText}>Cadastrar Operador</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('TrucksList')}
            style={styles.cardContainer}
          >
            <Image
              style={styles.cardImage}
              source={require('../../../assets/34.png')}
            />
            <Text style={styles.cardText}>Listar Caminhões</Text>
          </TouchableOpacity>

          <View style={styles.cardContainer}>
            <Image
              style={styles.cardImage}
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/256/4284/4284101.png',
              }}
            />
            <Text style={styles.cardText}>Listar Operadores</Text>
          </View>

          <Modal
            isVisible={isTruckModalVisible}
            onBackdropPress={() => setTruckModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <Text>Placa:</Text>
              <TextInput
                style={styles.input}
                value={truckPlate}
                onChangeText={setTruckPlate}
              />

              <Text>Modelo:</Text>
              <Picker
                selectedValue={truckModel}
                onValueChange={(itemValue) => setTruckModel(itemValue)}
                style={styles.input}
              >
                <Picker.Item label="3/4" value="3/4" />
                <Picker.Item label="Carreta" value="Carreta" />
                <Picker.Item label="Toco" value="Toco" />
                <Picker.Item label="Truck" value="Truck" />
              </Picker>
              <Text>Marca:</Text>
              <Picker
                selectedValue={truckBrand}
                onValueChange={(itemValue) => setTruckBrand(itemValue)}
                style={{ backgroundColor: '#ccc' }}
              >
                <Picker.Item label="Scania" value="Scania" />
                <Picker.Item label="Iveco" value="Iveco" />
                <Picker.Item label="Mercedez-Benz" value="Mercedez-Benz" />
                <Picker.Item label="Volvo" value="Volvo" />
                <Picker.Item label="Volkswagen" value="Volkswagen" />
              </Picker>
              <Text>Ano:</Text>
              <TextInput
                style={styles.input}
                value={truckYear}
                onChangeText={setTruckYear}
                keyboardType="numeric"
              />

              <Button title="Cadastrar" onPress={handleSaveTruck} />
              <Button
                title="Cancelar"
                onPress={() => setTruckModalVisible(false)}
              />
            </View>
          </Modal>

          <Modal
            isVisible={isOperatorModalVisible}
            onBackdropPress={() => setOperatorModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <Text>Nome:</Text>
              <TextInput
                style={styles.input}
                value={operatorName}
                onChangeText={setOperatorName}
              />
              <Text>Email:</Text>
              <TextInput
                style={styles.input}
                value={operatorEmail}
                onChangeText={setOperatorEmail}
                keyboardType="email-address"
              />
              <Text>Senha:</Text>
              <TextInput
                style={styles.input}
                value={operatorPassword}
                onChangeText={setOperatorPassword}
                secureTextEntry
              />
              <Button title="Salvar" onPress={handleSaveOperator} />
              <Button
                title="Cancelar"
                onPress={() => setOperatorModalVisible(false)}
              />
            </View>
          </Modal>
        </>
      ) : (
        <>
          <Image
            source={require('../../../assets/truckLogo.png')}
            style={styles.banner}
          />

          <Text style={{ textAlign: 'center' }}>Bem vindo {user?.name}</Text>
          <TouchableOpacity
            onPress={() => setIsRepairModalVisible(true)}
            style={styles.repairButton}
          >
            <Text style={styles.repairButtonText}>Adicionar Reparo</Text>
          </TouchableOpacity>

          <Modal
            isVisible={isRepairModalVisible}
            onBackdropPress={() => setIsRepairModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <Text>Placa:</Text>
              <TextInput
                style={styles.input}
                value={operatorName}
                onChangeText={setOperatorName}
              />

              <Text>Modelo:</Text>
              <Picker
                selectedValue={truckModel}
                onValueChange={(itemValue) => setTruckModel(itemValue)}
                style={{ backgroundColor: '#ccc' }}
              >
                <Picker.Item label="3/4" value="3/4" />
                <Picker.Item label="Carreta" value="carreta" />
                <Picker.Item label="Toco" value="toco" />
                <Picker.Item label="Truck" value="truck" />
              </Picker>

              <Text>Email:</Text>
              <TextInput
                style={styles.input}
                value={operatorEmail}
                onChangeText={setOperatorEmail}
                keyboardType="email-address"
              />

              <Button title="Salvar" onPress={handleSaveOperator} />
              <Button
                title="Cancelar"
                onPress={() => setIsRepairModalVisible(false)}
              />
            </View>
          </Modal>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    /*  backgroundColor: '#D3D3D3', */
  },
  banner: {
    width: '100%',
    height: 250,
    resizeMode: 'contain',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    marginTop: -20,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#344976',
    padding: 16,
    flex: 1,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  cardContainer: {
    backgroundColor: '#344976',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 16,
    marginHorizontal: 2,
  },
  cardImage: {
    width: '100%',
    height: 120,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  repairButton: {
    marginTop: 16,
    backgroundColor: '#344976',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: '100%',
    height: 100,
  },

  repairButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default HomePage;
