import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ImageBackground, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { BASE_URL2 } from '../reducers/recipeSlice';
import { RootStackParamList } from '../navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Ingredient {
  item: string;
  quantity: number;
  unit: string;
}

const adjustIngredientsForServingSize = (
  ingredients: Ingredient[],
  originalServingSize: number,
  newServingSize: number
): Ingredient[] => {
  const scalingFactor = newServingSize / originalServingSize;

  return ingredients.map((ingredient) => ({
    ...ingredient,
    quantity: ingredient.quantity * scalingFactor,
  }));
};

type GroceryListScreenRouteProp = RouteProp<RootStackParamList, 'GroceryList'>;

const GroceryList: React.FC = () => {
  const navigation = useNavigation();
  const [err, setErr] = useState('');
  const route = useRoute<GroceryListScreenRouteProp>();
  const { selectedRecipes, servingSize, id, email } = route.params || {};
  const recipes = useSelector((state: RootState) => state.recipes.recipes);
  const [userId, setUserId] = useState<string | null>(null); // State to store user _id
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const getGroceryList = () => {
    const ingredientsMap: Record<string, { quantity: number; unit: string }> = {};

    selectedRecipes.forEach((id: string) => {
      const recipe = recipes.find((r) => r._id === id);
      if (recipe) {
        const adjustedIngredients = adjustIngredientsForServingSize(recipe.ingredients, recipe.size, servingSize);

        adjustedIngredients.forEach((ingredient) => {
          const key = `${ingredient.item}-${ingredient.unit}`;
          if (ingredientsMap[key]) {
            ingredientsMap[key].quantity += ingredient.quantity;
          } else {
            ingredientsMap[key] = { quantity: ingredient.quantity, unit: ingredient.unit };
          }
        });
      }
    });

    return Object.keys(ingredientsMap).map((key) => {
      const [item] = key.split('-');
      const { quantity, unit } = ingredientsMap[key];
      return { item, quantity, unit };
    });
  };

  const fetchUserIdByEmail = async () => {
    try {
      setErr(email || '');
      if (!email) {
        Alert.alert('Error', 'No email found.');
        return;
      }

      //Alert.alert(`email: ${email}`);
      const response = await fetch(`${BASE_URL2}/api/user/getUserByEmail/${email}`);
      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Error fetching user details');
        Alert.alert('Error', errorData.message || 'Error fetching user details');
        return;
      }

      const data = await response.json();
      setUserId(data.user._id);
    } catch (error) {
      console.error('Error fetching user details:', error);
      setErrorMessage('Failed to fetch user details. Please try again later.');
      Alert.alert('Error', 'Failed to fetch user details. Please try again later.');
    }
  };

  const calculateTotalPrice = () => {
    return selectedRecipes.reduce((total, id) => {
      const recipe = recipes.find((r) => r._id === id);
      return recipe ? total + recipe.price : total;
    }, 0);
  };

  const createExpense = async () => {
    if (!userId) {
      Alert.alert('Error', 'User ID not found. Cannot create expense.');
      return;
    }

    const expenseData = {
      payer: userId,
      amount: totalPrice,
      description: "Grocery Expense",
      type: "individual",
      relatedUser: userId,
      pictures: ""
    };

    try {
      const response = await fetch(`${BASE_URL2}/api/expense/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expenseData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Error creating expense');
        Alert.alert('Error', errorData.message || 'Error creating expense');
        return;
      }

      const data = await response.json();
      Alert.alert('Success', 'Expense created successfully!');
      console.log('Expense created successfully:', data);
    } catch (error) {
      console.error('Error creating expense:', error);
      setErrorMessage('Failed to create expense. Please try again later.');
      Alert.alert('Error', 'Failed to create expense. Please try again later.');
    }
  };

  const handleAddToWallet = async () => {
    await fetchUserIdByEmail(); // Fetch the user ID first
    if (userId) {
      createExpense(); // Only create the expense if the user ID is available
    }
  };

  const totalPrice = calculateTotalPrice();
  const groceryList = getGroceryList();

  useEffect(() => {
    fetchUserIdByEmail(); // Fetch the user ID when the component mounts
  }, []);

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <ImageBackground
      source={require('../../assets/bg.jpg')}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Grocery List</Text>
        <Text style={styles.title2}>Serving Size: {servingSize}</Text>

        <FlatList
          data={groceryList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.recipeItem}>
              <Text style={styles.recipeText}>
                {item.item}: {item.quantity.toFixed(2)} {item.unit}
              </Text>
            </View>
          )}
        />
        <Text style={styles.totalPrice}>Total Price: ${totalPrice.toFixed(2)}</Text>
        
        <TouchableOpacity onPress={handleAddToWallet} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add to Wallet</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginVertical: 20,
  },
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
    textAlign: 'center',
    color: '#000',
  },
  title2: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: '#000',
  },
  recipeItem: {
    backgroundColor: 'rgba(144, 185, 154, 0.8)',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: '#1c6911',
    shadowColor: '#1c6911',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  recipeText: {
    fontSize: 16,
    color: '#000',
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GroceryList;
