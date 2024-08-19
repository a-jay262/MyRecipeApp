// src/components/GroceryList.tsx
import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { RootStackParamList } from '../navigation/AppNavigator';

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
  const route = useRoute<GroceryListScreenRouteProp>();
  const { selectedRecipes, servingSize } = route.params || {};
  const recipes = useSelector((state: RootState) => state.recipes.recipes);

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

  const groceryList = getGroceryList();

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
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    padding: 10,
  },
  navButton: {
    padding: 10,
    backgroundColor: '#8fbc8f',
    borderRadius: 5,
  },
  arrowIcon: {
    color: '#fff',
    fontSize: 16,
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
});

export default GroceryList;
