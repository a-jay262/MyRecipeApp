import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  TextInput,
  Alert,
  ImageBackground,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../store/store';
import { Recipe } from '../reducers/recipeSlice';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const { width } = Dimensions.get('window');

const GroceryRecipeScreen: React.FC<Props> = ({ navigation }) => {
  const recipes = useSelector((state: RootState) => state.recipes.recipes);
  const [selectedRecipes, setSelectedRecipes] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [servingSize, setServingSize] = useState<number>(5);

  const handleCheckboxChange = (id: string) => {
    setSelectedRecipes((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((recipeId) => recipeId !== id)
        : [...prevSelected, id]
    );
  };

  const handleGetGroceryList = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleIncrement = () => {
    setServingSize((prevSize) => prevSize + 5);
  };

  const handleDecrement = () => {
    setServingSize((prevSize) => (prevSize > 5 ? prevSize - 5 : 5));
  };

  const handleSaveDialog = () => {
    setDialogOpen(false);
    //Alert.alert('Grocery List', `Selected Recipes: ${selectedRecipes.join(', ')}\nServing Size: ${servingSize}`);
    navigation.navigate('GroceryList', {
        selectedRecipes,
        servingSize,
      });
};

  const handleBack = () => {
    navigation.goBack();
  };

  const renderItem = ({ item }: { item: Recipe }) => (
    <View style={styles.recipeItem}>
      <TouchableOpacity onPress={() => handleCheckboxChange(item._id)}>
        <Text style={styles.checkbox}>
          {selectedRecipes.includes(item._id) ? '✅' : '⬜'}
        </Text>
      </TouchableOpacity>
      <Image
        source={{ uri: `http://192.168.16.126:5000${item.image}` }}
        style={styles.recipeImage}
      />
      <Text style={styles.recipeName}>{item.name}</Text>
    </View>
  );

  return (
    <ImageBackground
      source={require('../../assets/bg.jpg')}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Grocery List</Text>
        <FlatList
          data={recipes}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
        />
        <TouchableOpacity style={styles.getGroceryButton} onPress={handleGetGroceryList}>
          <Text style={styles.getGroceryButtonText}>Get Grocery</Text>
        </TouchableOpacity>

        {dialogOpen && (
          <Modal
            transparent={true}
            visible={dialogOpen}
            onRequestClose={handleCloseDialog}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Edit Serving Size</Text>
                <View style={styles.inputGroup}>
                  <TouchableOpacity style={styles.dialogButton} onPress={handleDecrement}>
                    <Text style={styles.dialogButtonText}>- 5</Text>
                  </TouchableOpacity>
                  <TextInput
                    style={styles.input}
                    value={servingSize.toString()}
                    keyboardType="numeric"
                    editable={false}
                  />
                  <TouchableOpacity style={styles.dialogButton} onPress={handleIncrement}>
                    <Text style={styles.dialogButtonText}>+ 5</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.buttonGroup}>
                <TouchableOpacity style={[styles.dialogButton, styles.cancelButton]} onPress={handleCloseDialog}>
                    <Text style={styles.dialogButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.dialogButton, styles.saveButton]} onPress={handleSaveDialog}>
                    <Text style={styles.dialogButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    width: '100%',
    marginTop: 250,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
    textAlign: 'center',
  },
  listContainer: {
    flexGrow: 1,
  },
  recipeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  checkbox: {
    fontSize: 20,
    marginRight: 10,
  },
  recipeImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  recipeName: {
    fontSize: 16,
    flex: 1,
    color: '#000',
  },
  getGroceryButton: {
    backgroundColor: '#006400',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  getGroceryButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: width - 40,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  inputGroup: {
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 80,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  input: {
    borderWidth : 1,
    borderColor: '#cccccc',
    width: 80,
    textAlign: 'center',
    marginHorizontal: 10,
    fontSize: 18,
    color: '#000',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dialogButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  dialogButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: 'green',
  },
  cancelButton: {
    backgroundColor: '#8B0000',
  },
});

export default GroceryRecipeScreen;
