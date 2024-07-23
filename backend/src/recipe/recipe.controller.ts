import { Controller, Get, Post, Body, Param, Put, Patch } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';


@Controller('recipes')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Patch(':id/favorite')
  async toggleFavorite(@Param('id') id: string) {
    return this.recipeService.toggleFavorite(id);
  }
  

  @Post()
  create(@Body() createRecipeDto: CreateRecipeDto) {
    return this.recipeService.create(createRecipeDto);
  }

  @Get()
  findAll() {
    return this.recipeService.findAll();
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateRecipeDto: UpdateRecipeDto) {
    return this.recipeService.update(id, updateRecipeDto);
  }

  @Patch(':id/toggle')
  toggleChecked(@Param('id') id: string) {
    return this.recipeService.toggleChecked(id);
  }
}
