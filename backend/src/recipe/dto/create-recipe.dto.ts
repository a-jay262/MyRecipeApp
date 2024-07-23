// src/recipe/dto/create-recipe.dto.ts
import { IsString, IsNumber, IsArray, IsOptional } from 'class-validator';
import { Step, Ingredient } from '../schemas/recipe.schema';

export class CreateRecipeDto {
  @IsString()
  name: string;

  @IsNumber()
  size: number;

  @IsArray()
  ingredients: Ingredient[];

  @IsArray()
  steps: Step[];

  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  image: string;
}


