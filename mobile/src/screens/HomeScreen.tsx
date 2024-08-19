import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<Props> = ({navigation}) => {
  const handleSignUp = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      const username = await AsyncStorage.getItem('username');
      const profilePicture = await AsyncStorage.getItem('profilePicture');
      const userId = await AsyncStorage.getItem('userId');
      navigation.navigate('MenuScreen', {
        username: username || '',
        profilePicture: profilePicture || '',
        id: userId || '', // Directly pass userId from response
      }); // Redirect to MenuPage if token exists
    } else {
      navigation.navigate('SignUp'); // Redirect to LoginPage if no token
    }
  };
  const handleLogIn = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      const username = await AsyncStorage.getItem('username');
      const profilePicture = await AsyncStorage.getItem('profilePicture');
      const userId = await AsyncStorage.getItem('userId');
      navigation.navigate('MenuScreen', {
        username: username || '',
        profilePicture: profilePicture || '',
        id: userId || '', // Directly pass userId from response
      });// Redirect to MenuPage if token exists
    } else {
      navigation.navigate('LogIn'); // Redirect to LoginPage if no token
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>Welcome to My Recipe App</Text>
        <Image
          source={require('../../assets/logo4.png')} // Path to your logo image
          style={styles.logo}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <Text style={styles.signInText}>
          Already have an account?{' '}
          <Text style={styles.signInLink} onPress={handleLogIn}>
            Sign In
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0', // Light grey background color
    padding: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -250, // Move content up
  },
  header: {
    fontSize: 24,
    color: '#333', // Darker text color for contrast
    marginBottom: 100,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#3a5f3d', // Green button color
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25, // Rounded corners
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  signInText: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
  signInLink: {
    color: '#3a5f3d', // Green color for the link
    textDecorationLine: 'underline',
  },
});

export default HomeScreen;
