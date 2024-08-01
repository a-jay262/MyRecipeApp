import { Test, TestingModule } from '@nestjs/testing';
import { RecipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';

describe('RecipeController', () => {
  let controller: RecipeController;
  let service: RecipeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipeController],
      providers: [
        {
          provide: RecipeService,
          useValue: {
            toggleFavorite: jest.fn().mockResolvedValue(true),
            create: jest.fn().mockResolvedValue(true),
            findAll: jest.fn().mockResolvedValue([]),
            update: jest.fn().mockResolvedValue(true),
            toggleChecked: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    controller = module.get<RecipeController>(RecipeController);
    service = module.get<RecipeService>(RecipeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
