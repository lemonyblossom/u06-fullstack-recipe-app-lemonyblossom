import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RecipeService } from '../../services/recipe.service';
import { RecipeResponse } from '../../interfaces/recipe';
import { RecipeidformatterPipe } from '../../pipes/recipeidformatter.pipe';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-recipe-search',
  standalone: true,
  imports: [FormsModule, RouterLink, RecipeidformatterPipe],
  templateUrl: './recipe-search.component.html',
  styleUrl: './recipe-search.component.css'
})

export class RecipeSearchComponent implements OnInit {
  filterTerm: string = '';
  searchTerm: string = 'Dinner';
  recipes: RecipeResponse[] = [];


  constructor(private recipeService: RecipeService) { }
  ngOnInit(): void {
    this.searchRecipes();
  }
  searchRecipes() {
    this.recipeService.Recipes(this.searchTerm).subscribe((res) => {
      console.table(res);
      let recipes: RecipeResponse[];
      recipes = res.hits.map(
        (item: {
          recipe: {
            label: any;
            image: any;
            ingredientLines: any;
            totalTime: any;
            yield: any;
            dishType: any;
          };
          _links: { self: { href: any } };
        }) => {
          return {
            label: item.recipe.label,
            dishType: item.recipe.dishType,
            image: item.recipe.image,
            ingredientLines: item.recipe.ingredientLines,
            totalTime: item.recipe.totalTime,
            yield: item.recipe.yield,
            self: item._links.self.href,
          };
        }
      );
      console.log(recipes);
      this.recipes = recipes;
      this.applyFilter();
    });
  }


  applyFilter() {
    if (this.filterTerm) {
      this.recipes = this.recipes.filter(recipe =>
        recipe.label.toLowerCase().includes(this.filterTerm.toLowerCase())
      );
    } else {
      this.searchRecipes();
    }
  }
}
