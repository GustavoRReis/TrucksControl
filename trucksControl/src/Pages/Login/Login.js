// src/screens/LoginScreen.js
import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image } from 'react-native';




const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    navigation.navigate('HomePage')
    
  }
  
  return (
    <View style={styles.container}>
      <View>
        <Image style={styles.image} source={require('../../../assets/logo.png')} />
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
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  header: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  image: {
    width: 300,
    resizeMode: 'contain'
  }
});

export default Login;
