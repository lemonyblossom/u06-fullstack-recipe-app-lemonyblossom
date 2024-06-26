export interface RecipeResponse {
   label: string;
   image: string;
   ingredientLines?: string[];
   totalTime: number;
   yield?: number;
   healthLabels?: string[];
   dietLabels?: string[];
   cautions?: string[];
   cuisineType?: string[];
   mealType?: string[];
   dishType?: string[];
   instructions?: string;
   tags?: string[];
   self: string;
   source: string[];
}
