import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Image, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import axios from 'axios';
import { BasketballScreen } from './connections/Basquete.js';


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
const AppScreen = () => {
  const [rodadas, setRodadas] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loadingRodadas, setLoadingRodadas] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRodada, setSelectedRodada] = useState(null);
  let rodadasCache = null;

  const API_URL = 'https://api.api-futebol.com.br/v1/campeonatos/10/rodadas/';
  const API_KEY = 'live_5fe3246969ef434c65847a2e6109cf';

  const fetchRodadas = async () => {
    if (rodadasCache) {
      setRodadas(rodadasCache);
      setLoadingRodadas(false);
      return;
    }

    try {
      const response = await axios.get(API_URL, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        }
      });
      rodadasCache = response.data;
      setRodadas(response.data);
    } catch (error) {
      console.error("Erro ao buscar rodadas:", error);
      setError("Erro ao buscar rodadas.");
    } finally {
      setLoadingRodadas(false);
    }
  };

  //botão pesquisar
  const fetchMatches = async (rodada) => {
    setLoadingMatches(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const response = await axios.get(`${API_URL}${rodada}`, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        }
      });
      setMatches(response.data.partidas);
    } catch (error) {
      console.error("Erro ao buscar jogos da rodada:", error);
      setError("Erro ao buscar jogos da rodada.");
    } finally {
      setLoadingMatches(false);
    }
  };


  //hook react - a cada renderização ou alteração no componente ele chama a função
  useEffect(() => {
    fetchRodadas();
  }, []);

  //função do botão pesquisar
  const handleSearch = () => {
    if (selectedRodada) {
      fetchMatches(selectedRodada);
    }
  };

  return (
    //container
    <View style={styles.container}>
      <Text style={styles.title}>Selecione uma rodada:</Text>
      {/* select */}
      <Picker
        selectedValue={selectedRodada}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedRodada(itemValue)}
      >
        <Picker.Item label="Selecione uma rodada" value={null} />
        {rodadas.map(rodada => (
          <Picker.Item key={rodada.rodada} label={`Rodada ${rodada.rodada}`} value={rodada.rodada} />
        ))}
      </Picker>

        {/* resultados retornados */}
      <ScrollView contentContainerStyle={styles.scrollView}>
        {loadingRodadas || loadingMatches ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : error ? (
          <Text style={styles.text}>{error}</Text>
        ) : matches.length === 0 ? (
          <Text style={styles.text}>Nenhum jogo encontrado para esta rodada.</Text>
        ) : (
          matches.map((match, index) => (
            <View
              key={match.partida_id}
              style={[styles.matchContainer, { backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#ffffff' }]}
            >
              <View style={styles.teamContainer}>
                <Image source={{ uri: match.time_mandante.escudo }} style={styles.logo} />
                <Text style={styles.text}>{match.placar}</Text>
                <Image source={{ uri: match.time_visitante.escudo }} style={styles.logo} />
              </View>
              <Text style={styles.text}>
                Data: {match.data_realizacao} - Horário: {match.hora_realizacao}
              </Text>
              <Text style={styles.text}>Estádio: {match.estadio?.nome_popular || 'Estádio desconhecido'}</Text>
            </View>
          ))
        )}
      </ScrollView>

      <Button title="Pesquisar" onPress={handleSearch} />
    </View>
  );
};


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
  scrollView: {
    flexGrow: 1,
  },
  matchContainer: {
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  teamContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  picker: {
    height: 50,
    width: '100%',
    marginVertical: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  teamCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
});
