import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import {useAppDispatch} from '../store/store';
import {useSelector} from 'react-redux';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/AppNavigator';
import {
  Recipe,
  selectFilteredRecipes,
  fetchRecipes,
  BASE_URL,
  saveRecipesToLocal,
  getRecipesFromLocal,
} from '../reducers/recipeSlice'; 
import NetInfo from '@react-native-community/netinfo';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
type MenuScreenRouteProp = RouteProp<RootStackParamList, 'MenuScreen'>;

type Props = {
  navigation: HomeScreenNavigationProp;
  route: MenuScreenRouteProp;
};

const MenuScreen: React.FC<Props> = ({navigation, route}) => {

  const {username, profilePicture, id, email} = route.params;

  const dispatch = useAppDispatch();
  const recipes2 = useSelector(selectFilteredRecipes);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeIndex2, setActiveIndex2] = useState(0);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [recipesWithImages, setRecipesWithImages] = useState<Recipe[]>([]);
  const [recipesWithImagesCook, setRecipesWithImagesCook] = useState<Recipe[]>(
    [],
  );
  const [searchQuery, setSearchQuery] = useState('');

  const images = [
    /* your local image imports */
  ];
  const images2 = [
    /* your local image imports */
  ];


  const prevRecipe = () => {
    setActiveIndex(prevIndex =>
      prevIndex === 0 ? recipes2.length - 1 : prevIndex - 1,
    );
  };

  // Toggle to the next recipe
  const nextRecipe = () => {
    setActiveIndex(prevIndex => (prevIndex + 1) % recipes2.length);
  };

  const getVisibleRecipes = () => {
    if (!recipes2 || recipes2.length === 0) return [];
    const visibleRecipes = [];
    for (let i = 0; i < 2; i++) {
      visibleRecipes.push(recipes2[(activeIndex + i) % recipes2.length]);
    }
    return visibleRecipes;
  };

useEffect(() => {
  dispatch(fetchRecipes());
  saveRecipesToLocal(filteredRecipes);
}, [dispatch, filteredRecipes]);

const [isConnected, setIsConnected] = useState<boolean | null>(true);

useEffect(() => {
  const unsubscribe = NetInfo.addEventListener(state => {
    setIsConnected(state.isConnected);
  });

  return () => unsubscribe();
}, []);

useEffect(() => {
  if (!isConnected) {
    getRecipesFromLocal();
  }
}, [isConnected]);

