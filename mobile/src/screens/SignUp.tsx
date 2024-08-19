import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Platform,
  Image,
  Modal,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import ImagePicker, {
  Asset,
  launchImageLibrary,
} from 'react-native-image-picker';
import axios from 'axios';
import { BASE_URL } from '../reducers/recipeSlice';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const SignUpScreen: React.FC<Props> = ({navigation}) => {
  const [username, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState<string>();
  const [alertText, setAlertText] = useState('');
  const [imageUri, setImageUri] = useState<string>('');
  const [showAlert, setShowAlert] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [otp, setOtp] = useState('');
  const [image, setImage] = useState<Asset | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [forceUpdate, setForceUpdate] = useState(0); // Added to force re-render

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to your storage to upload images',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true; // No need to request permission on iOS
  };

  useEffect(() => {
    if (showOtpDialog) {
      console.log(`Dialog box open: ${showOtpDialog}`);
      setForceUpdate(prev => prev + 1); // Force re-render
    }
  }, [showOtpDialog]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (showOtpDialog && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setShowOtpDialog(false); // Hide OTP dialog when time is up
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [showOtpDialog, timeLeft]);

  const handleImagePick = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert(
        'Permission Denied',
        'You need to grant storage permissions to pick an image.',
      );
      return;
    }

    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.assets && response.assets.length > 0) {
        const selectedImage = response.assets[0];
        setImage(selectedImage);
        setProfilePicture(selectedImage.uri);
        setImageUri(selectedImage.uri || '');
      } else {
        Alert.alert('No image selected');
      }
    });
  };
  const uploadImage = async () => {
    if (!image) throw new Error('No image selected');

    try {
      const formData = new FormData();
      formData.append('image', {
        uri: image?.uri ?? '',
        type: image?.type ?? 'image/jpeg',
        name: image?.fileName ?? 'image.jpg',
      } as any);

      console.log(`image uri: ${image.uri}`);

      const response = await fetch(`${BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Image upload failed');
      console.log(response.body);
      const data = await response.json();
      return data.filePath;
    } catch (error) {
      console.error('Image upload failed:', error);
      Alert.alert(`Error: ${error}`);
      throw error;
    }
  };

  const handleSignUp = async () => {
    try {
      console.log(`image is: ${imageUri}`);
      setShowOtpDialog(true);
      setTimeLeft(60); // Start the countdown timer
      let uploadedImageUrl = '';
      if (image) {
        uploadedImageUrl = await uploadImage();
      }
      // Show OTP dialog first

      // Ensure the OTP dialog is rendered before making the API call
      await new Promise(resolve => setTimeout(resolve, 0));

      // Proceed with the sign-up request
      const response = await axios.post(
        `${BASE_URL}/auth/signup`,
        {
          username,
          email,
          password,
          image: uploadedImageUrl,
        },
      );

      const userId2 = response.data.userId;
      //Alert.alert(`ID direct is: ${userId2}`);

      if (response.data.success) {
        //Alert.alert(`Sign Up Success ${response.data.message}`);
        setUserId(response.data.userId); // Store the userId for OTP verification
      } else {
        setAlertText(response.data.message);
        //Alert.alert('Sign Up Error', response.data.message);
      }
    } catch (error) {
      console.error('Signup error', error);
      /*Alert.alert(
        'Sign Up Error',
        'There was an error signing up. Please try again.',
      );*/
    }
  };

  const handleOtpSubmit = async () => {
    try {
      //Alert.alert(`OTP to check before is: ${otp}`);
      //Alert.alert(`ID to check before is: ${userId}`);

      const response = await axios.post(
        `${BASE_URL}/auth/verify`,
        {
          userId,
          otp,
        },
      );
      //Alert.alert(`OTP to check is: ${otp}`);

      if (response.data.success) {
        Alert.alert('Profile Pic', profilePicture);
        setShowOtpDialog(false);
        navigation.navigate('MenuScreen', {
          username: username,
          profilePicture: profilePicture || '',
          id: userId || '',
        });
      } else {
        //Alert.alert('OTP Failed', response.data.message);
      }
    } catch (error) {
      console.error('OTP verification error', error);
      /*Alert.alert(
        'OTP Verification Error',
        'There was an error verifying the OTP. Please try again.',
      );*/
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handleImagePick}
        style={styles.profilePictureContainer}>
        {profilePicture ? (
          <Image source={{uri: profilePicture}} style={styles.profilePicture} />
        ) : (
          <Image
            source={require('../../assets/pfp.png')}
            style={styles.profilePicture}
          />
        )}
        <Text style={styles.cameraIcon}>📷</Text>
      </TouchableOpacity>

      <View style={styles.formContainer}>
        <Text style={styles.header}>Sign Up</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="#999"
          value={username}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={showOtpDialog}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowOtpDialog(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.otpDialog}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowOtpDialog(false)}>
              <Text style={styles.closeButtonText}>x</Text>
            </TouchableOpacity>
            <Text style={styles.otpText}>Enter OTP: </Text>
            <TextInput
              style={styles.input}
              placeholder="OTP"
              keyboardType="default"
              returnKeyType="done"
              value={otp}
              onChangeText={setOtp}
            />
            <Text style={styles.timerText}>Time Left: {timeLeft}s</Text>
            <TouchableOpacity style={styles.button} onPress={handleOtpSubmit}>
              <Text style={styles.buttonText}>Submit OTP</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay
  },
  otpDialog: {
    width: '80%',
    padding: 20,
    backgroundColor: '#e0f2f1', // Light green background
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#004d40',
    borderRadius: 20,
    padding: 5,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    bottom: 6,
    fontSize: 18,
    fontWeight: 'bold',
  },
  otpText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#004d40',
  },
  timerText: {
    fontSize: 16,
    marginVertical: 10,
    color: '#004d40',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#004d40',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePictureText: {
    color: '#004d40',
    fontSize: 16,
  },
  formContainer: {
    backgroundColor: '#e0f2f1',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    fontSize: 24,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  profilePictureContainer: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    borderRadius: 12,
    padding: 2,
    fontSize: 16, // Smaller size for the camera icon
    color: 'grey',
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50, // Circular shape
    borderWidth: 1,
    borderColor: '#ddd',
  },
  defaultAvatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50, // Circular shape
    backgroundColor: '#e0f2f1', // Light green background for placeholder
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  defaultAvatarText: {
    color: '#004d40',
    fontSize: 16,
  },
});

export default SignUpScreen;
