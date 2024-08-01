import { calculateTotalCookingTime } from '../recipe.use'; // Adjust the path if needed

// Example interfaces
export interface Step {
  step: string;
  des: string;
}

export interface Ingredients {
  item: string;
  quantity: number;
  unit: string;
}

export interface Recipe {
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

// Example data
const recipes: Recipe[] = [
  {
    _id: '1',
    id: 1,
    name: 'Recipe 1',
    size: 30,
    ingredients: [],
    steps: [],
    category: 'Dessert',
    image: null,
    checked: false,
    cookCount: 0,
    favorites: false,
  },
  {
    _id: '2',
    id: 2,
    name: 'Recipe 2',
    size: 45,
    ingredients: [],
    steps: [],
    category: 'Main Course',
    image: null,
    checked: false,
    cookCount: 0,
    favorites: false,
  },
];

describe('calculateTotalCookingTime', () => {
  it('should calculate the total cooking time for the list of recipes', () => {
    const totalCookingTime = calculateTotalCookingTime(recipes);
    expect(totalCookingTime).toBe(75); // 30 + 45
  });

  it('should return 0 if there are no recipes', () => {
    const totalCookingTime = calculateTotalCookingTime([]);
    expect(totalCookingTime).toBe(0);
  });
});