useEffect(() => {
  const checkAndFetchRecipes = async () => {
    if (isConnected) {
      dispatch(fetchRecipes());
    } else {
      const localRecipes = await getRecipesFromLocal();
      setFilteredRecipes(localRecipes || []);
    }
  };
  
  checkAndFetchRecipes();
}, [dispatch, isConnected]);

  useEffect(() => {
    const filteredImagesRecipes = recipes2.filter(
      (recipe: Recipe) => recipe.image && recipe.cookCount > 0,
    );
    setRecipesWithImages(filteredImagesRecipes);

    const sortedByCookTime = [...filteredImagesRecipes].sort(
      (a, b) => b.cookCount - a.cookCount,
    );
    setRecipesWithImagesCook(sortedByCookTime);

    const interval = setInterval(() => {
      setActiveIndex2(prevIndex => (prevIndex + 1) % sortedByCookTime.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [recipes2]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text) {
      setFilteredRecipes(
        recipes2.filter(recipe =>
          recipe.name.toLowerCase().includes(text.toLowerCase()),
        ),
      );
      setDropdownVisible(true);
      setModalVisible(true); // Show the modal when searching
    } else {
      setDropdownVisible(false);
      setModalVisible(false); // Hide the modal when search query is empty
    }
  };

  const handleRecipeClick = (id: string) => {
    setDropdownVisible(false);
    navigation.navigate('CookPage', {id});
  };

  const handleProfileClick = (id: string) => {
    navigation.navigate('ProfileScreen', {userId: id});
  };

  const handleAddRecipe = () => {
    navigation.navigate('AddRecipe', {id});
  };

  const handleRecipeList = () => {
    navigation.navigate('ListScreen');
  };

  const handleGrocery = () => {
    navigation.navigate('GroceryRecipe', {id, email});
  };

  const renderItem = ({ item }: { item: Recipe }) => {
  if (!item) return null; // Check if item is defined
  return (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => handleRecipeClick(item._id)}
    >
      <Image
        source={
          item.image
            ? { uri: `${BASE_URL}${item.image}` }
            : require('../../assets/iphone2.png')
        }
        style={styles.image}
      />
      <Text style={styles.dropdownItemText}>{item.name}</Text>
    </TouchableOpacity>
  );
};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.profile} onPress={() => handleProfileClick(id)}>
        {profilePicture ? (
          <Image source={{uri: profilePicture}} style={styles.profileImage} />
        ) : (
          <Image
            source={require('../../assets/pfp.png')}
            style={styles.profilePicture}
          />
        )}
          <View style={styles.profileText}>
            <Text style={styles.textPoppins}>{username}</Text>
            <Text style={styles.profileScore}>20</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.searchRow}>
          <View style={styles.searchBarContainer}>
            <TextInput
              style={styles.searchBar}
              placeholder="Search recipe here"
              value={searchQuery}
              onChangeText={handleSearch}
            />
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterIcon}>☰</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Modal for Search Results */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {filteredRecipes.length > 0 ? (
              <FlatList
                data={filteredRecipes}
                keyExtractor={(item) => item._id.toString()}
                renderItem={renderItem}
              />
            ) : (
              <Text style={styles.dropdownItem}>No recipes found</Text>
            )}
            <Pressable onPress={() => setModalVisible(false)} style={styles.modalCloseButton}>
              <Text style={styles.modalCloseText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <View style={styles.category}>
        <View style={styles.toggleContainer}>
          <TouchableOpacity style={styles.toggleButton} onPress={prevRecipe}>
            <Text>{'<'}</Text>
          </TouchableOpacity>
          <View style={styles.categoryImagesContainer}>
            <View style={styles.categoryImages}>
              {getVisibleRecipes().map((recipe, index) =>
                recipe.image ? (
                  <TouchableOpacity 
              key={index} 
              onPress={() => handleRecipeClick(recipe._id)} // Call handleClick with the recipe's id
            >
                  <Image
                    key={index} 
                    source={{uri: `${BASE_URL}${recipe.image}`}}
                    style={[
                      styles.recipeImage,
                      {
                        width: index === 0 ? 160 : 150,
                        height: index === 0 ? 160 : 150,
                        transform: [
                          {
                            scale: index === 0 ? 1.1 : 1,
                          },
                        ],
                      },
                    ]}
                    onError={() => console.log('Image failed to load')}
                  />
                  </TouchableOpacity>
                ) : null,
              )}
            </View>
          </View>

          <TouchableOpacity style={styles.toggleButton} onPress={nextRecipe}>
            <Text>{'>'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.famousRecipes}>
        <Text style={styles.famousRecipesTitle}>Most Famous Recipes</Text>
        <View style={styles.famousRecipesContainer}>
          {recipesWithImagesCook.length > 0 && (
            <TouchableOpacity 
            onPress={() => handleRecipeClick(recipesWithImagesCook[activeIndex2]._id)} // Call handleClick with the recipe's id
          >
            <Image
              source={{
                uri: `${BASE_URL}${recipesWithImagesCook[activeIndex2].image}`,
              }}
              style={styles.recipeImage2}
            />
          </TouchableOpacity>
          )}
        </View>
      </View>

      <TouchableOpacity
        style={styles.recipeListButton}
        onPress={handleRecipeList}>
        <Text>Recipe List</Text>
        <Text style={styles.arrowRight}>→</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.footerButton, styles.grocery]}
          onPress={handleGrocery}>
          <Text style={[styles.icon]}>🛒</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.footerButton, styles.addRecipe]}
          onPress={handleAddRecipe}>
          <Text style={[styles.icon]}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f5e9',
    padding: 10,
  },
  header: {
    flexDirection: 'column',
    marginBottom: 10,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 57,
    height: 55,
    borderRadius: 50,
  },
  profileText: {
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: 10,
  },
  textPoppins: {
    fontFamily: 'Poppins',
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  profileScore: {
    fontFamily: 'Poppins',
    fontSize: 16,
    color: '#000',
    fontWeight: '300',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  searchBarContainer: {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#d9d9d9',
    backgroundColor: '#d9d9d9',
  },
  searchBar: {
    flex: 1,
    padding: 10,
    height: 58,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#d9d9d9',
    backgroundColor: '#d9d9d9',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    width: '100%',
    backgroundColor: '#b8b6b6',
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 4,
    maxHeight: 200,
    overflow: 'hidden',
    zIndex: 500,
  },
  dropdownItem: {
    padding: 10,
    zIndex: 500,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  dropdownItemText: {
    fontFamily: 'Poppins',
    fontSize: 14,
    color: '#000',
    paddingHorizontal: 30,
  },
  filterButton: {
    padding: 10,
    marginLeft: 10,
    height: 58,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#d9d9d9',
    backgroundColor: '#d9d9d9',
  },
  filterIcon: {
    fontSize: 24,
  },
  category: {
    marginTop: 10,
    width: '100%',
    zIndex: 2,
    position: 'relative',
    justifyContent: 'space-between',
  },
  categoryImagesContainer: {
    flexDirection: 'row',
    zIndex: 2,
    justifyContent: 'center',
  },
  categoryImages: {
    flexDirection: 'row',
    zIndex: 2,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
    justifyContent: 'space-between',
  },
  toggleButton: {
    backgroundColor: '#b8b6b6',
    padding: 10,
    zIndex: 2,
    borderRadius: 50,
    color: '#000',
  },
  famousRecipes: {
    alignItems: 'center',
    marginTop: 20,
  },
  famousRecipesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  famousRecipesContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  recipeListButton: {
    fontSize: 40,
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 50,
    backgroundColor: '#006400',
    marginTop: 20,
    marginBottom: 10,
    width: '40%', 
    alignSelf: 'center', 
  },
  arrowRight: {
    fontSize: 20,
    marginBottom: 8,
    marginLeft: 7,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 30,
  },
  footerButton: {
    padding: 20,
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 50,
    color: '#fff',
    backgroundColor: '#006400',
  },
  icon: {
    fontSize: 20, // Adjust the font size as needed
    color: '#fff',
  },
  grocery: {
    marginLeft: 10,
    width: 70, 
    height: 70, 
    borderRadius: 50, 
    color: '#fff',
    backgroundColor: '#006400',
    justifyContent: 'center', 
    alignItems: 'center',
  },
  addRecipe: {
    marginLeft: 10,
    width: 70, 
    height: 70, 
    borderRadius: 50, 
    color: '#fff',
    backgroundColor: '#006400',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    position: 'absolute',
    top: 200, // Adjust this value based on the position of your search bar or desired location
    left: 10, // Adjust this value based on your layout
    right: 10, // Adjust this value based on your layout
    backgroundColor: 'rgba(0,0,0,0.2)', // Slightly transparent background
    borderRadius: 8,
    padding: 10,
    elevation: 5, // For Android shadow effect
    shadowColor: '#000', // For iOS shadow effect
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalContent: {
    maxHeight: 200, // Limit height to prevent overflow
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
  },

  modalCloseButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 18,
    color: '#007bff',
  },
  recipeImage: {
    width: 150,
    height: 150,
    zIndex: 2,
    borderRadius: 20,
    marginHorizontal: 10,
    justifyContent: 'space-between',
  },
  recipeImage2: {
    width: 350,
    borderRadius: 20,
    height: 300,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50, // Circular shape
    borderWidth: 1,
    borderColor: '#ddd',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50, // Circular shape
    borderWidth: 1,
    borderColor: '#ddd',
  },
});

export default MenuScreen;
