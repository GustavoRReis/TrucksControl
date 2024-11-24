import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { auth, firestore } from '../../../database/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (auth.currentUser) {
      navigation.replace('HomePage');
    }
  }, []);

  const handleLogin = async () => {
    try {
      setErrorMessage('');

      if (!email || !password) {
        setErrorMessage('Por favor, preencha todos os campos.');
        return;
      }

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log('Usuário autenticado:', userCredential.user);
      const user = userCredential.user;

      const userDocRef = doc(firestore, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        console.log('Documento do usuário encontrado:', userDoc.data());
        navigation.replace('HomePage');
      } else {
        setErrorMessage('Usuário inválido ou não cadastrado.');
        console.log('Usuário não encontrado no Firestore.');
      }
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        setErrorMessage('Usuário não encontrado.');
      } else if (error.code === 'auth/wrong-password') {
        setErrorMessage('Senha incorreta.');
      } else {
        setErrorMessage(`Erro ao autenticar: ${error.message}`);
      }
      console.error('Erro ao autenticar:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.logoContainer}>
        <Image
          style={styles.image}
          source={require('../../../assets/logo.png')}
        />
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  image: {
    width: 250,
    height: 150,
    resizeMode: 'contain',
  },
  formContainer: {
    width: '100%',
    maxWidth: 380,
    paddingHorizontal: 16,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    height: 50,
    backgroundColor: '#344976',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 20,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    marginTop: 15,
    textAlign: 'center',
    fontSize: 14,
  },
});

export default Login;
