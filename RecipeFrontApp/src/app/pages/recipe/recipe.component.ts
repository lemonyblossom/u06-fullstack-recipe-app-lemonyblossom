import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { RecipeidformatterPipe } from '../../pipes/recipeidformatter.pipe';
import { RecipeResponse } from '../../interfaces/recipe';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-recipe',
  standalone: true,
  imports: [RecipeidformatterPipe, CommonModule, RouterLink],
  templateUrl: './recipe.component.html',
  styleUrl: './recipe.component.css'
})
export class RecipeComponent implements OnInit {
  id?: string;
  recipe?: RecipeResponse;

  constructor(private route: ActivatedRoute,
    private recipeService: RecipeService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id') ?? '';
      console.log(this.id);
      if (this.id) {
        this.getRecipeById(this.id);
      }
    });
  }

  getRecipeById(id: string) {
    this.recipeService.getRecipeById(id).subscribe((res) => {
      console.table(res);
      let healthLabelsValue = res.recipe.healthLabels !== undefined && res.recipe.healthLabels.length > 0 ?
        res.recipe.healthLabels : 'no diet labels';

      if (typeof healthLabelsValue === 'number' && healthLabelsValue <= 0) {
        healthLabelsValue = 'no diet labels';
      }

      let recipe: RecipeResponse = {
        label: res.recipe.label,
        image: res.recipe.image,
        ingredientLines: res.recipe.ingredientLines,
        totalTime: res.recipe.totalTime,
        yield: res.recipe.yield,
        healthLabels: healthLabelsValue,
        cautions: res.recipe.cautions,
        cuisineType: res.recipe.cuisineType,
        mealType: res.recipe.mealType,
        dishType: res.recipe.dishType,
        instructions: res.recipe.instructions,
        tags: res.recipe.tags,
        self: res?.self,
        source: res.recipe.source,
      };
      console.table(recipe);
      this.recipe = recipe;
    });
  }
}
