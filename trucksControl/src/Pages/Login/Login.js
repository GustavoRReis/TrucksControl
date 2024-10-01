import { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image } from 'react-native';
import { auth, firestore } from '../../../database/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Estado para a mensagem de erro

  useEffect(() => {
    const authUser = auth;
    console.log('AUTH', authUser);
  }, []);

  const handleLogin = async () => {
    console.log('Iniciando processo de login...');
    try {
      // Limpar a mensagem de erro antes de tentar o login
      setErrorMessage('');

      // Validação simples de email e senha
      if (!email || !password) {
        setErrorMessage('Por favor, preencha todos os campos.');
        return;
      }

      console.log('auth', auth);
      console.log('email', email)
      console.log('senha', password)

      // Autenticar usuário com email e senha
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log('Usuário autenticado:', userCredential.user);
      const user = userCredential.user;

      // Verificar se o usuário está no Firestore
      const userDocRef = doc(firestore, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        // Usuário autenticado e existe no Firestore
        console.log('Documento do usuário encontrado:', userDoc.data());
        navigation.navigate('HomePage');
      } else {
        // Usuário autenticado, mas não encontrado no Firestore
        setErrorMessage('Usuário inválido ou não cadastrado.');
        console.log('Usuário não encontrado no Firestore.');
      }
    } catch (error) {
      // Tratar erros de autenticação
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
    <View style={styles.container}>
      <View>
        <Image
          style={styles.image}
          source={require('../../../assets/logo.png')}
        />
      </View>

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
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
        autoCapitalize="none"
      />
      <Button title="Entrar" onPress={handleLogin} />

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text> // Renderizar a mensagem de erro
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', 
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: 250,
    height: 400,
    resizeMode: 'contain', 
  },
  input: {
    width: '100%',
    maxWidth: 350, 
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: '#007BFF', 
    padding: 12,
    borderRadius: 8, 
    alignItems: 'center',
    marginTop: 16,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
    fontSize: 14,
  },
});


export default Login;
