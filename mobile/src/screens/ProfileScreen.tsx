import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Alert, // Import Alert
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../store/store';
import { toggleFavorite, fetchRecipes, Recipe, BASE_URL } from '../reducers/recipeSlice';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';

type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'ProfileScreen'>;
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
  route: ProfileScreenRouteProp;
};

const { width, height } = Dimensions.get('window');

const ProfileScreen: React.FC<Props> = ({ navigation, route }) => {
  const { userId } = route.params; 
  const recipes = useSelector((state: RootState) => state.recipes.recipes);
  const favorites = useSelector((state: RootState) => state.recipes.favorites);
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<'recipes' | 'favorites'>('recipes');

  useEffect(() => {
    dispatch(fetchRecipes());
    // Show alert with userId when the component mounts
    Alert.alert('User ID', `The user ID is ${userId}`);
  }, [dispatch, userId]);

  useEffect(() => {
    if (userId) {
      dispatch(fetchRecipes());
    }
  }, [dispatch, userId]);

  useEffect(() => {
    //console.log('Recipes:', recipes);
    //console.log('Active Tab:', activeTab);
    //console.log('Filtered Recipes:', filteredRecipes);
    //console.log(`User ID to compare: ${userId}`);


    dispatch(fetchRecipes());
  }, [dispatch, userId]);
  
  const filteredRecipes = recipes
    .filter(recipe => {
      //console.log('Filtering Recipe:', recipe);
      //console.log(`Recipe Id: ${recipe.userId}`);

      return recipe.userId === userId;
    })
    .filter(recipe => activeTab === 'favorites' ? recipe.favorites : true);

    
  const handleToggleFavorite = (id: string) => {
    dispatch(toggleFavorite(id));
  };

  const handleRecipePress = (id: string) => {
    navigation.navigate('CookPage', { id });
  };

  const renderItem = ({ item }: { item: Recipe }) => (
    <TouchableOpacity
      style={styles.recipeItem}
      onPress={() => handleRecipePress(item._id)}
    >
      <Image
        source={{ uri: `${BASE_URL}${item.image}` }}
        style={styles.recipeImage}
      />
      <View style={styles.recipeInfo}>
        <Text style={styles.recipeName}>{item.name}</Text>
      </View>
      <View style={styles.cookInfo}>
        <Text style={styles.cookCount}>
          Cooked: {item.cookCount} {item.cookCount === 1 ? 'time' : 'times'}
        </Text>
        <TouchableOpacity
          style={styles.favoriteIcon}
          onPress={() => handleToggleFavorite(item._id)}
        >
          <Text style={styles.icon}>
            {item.favorites ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../assets/bg.jpg')}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <View style={styles.headerCover}>
          <View style={styles.header}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'recipes' && styles.tabActive]}
              onPress={() => setActiveTab('recipes')}
            >
              <Text style={styles.tabText}>Recipes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'favorites' && styles.tabActive]}
              onPress={() => setActiveTab('favorites')}
            >
              <Text style={styles.tabText}>Favorites</Text>
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          data={filteredRecipes}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContainer}
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    width: '100%',
    marginTop: 250,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 10,
  },
  headerCover: {
    padding: 0,
    backgroundColor: '#C0C0C0',
    marginBottom: 20,
    borderRadius: 50,
  },
  navButton: {
    backgroundColor: 'green',
    borderRadius: 25,
    padding: 10,
  },
  arrowIcon: {
    color: 'white',
    fontSize: 30,
  },
  headerTitle: {
    flex: 1,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  listContainer: {
    flexGrow: 1,
  },
  recipeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(144, 185, 154, 0.8)',
    borderRadius: 15,
    marginBottom: 10,
    padding: 10,
  },
  recipeImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  recipeInfo: {
    flex: 1,
  },
  recipeName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cookInfo: {
    alignItems: 'center',
  },
  cookCount: {
    fontSize: 14,
  },
  favoriteIcon: {
    marginTop: 5,
  },
  icon: {
    fontSize: 24,
  },
  tab: {
    backgroundColor: '#D3D3D3', 
    padding: 10,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginHorizontal: 5,
  },
  tabActive: {
    backgroundColor: '#8fbc8f',
  },
  tabText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ProfileScreen;
