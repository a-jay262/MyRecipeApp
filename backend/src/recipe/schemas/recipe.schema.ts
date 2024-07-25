import { Schema, Document } from 'mongoose';
import { Prop, Schema as MongooseSchema, SchemaFactory } from '@nestjs/mongoose';

export type RecipeDocument = Recipe & Document;


@MongooseSchema()
export class Step {
  @Prop()
  step: string;

  @Prop()
  des: string;
}

@MongooseSchema()
export class Ingredient {
  @Prop()
  item: string;

  @Prop()
  quantity: number;

  @Prop()
  unit: string;
}

@MongooseSchema()
export class Recipe {
  @Prop()
  name: string;

  @Prop()
  size: number;

  @Prop({ type: [{ type: Object }] })
  ingredients: Ingredient[];

  @Prop({ type: [{ type: Object }] })
  steps: Step[];

  @Prop()
  category: string;

  @Prop()
  image: string;

  @Prop({ default: false })
  checked: boolean;

  @Prop({ default: 0 })
  cookCount: number;

  @Prop({ default: false })  // Add this if you want to manage favorites
  favorites: boolean;
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
