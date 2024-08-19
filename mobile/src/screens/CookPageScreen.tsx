import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Dimensions, FlatList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, useAppDispatch } from '../store/store';
import { toggleRecipe, fetchRecipes } from '../reducers/recipeSlice';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useRoute, RouteProp } from '@react-navigation/native';

type CookPageRouteProp = RouteProp<RootStackParamList, 'CookPage'>;
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const { width } = Dimensions.get('window');

interface Step {
  step: string;
  des: string;
}

interface Ingredients {
  item: string;
  quantity: number;
  unit: string;
}

interface Recipe {
  _id: string;
  id: number;
  name: string;
  size: number;
  ingredients: Ingredients[];
  steps: Step[];
  category: string;
  image: string | null;
  checked: boolean;
  cookCount: number;
  favorites: boolean;
}

const CookPage: React.FC<Props> = ({ navigation }) => {
  const route = useRoute<CookPageRouteProp>();
  const dispatch = useDispatch();
  const dispatch2 = useAppDispatch();
  const recipes = useSelector((state: RootState) => state.recipes.recipes);

  const recipeId = route.params?.id as string;
  const recipe = recipes.find((recipe) => recipe._id === recipeId);

  useEffect(() => {
    dispatch2(fetchRecipes());
  }, [dispatch2]);

  const [checkedSteps, setCheckedSteps] = useState<boolean[]>(
    recipe ? new Array(recipe.steps.length).fill(false) : []
  );

  useEffect(() => {
    if (recipe) {
      setCheckedSteps(new Array(recipe.steps.length).fill(false));
    }
  }, [recipe]);

  const handleStepCheck = (index: number) => {
    const newCheckedSteps = [...checkedSteps];
    newCheckedSteps[index] = !newCheckedSteps[index];
    setCheckedSteps(newCheckedSteps);
  };

  const allStepsChecked = checkedSteps.every((checked) => checked);

  const handleCheckButton = () => {
    Alert.alert('Congrats!', 'You completed a recipe!');
    if (recipe) {
      dispatch2(toggleRecipe(recipe._id));
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const renderItem = ({ item, index }: { item: Step, index: number }) => (
    <View style={styles.stepItem}>
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => handleStepCheck(index)}
      >
        <Text style={styles.checkbox}>
          {checkedSteps[index] ? '✔️' : '☐'}
        </Text>
      </TouchableOpacity>
      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>{item.step}</Text>
        <Text style={styles.stepDescription}>{item.des}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recipe with Ingredients & Steps:</Text>
      {recipe ? (
        <View style={styles.content}>
          <Text style={styles.recipeName}>{recipe.name}</Text>
          <Text style={styles.servingSize}>Serving Size: {recipe.size}</Text>

          <View style={styles.ingredientsContainer}>
            <Text style={styles.sectionTitle}>Ingredients:</Text>
            {recipe.ingredients.map((ingredient, index) => (
              <Text key={index} style={styles.ingredient}>
                {ingredient.quantity} {ingredient.unit} - {ingredient.item}
              </Text>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Steps to follow:</Text>
          <FlatList
            data={recipe.steps}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item.step}-${index}`}
          />

          <TouchableOpacity
            style={[styles.completeButton, { backgroundColor: allStepsChecked ? '#224e05' : '#aaaaaa' }]}
            onPress={handleCheckButton}
            disabled={!allStepsChecked}
          >
            <Text style={styles.completeButtonText}>Complete Recipe</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text>Recipe not found!</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007BFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  content: {
    flex: 1,
  },
  recipeName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  servingSize: {
    fontSize: 16,
    marginBottom: 20,
    color: '#000',
  },
  ingredientsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  ingredient: {
    fontSize: 16,
    color: '#000',
  },
  stepItem: {
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
  checkboxContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
    marginRight: 10,
  },
  checkbox: {
    fontSize: 18,
    color: '#000',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  stepDescription: {
    fontSize: 14,
    color: '#000',
  },
  completeButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  completeButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
});

export default CookPage;
