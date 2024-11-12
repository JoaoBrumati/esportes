import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, Image, ScrollView, StyleSheet} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export const AppScreen = () => {
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
  

  const styles = StyleSheet.create({
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
    
 
  });
  