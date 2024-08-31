import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

function HomePage({ navigation }) {
  const [userHome, setUserHome] = useState();

  const auth = {
    user: {
      name: 'Gustavo',
      email: 'gustavobilireis@hotmail.com',
      isManager: true,
    },
  };

 

  return (
    <View>
      {auth.user.isManager ? (
        <View>
          <Text>Nome do usuario</Text>

          <TouchableOpacity onPress={() => navigation.navigate('TrucksList')} style={styles.button}>
            <Text>Lista de caminhões</Text>
          </TouchableOpacity>

          <Text>Listagem ou busca de operador/mecanico</Text>

          <Text></Text>

          <Text>Botao para cadastrar um operador</Text>
        </View>
      ) : (
        <>
          <Text>Botao para iniciar uma ordem de serviço</Text>
        </>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
 
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
  },
 
});


export default HomePage
