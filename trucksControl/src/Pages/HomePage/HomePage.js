import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { auth, firestore } from '../../../database/firebaseConfig';
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import Modal from 'react-native-modal';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
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
  const [operatorEnterprise, setOperatorEnterprise] = useState('');
  const [operatorEmail, setOperatorEmail] = useState('');
  const [operatorPassword, setOperatorPassword] = useState('');

  const { currentUser } = auth;

  const [user, setUser] = useState();
  const [loading, setLoading] = useState();

  const handleLogout = async () => {
      await signOut(auth); 
      navigation.navigate('Login');
  };
 
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

     if (!truckModel || !truckBrand || !truckYear || !truckPlate) {
       Alert.alert(
          'Atenção',
         'Não é possível cadastrar um caminhão sem informar todos os dados!'
       );
       return;
     }

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

    if (
      !operatorName ||
      !operatorEmail ||
      !operatorPassword ||
      !operatorEnterprise
    ) {
       Alert.alert(
         'Atenção',
         'Não é possível cadastrar um operador sem informar todos os dados!'
       );
      return;
    }
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
        enterprise: operatorEnterprise,
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
    <ScrollView style={styles.container}>
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

          <TouchableOpacity
            onPress={() => navigation.navigate('MechanicList')}
            style={styles.cardContainer}
          >
            <Image
              style={styles.cardImage}
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/256/4284/4284101.png',
              }}
            />
            <Text style={styles.cardText}>Listar Operadores</Text>
          </TouchableOpacity>

          <Modal
            isVisible={isTruckModalVisible}
            onBackdropPress={() => setTruckModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Cadastrar Caminhão</Text>
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
                style={styles.input}
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
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleSaveTruck}
              >
                <Text style={styles.modalButtonText}>Cadastrar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setTruckModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </Modal>

          <Modal
            isVisible={isOperatorModalVisible}
            onBackdropPress={() => setOperatorModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Cadastrar Operador</Text>
              <Text>Nome:</Text>
              <TextInput
                style={styles.input}
                value={operatorName}
                onChangeText={setOperatorName}
              />
              <Text>Empresa:</Text>
              <TextInput
                style={styles.input}
                value={operatorEnterprise}
                onChangeText={setOperatorEnterprise}
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
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleSaveOperator}
              >
                <Text style={styles.modalButtonText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setOperatorModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
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
            onPress={() => navigation.navigate('CreateRepair')}
            style={styles.repairButton}
          >
            <Text style={styles.repairButtonText}>Adicionar Reparo</Text>
          </TouchableOpacity>
        </>
      )}
      <TouchableOpacity
          onPress={handleLogout}
          style={styles.button}
        >
          <MaterialCommunityIcons name="logout" size={28} color="white" />
          <Text style={styles.buttonText}>Sair</Text>
        </TouchableOpacity>
    </ScrollView>
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
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#344976',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#344976',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#b8091e',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
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
    marginBottom: 12
  },

  repairButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12
  },
});

export default HomePage;
