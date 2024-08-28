import React, {useState, useEffect, useRef} from 'react';
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
  Image,
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
import DropDownPicker from 'react-native-dropdown-picker';
import {showMessage} from 'react-native-flash-message';
import ConfirmDialog from '../component/dialog';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

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
  const [price, setPrice] = useState(0);
  const [steps, setSteps] = useState([{step: '', des: ''}]);
  const [image, setImage] = useState<Asset | null>(null);
  const [imageUri, setImageUri] = useState<string>('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [publicc, setPublic] = useState(false);
  const [open, setOpen] = useState(false);
  const [ingredients, setIngredients] = useState([
    {item: '', quantity: 1, unit: ''},
  ]);
  const [syncing, setSyncing] = useState(false);
  const [offlineRecipes, setOfflineRecipes] = useState<any[]>([]); // State to manage offline recipes
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const syncInProgress = useRef(false);
  const [open2, setOpen2] = React.useState(false);
  const [unit, setUnit] = React.useState<string>('');
  const [units, setUnits] = React.useState([
    {label: 'Kg', value: 'Kg'},
    {label: 'Litre', value: 'Litre'},
    {label: 'Cup', value: 'Cup'},
    {label: 'Spoon', value: 'Spoon'},
  ]);

  const handleUnitChange = (index: number, value: string) => {
    setUnit(value);
    handleIngredientChange(index, 'unit', value);
  };

  const dispatch = useAppDispatch();

  const saveRecipeToAsyncStorage = async (recipe: any) => {
    try {
      const updatedRecipes = [...offlineRecipes, recipe];
      setOfflineRecipes(updatedRecipes);
      await AsyncStorage.setItem(
        'offlineRecipes',
        JSON.stringify(updatedRecipes),
      );
      console.log('MyTag: AsyncStorage contents:', updatedRecipes);
    } catch (error) {
      console.error('MyTag: Failed to save recipe:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      if (state.isConnected && !syncing) {
        setSyncing(true);
        syncOfflineRecipes(); // Sync recipes when back online
        //Alert.alert('Recipe saved after being online');
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const syncOfflineRecipes = async () => {
    if (syncInProgress.current) return; // Prevent re-entry

    syncInProgress.current = true;
    setSyncing(true);
    try {
      const storedRecipes = await AsyncStorage.getItem('offlineRecipes');
      if (storedRecipes) {
        const recipes = JSON.parse(storedRecipes);
        for (const recipe of recipes) {
          if (recipe.image && !recipe.image.includes('http')) {
            const uploadedImageUrl = await uploadImageFromUri(recipe.image);
            recipe.image = uploadedImageUrl;
          }
          await dispatch(addRecipe(recipe));
        }
        await AsyncStorage.removeItem('offlineRecipes');
        showMessage({
          message: 'Recipes Synced',
          description:
            'Offline recipes have been successfully sent to the backend.',
          type: 'info',
          backgroundColor: '#006400', // Customize background color
          color: 'white', // Customize text color
        });
      }
    } catch (error) {
      console.error('Error syncing offline recipes:', error);
      Alert.alert('Failed to sync offline recipes');
    }
  };

  useEffect(() => {
    loadOfflineRecipes(); // Load offline recipes on component mount
  }, []);

  const loadOfflineRecipes = async () => {
    try {
      const storedRecipes = await AsyncStorage.getItem('offlineRecipes');
      if (storedRecipes) {
        setOfflineRecipes(JSON.parse(storedRecipes));
      }
    } catch (error) {
      console.error('Failed to load offline recipes:', error);
    }
  };

  useEffect(() => {
    socket.on('recipe-added', recipe => {
      console.log('MyTag: Recipe added:', recipe);
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

  /**
   * Requests permission to access the user's storage.
   * @returns A promise that resolves to `true` if permission is granted, otherwise `false`.
   */
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

  const handlePriceChange = (value: string) => {
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed)) setPrice(parsed);
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
  /**
   *
   * @returns image that is picked by the user
   */
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

  const saveImageToAsyncStorage = async (image: Asset) => {
    try {
      const imageUri = image.uri;
      if (imageUri) {
        await AsyncStorage.setItem('offlineImage', imageUri);
        console.log('MyTag: Image URI saved offline:', imageUri);
      }
    } catch (error) {
      console.error('Failed to save image URI:', error);
    }
  };

  const storeRecipeOffline = async (recipeData: any) => {
    try {
      const storedRecipes = await AsyncStorage.getItem('offlineRecipes');
      const recipes = storedRecipes ? JSON.parse(storedRecipes) : [];
      recipes.push(recipeData);
      await AsyncStorage.setItem('offlineRecipes', JSON.stringify(recipes));
      Alert.alert(
        'No internet connection',
        'Recipe has been saved locally and will be uploaded when you are online.',
      );
    } catch (error) {
      console.error('Error storing recipe offline:', error);
      Alert.alert('Failed to store recipe offline');
    }
  };

  const syncOfflineRecipes2 = async () => {
    if (offlineRecipes.length > 0) {
      try {
        for (const recipe of offlineRecipes) {
          // Check if the recipe has an offline image URI to upload
          if (recipe.image && !recipe.image.includes('http')) {
            const uploadedImageUrl = await uploadImageFromUri(recipe.image);
            recipe.image = uploadedImageUrl;
          }
          console.log('MyTag: AsyncStorage contents after sync:', recipe);
          // Upload each offline recipe
          await dispatch(addRecipe(recipe));
          socket.emit('recipe-added', recipe.name);
        }
        await AsyncStorage.removeItem('offlineRecipes'); // Clear offline recipes after syncing
        setOfflineRecipes([]);
        toast.show('All offline recipes have been synced!', {type: 'success'});
      } catch (error) {
        console.error('Error syncing offline recipes:', error);
        Alert.alert(
          'Error',
          'Failed to sync offline recipes. Please try again.',
        );
      }
    }
  };

  const uploadImageFromUri = async (imageUri: string) => {
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'image.jpg',
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
      throw error;
    }
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
  /**
   *
   * @param check is given by the user to tell if recipe public
   * @returns an alert
   */
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
        if (isConnected) {
          uploadedImageUrl = await uploadImage();
        } else {
          // Store the image URI locally when offline
          await saveImageToAsyncStorage(image);
          uploadedImageUrl = image.uri ?? '';
        }
      }

      const recipe = {
        userId: id,
        name,
        size,
        price,
        ingredients,
        public: check,
        steps,
        category,
        image: uploadedImageUrl,
      };

      if (isConnected) {
        await dispatch(addRecipe(recipe));
        socket.emit('recipe-added', recipe.name);
      } else {
        await storeRecipeOffline(recipe);
        Alert.alert('Offline', 'Recipe saved offline. Will sync when online.');
      }

      PushNotification.configure({
        onRegister: function (token) {
          console.log('TOKEN:', token);
        },
        onNotification: function (notification) {
          console.log('NOTIFICATION:', notification);
        },
        requestPermissions: Platform.OS === 'ios',
      });

      PushNotification.checkPermissions(permissions => {
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
      setPrice(0);
      setImageUri('');
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
    <ScrollView style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#006400" />}
      <Text style={styles.header}>Add Recipe</Text>
      <Text style={styles.label}>Select a Category</Text>
      <DropDownPicker
        open={open}
        value={category}
        items={[
          {label: 'Breakfast', value: 'Breakfast'},
          {label: 'Lunch', value: 'Lunch'},
          {label: 'Dinner', value: 'Dinner'},
          {label: 'Dessert', value: 'Dessert'},
        ]}
        setOpen={setOpen}
        setValue={setCategory}
        onChangeValue={value => handleCategoryChange(value as string)}
        style={styles.dropdown}
        containerStyle={{width: '100%'}}
        dropDownContainerStyle={styles.dropDownContainer}
        placeholder="Select a Category"
        zIndex={1000}
        zIndexInverse={3000}
      />
      <TextInput
        style={styles.input}
        placeholder="Recipe Name"
        placeholderTextColor="#888"
        value={name}
        onChangeText={handleNameChange}
      />
      {imageUri ? (
        <Image source={{uri: imageUri}} style={styles.image} />
      ) : null}
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
          placeholderTextColor="#888"
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
      <View>
        <TextInput
          style={styles.input}
          placeholder="Recipe Price"
          placeholderTextColor="#888"
          value={price === 0 ? '' : price.toString()} // Show placeholder if price is 0
          onChangeText={handlePriceChange}
          keyboardType="numeric"
        />
      </View>
      {ingredients.map((ing, index) => (
        <View key={index} style={styles.ingredientContainer}>
          <TextInput
            style={styles.input}
            placeholder={`Ingredient ${index + 1}`}
            placeholderTextColor="#888"
            value={ing.item}
            onChangeText={text => handleIngredientChange(index, 'item', text)}
          />
          <TextInput
  style={styles.input}
  placeholder={`Quantity ${index + 1}`}
  value={ing.quantity.toString()}
  placeholderTextColor="#888"
  onChangeText={text => {
    const quantity = Number(text);
    if (!isNaN(quantity) && quantity >= 0) {
      handleIngredientChange(index, 'quantity', quantity);
    }
  }}
  keyboardType="numeric"
/>
          <TextInput
            style={styles.input}
            placeholder={`Unit ${index + 1}`}
            value={ing.unit}
            placeholderTextColor="#888"
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
              placeholderTextColor="#888"
              onChangeText={text => handleStepChange(index, 'step', text)}
            />
            <TextInput
              style={styles.input}
              placeholder={`Description for Step ${index + 1}`}
              value={step.des}
              placeholderTextColor="#888"
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
      <View style={styles.spacer} />
      <Button
        title="Add Recipe"
        onPress={() => setDialogVisible(true)}
        color="#006400"
      />
      <View style={styles.spacer} />
      <View style={styles.spacer} />
      <View style={styles.spacer} />
      <ConfirmDialog
        visible={dialogVisible}
        onConfirm={handleDialogConfirm}
        onCancel={() => setDialogVisible(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  spacer: {
    height: 16, // Adjust the height to increase or decrease the spacing
  },
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
  label: {
    fontSize: 11,
    color: '#000',
    marginLeft: 10,
    marginBottom: 10,
  },
  dropdown: {
    backgroundColor: '#fafafa',
  },
  dropDownContainer: {
    backgroundColor: '#fafafa',
  },
  image: {
    width: '100%',
    height: 170,
    marginVertical: 10,
    borderRadius: 5,
  },
});

export default AddRecipe;
