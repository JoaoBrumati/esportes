import React from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { BasketballScreen } from './connections/Basquete.js';
import { AppScreen } from './connections/Futebol.js';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

// Primeira Tela (Tela com fundo com imagem)
const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.homeContainer}>
      <Image source={require('./assets/bg-app.jpg')} style={styles.backgroundImage} />
      <Text style={styles.title}>Bem-vindo ao App Esportes</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="API Futebol"
          onPress={() => navigation.navigate('AppScreen')}
          color="#000" 
          backgroundColor="#fff"
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="API Basketball"
          onPress={() => navigation.navigate('BasketballScreen')}
          color="#000" 
          backgroundColor="#fff"
        />
      </View>
    </View>
  );
};

// Tela do App para a API de Futebol


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AppScreen" component={AppScreen} options={{ title: 'API Futebol' }} />
        <Stack.Screen name="BasketballScreen" component={BasketballScreen} options={{ title: 'API Basketball' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  buttonContainer: {
    marginVertical: 10,
    width: '80%',
  },
  text: {
    fontSize: 16,
    color: '#333',
  } 
});
