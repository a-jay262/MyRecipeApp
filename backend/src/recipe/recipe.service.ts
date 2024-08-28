import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Recipe, RecipeDocument } from './schemas/recipe.schema';
import { CreateRecipeDto } from '../recipe/dto/create-recipe.dto';
import { UpdateRecipeDto } from '../recipe/dto/update-recipe.dto';

@Injectable()
export class RecipeService {
  constructor(@InjectModel(Recipe.name) private readonly recipeModel: Model<RecipeDocument>) {}

  /**
   * 
   * @param id is sent from frontend and reciipe is added to favorites by this function
   * @returns 
   */
  async toggleFavorite(id: string): Promise<Recipe> {
    const recipe = await this.recipeModel.findById(id);
    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }
    recipe.favorites = !recipe.favorites;
    return recipe.save();
  }

/**
 * Here Recipe is added from frontend and is added to the backend
 * @param recipeDto 
 * @returns 
 */
  async create(recipeDto: CreateRecipeDto): Promise<RecipeDocument> {
    const createdRecipe = new this.recipeModel(recipeDto);
    return createdRecipe.save();
  }

/***
 * A function to get all recipes from backend
 */
  async findAll(): Promise<RecipeDocument[]> {
    return this.recipeModel.find().exec();
  }


/**
 * Method to get recipe from backend
 * @param id
 * @returns 
 */
  async findById(id: string): Promise<RecipeDocument> {
    const recipe = await this.recipeModel.findById(id).exec();
    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }
    return recipe;
  }


/**
 * Method to update recipe 
 * @param id 
 * @param recipeDto 
 * @returns 
 */
  async update(id: string, recipeDto: UpdateRecipeDto): Promise<RecipeDocument> {
    const updatedRecipe = await this.recipeModel.findByIdAndUpdate(id, recipeDto, { new: true }).exec();
    if (!updatedRecipe) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }
    return updatedRecipe;
  }

/**
 * Method to check recipes when cooked
 * @param id 
 * @returns 
 */
  async toggleChecked(id: string): Promise<RecipeDocument> {
    const recipe = await this.findById(id); // Reuse findById to handle non-existent recipes
    recipe.checked = !recipe.checked;
    recipe.cookCount += 1;
    return recipe.save(); // Ensure recipe is an instance of RecipeDocument
  }

  
}
