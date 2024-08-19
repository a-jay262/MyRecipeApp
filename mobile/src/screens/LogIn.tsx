import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { BASE_URL } from '../reducers/recipeSlice';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const LogInScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState<string>('');
  const [name, setName] = useState('');
  const [id, setId] = useState('');


  const handleLogIn = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        email,
        password,
      });
  
      if (response.data.success) {
        const imageUrl = `${BASE_URL}${response.data.image}`;
        setProfilePicture(imageUrl);
        setName(response.data.username);
  
        // Display profile picture URL and username directly
        //Alert.alert(`Profile Picture URL: ${imageUrl}`);
        //Alert.alert(`Username: ${response.data.username}`);
        //Alert.alert(`User ID: ${response.data.userId}`);
  
        // Navigate to MenuScreen with username, profilePicture, and userId
        navigation.navigate('MenuScreen', {
          username: response.data.username,
          profilePicture: imageUrl,
          id: response.data.userId, // Directly pass userId from response
        });
      } else {
        Alert.alert(response.data.message); // Show error message
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert(`An error occurred during login. Please try again.`);
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.header}>Sign In</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          placeholderTextColor="#999" // Light grey placeholder text color
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          placeholderTextColor="#999" // Light grey placeholder text color
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogIn}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0', // Light grey background color
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    backgroundColor: '#e0f2f1', // Light green container color
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // Shadow for Android
  },
  header: {
    fontSize: 24,
    color: '#333', // Darker text color for contrast
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    color: '#333', // Dark text color for input
  },
  button: {
    backgroundColor: '#004d40', // Dark green button color
    paddingVertical: 15,
    borderRadius: 25, // Rounded corners
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default LogInScreen;
