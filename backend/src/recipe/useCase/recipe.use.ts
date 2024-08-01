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

export interface Step {
  step: string;
  des: string;
}

export interface Ingredients {
  item: string;
  quantity: number;
  unit: string;
}



export const calculateTotalCookingTime = (recipes: Recipe[]): number => {
  return recipes.reduce((total, recipe) => total + recipe.size, 0);
};
