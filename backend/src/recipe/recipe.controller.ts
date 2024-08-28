import { Controller, Get, Post, Body, Param, Put, Patch, UseGuards } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';


@Controller('recipes')
@UseGuards(JwtAuthGuard)
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}
/**
 * 
 * @param id id is sent from front end and recipe is added to favorite
 * @returns 
 */
  @Patch(':id/favorite')
  async toggleFavorite(@Param('id') id: string) {
    return this.recipeService.toggleFavorite(id);
  }
  
/**
 * 
 * @param createRecipeDto to create a recipe
 * @returns 
 */
  @Post()
  create(@Body() createRecipeDto: CreateRecipeDto) {
    return this.recipeService.create(createRecipeDto);
  }

/**
 * 
 * @returns all recipes from backend
 */
  @Get()
  findAll() {
    return this.recipeService.findAll();
  }

/**
 * 
 * @param id to taken from frontend and recipe is added 
 * @param updateRecipeDto 
 * @returns 
 */
  @Put(':id')
  update(@Param('id') id: string, @Body() updateRecipeDto: UpdateRecipeDto) {
    return this.recipeService.update(id, updateRecipeDto);
  }

/**
 * 
 * @param id is taken from frontend and and recipe is checked  when cooked
 * @returns 
 */
  @Patch(':id/toggle')
  toggleChecked(@Param('id') id: string) {
    return this.recipeService.toggleChecked(id);
  }
}
