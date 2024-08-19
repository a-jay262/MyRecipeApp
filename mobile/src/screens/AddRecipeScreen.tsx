import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  Alert,
  StyleSheet,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {
  launchImageLibrary,
  ImageLibraryOptions,
  Asset,
} from 'react-native-image-picker';
import {useAppDispatch} from '../store/store';
import {addRecipe, BASE_URL} from '../reducers/recipeSlice';
import {RouteProp} from '@react-navigation/native';
import io from 'socket.io-client';
import {RootStackParamList} from '../navigation/AppNavigator';
import {useToast} from 'react-native-toast-notifications';
import PushNotification from 'react-native-push-notification';
import {showMessage} from 'react-native-flash-message';
import ConfirmDialog from '../component/dialog';

const SOCKET_URL = 'http://192.168.16.128:5000'; // Update with your server URL
const socket = io(SOCKET_URL, {
  transports: ['websocket'],
});

type AddRecipeRouteProp = RouteProp<RootStackParamList, 'AddRecipe'>;
type Props = {
  route: AddRecipeRouteProp;
};

const AddRecipe: React.FC<Props> = ({route}) => {
  const toast = useToast();

  const {id} = route.params;
  const [name, setName] = useState('');
  const [size, setSize] = useState(5);
  const [steps, setSteps] = useState([{step: '', des: ''}]);
  const [image, setImage] = useState<Asset | null>(null);
  const [imageUri, setImageUri] = useState<string>('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [publicc, setPublic] = useState(false);
  const [ingredients, setIngredients] = useState([
    {item: '', quantity: 1, unit: ''},
  ]);

  const dispatch = useAppDispatch();


  useEffect(() => {
    socket.on('recipe-added', recipe => {
      console.log('Recipe added:', recipe);
      showMessage({
        message: `Recipe Successfully Added`,
        description: `Check your list for updates`,
        type: 'info',
        backgroundColor: '#006400', // Customize background color
        color: 'white', // Customize text color
      });
    });
    return () => {
      socket.off('recipe-added');
    };
  }, []);

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
    return true;
  };

  const handleSizeChange = (value: string) => {
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed)) setSize(parsed);
  };

  const handleCategoryChange = (text: string) => setCategory(text);
  const handleNameChange = (text: string) => setName(text);

  const handleIngredientChange = (
    index: number,
    field: keyof (typeof ingredients)[0],
    value: string | number,
  ) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value as never;
    setIngredients(newIngredients);
  };

  const handleStepChange = (
    index: number,
    field: keyof (typeof steps)[0],
    value: string,
  ) => {
    const newSteps = [...steps];
    newSteps[index][field] = value;
    setSteps(newSteps);
  };

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
        setImageUri(selectedImage.uri || '');
      } else {
        Alert.alert('No image selected');
      }
    });
  };

  const uploadImage = async () => {
    if (!image) throw new Error('No image selected');
    //Alert.alert(`User id is: ${id}`);

    try {
      const formData = new FormData();
      formData.append('image', {
        uri: image?.uri ?? '',
        type: image?.type ?? 'image/jpeg',
        name: image?.fileName ?? 'image.jpg',
      } as any);

      const response = await fetch(`${BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Image upload failed');

      const data = await response.json();
      return data.filePath;
    } catch (error) {
      console.error('Image upload failed:', error);
      Alert.alert('Error', 'Failed to upload image');
      throw error;
    }
  };

  const [dialogVisible, setDialogVisible] = useState(false);

  const handleDialogConfirm = (confirm: boolean) => {
    if (confirm) {
      // Handle the confirmation logic here
      handleSubmit(true);
    } else {
      handleSubmit(false);
    }
  };

  const confirmPublicRecipe = () => {
    Alert.alert(
      'Make Recipe Public',
      'Do you want to make this recipe public?',
      [
        {
          text: 'No',
          onPress: () => handleSubmit(false),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => handleSubmit(true),
        },
      ],
      {cancelable: false},
    );
  };

  const handleSubmit = async (check: boolean) => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Please enter a recipe name.');
      return;
    }

    if (steps.some(step => !step.step.trim() || !step.des.trim())) {
      Alert.alert(
        'Validation Error',
        'Please complete all steps with valid descriptions.',
      );
      return;
    }

    if (size <= 0) {
      Alert.alert(
        'Validation Error',
        'Enter a valid serving size greater than zero.',
      );
      return;
    }

    setLoading(true);

    try {
      let uploadedImageUrl = '';
      if (image) {
        uploadedImageUrl = await uploadImage();
      }

      //Alert.alert(`User id is: ${id}`);

      const recipe = {
        userId: id,
        name,
        size,
        ingredients,
        public: check,
        steps,
        category,
        image: uploadedImageUrl,
      };
      dispatch(addRecipe(recipe));
      //Alert.alert("Success", "Recipe added successfully!");
      socket.emit('recipe-added', recipe.name);

      PushNotification.configure({
        onRegister: function (token) {
          console.log('TOKEN:', token);
        },
        onNotification: function (notification) {
          console.log('NOTIFICATION:', notification);
        },
        requestPermissions: Platform.OS === 'ios',
      });

      PushNotification.checkPermissions((permissions) => {
        console.log('Notification permissions:', permissions);
        if (!permissions.alert) {
          PushNotification.requestPermissions();
        }
      });

      PushNotification.localNotification({
        channelId: 'recipe-channel11', // Ensure this matches the channel ID used in creation
        title: 'Recipe Added Successfully',
        message: 'Check your list for updates',
      });

      setName('');
      setSize(5);
      setIngredients([{item: '', quantity: 1, unit: ''}]);
      setSteps([{step: '', des: ''}]);
      setCategory('');
      setImage(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to add recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading && <ActivityIndicator size="large" color="#006400" />}
      <Text style={styles.header}>Add Recipe</Text>
      <TextInput
        style={styles.input}
        placeholder="Category"
        value={category}
        onChangeText={handleCategoryChange}
      />
      <TextInput
        style={styles.input}
        placeholder="Recipe Name"
        value={name}
        onChangeText={handleNameChange}
      />
      <Button title="Pick an Image" onPress={handleImagePick} color="#006400" />
      <View style={styles.inputContainer}>
        <Button
          title="-5"
          onPress={() => setSize(prevSize => Math.max(prevSize - 5, 5))}
          color="#006400"
        />
        <TextInput
          style={styles.input}
          placeholder="Serving Size"
          value={size.toString()}
          onChangeText={handleSizeChange}
          keyboardType="numeric"
        />
        <Button
          title="+5"
          onPress={() => setSize(prevSize => prevSize + 5)}
          color="#006400"
        />
      </View>
      {ingredients.map((ing, index) => (
        <View key={index} style={styles.ingredientContainer}>
          <TextInput
            style={styles.input}
            placeholder={`Ingredient ${index + 1}`}
            value={ing.item}
            onChangeText={text => handleIngredientChange(index, 'item', text)}
          />
          <TextInput
            style={styles.input}
            placeholder={`Quantity ${index + 1}`}
            value={ing.quantity.toString()}
            onChangeText={text =>
              handleIngredientChange(index, 'quantity', parseInt(text, 10))
            }
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder={`Unit ${index + 1}`}
            value={ing.unit}
            onChangeText={text => handleIngredientChange(index, 'unit', text)}
          />
        </View>
      ))}
      <Button
        title="Add Ingredient"
        onPress={() =>
          setIngredients([...ingredients, {item: '', quantity: 1, unit: ''}])
        }
        color="#006400"
      />
      <View>
        {steps.map((step, index) => (
          <View key={index}>
            <TextInput
              style={styles.input}
              placeholder={`Step ${index + 1}`}
              value={step.step}
              onChangeText={text => handleStepChange(index, 'step', text)}
            />
            <TextInput
              style={styles.input}
              placeholder={`Description for Step ${index + 1}`}
              value={step.des}
              onChangeText={text => handleStepChange(index, 'des', text)}
            />
          </View>
        ))}
        <Button
          title="Add Step"
          onPress={() => setSteps([...steps, {step: '', des: ''}])}
          color="#006400"
        />
      </View>
      <Button
        title="Add Recipe"
        onPress={() => setDialogVisible(true)}
        color="#006400"
      />
      <ConfirmDialog
        visible={dialogVisible}
        onConfirm={handleDialogConfirm}
        onCancel={() => setDialogVisible(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#006400',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    color: '#000',
    marginVertical: 5,
    borderRadius: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  ingredientContainer: {
    marginBottom: 10,
  },
});

export default AddRecipe;
