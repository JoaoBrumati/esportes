import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, ScrollView } from 'react-native';


// Função para buscar dados de basquete
export const fetchBasquete = async () => {
    const API_URL = 'https://basketball-highlights-api.p.rapidapi.com/teams?limit=10';
    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          "x-rapidapi-key": "48fea6a2d7mshd7f100fda965afbp1941f3jsn834a5a8cc938",
          "x-rapidapi-host": "basketball-highlights-api.p.rapidapi.com"
        },
      });
  
      if (!response.ok) {
        throw new Error(`Erro ao buscar os dados: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro:', error);
      throw error;
    }
  };

  // Tela basquete
export const BasketballScreen = () => {
  const [times, setTimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchBasquete();
        const filteredTeams = data.data.filter(team => team.name !== 'Panevezys W' && team.name !== 'Perth');
        setTimes(filteredTeams);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar dados da API de basquete:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Erro: {error}</Text>
      </View>
    );
  }

  return (
    //container
    <View style={styles.container}>
      <Text style={styles.title}>Times de Basquete</Text>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {/* map vai percorrer a list de times que retorna da API */}
        {times.map((time) => (
          <View key={time.id} style={styles.teamCard}>
            <Image
              source={{ uri: time.logo }}
              style={styles.logo}
              // alt
              accessibilityLabel={`Logo do time ${time.name}`}
            />
            <Text style={styles.teamName}>{time.name}</Text>
          </View>
        ))}
      </ScrollView>
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
  logo: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  text: {
    fontSize: 16,
    color: '#333',
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


 

    


