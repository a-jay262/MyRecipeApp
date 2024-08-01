import { Test, TestingModule } from '@nestjs/testing';
import { RecipeService } from './recipe.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

describe('RecipeService', () => {
  let service: RecipeService;
  let model: Model<any>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipeService,
        {
          provide: getModelToken('Recipe'),
          useValue: {}, // Mock the model or service used by RecipeService
        },
      ],
    }).compile();

    service = module.get<RecipeService>(RecipeService);
    model = module.get<Model<any>>(getModelToken('Recipe'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
