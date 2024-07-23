import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecipeModule } from './recipe/recipe.module'; // Ensure this path is correct
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { FileUploadModule } from './recipe/files/file-upload.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/my-recipe-app'), // Adjust the connection string if needed
    RecipeModule, // Import the RecipeModule
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    FileUploadModule,
  ],
})
export class AppModule {}




