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
  styleUrls: ['./recipe-search.component.css']
})
export class RecipeSearchComponent implements OnInit {
  filterTerm: string = '';
  searchTerm: string = 'Dinner';
  cuisineType: string = '';
  healthLabel: string = '';
  recipes: RecipeResponse[] = [];
  allRecipes: RecipeResponse[] = [];

  constructor(private recipeService: RecipeService) { }

  ngOnInit(): void {
    this.searchRecipes();
  }

  searchRecipes() {
    this.recipeService.Recipes(this.searchTerm, this.cuisineType, this.healthLabel).subscribe(
      (res) => {
        this.recipes = res.hits.map(
          (item: {
            recipe: {
              label: string;
              image: string;
              ingredientLines: string[];
              totalTime: number;
              yield: number;
              dishType: string;
              healthLabels: string[];
            };
            _links: { self: { href: string } };
          }) => {
            return {
              label: item.recipe.label,
              dishType: item.recipe.dishType,
              image: item.recipe.image,
              ingredientLines: item.recipe.ingredientLines,
              totalTime: item.recipe.totalTime,
              yield: item.recipe.yield,
              healthLabels: item.recipe.healthLabels,
              self: item._links.self.href,
            };
          }
        );
        this.allRecipes = this.recipes;
        this.applyFilter();
      },
      (error) => {
        console.error('Error fetching recipes', error);
      }
    );
  }

  applyFilter() {
    if (this.filterTerm) {
      this.recipes = this.allRecipes.filter(recipe =>
        recipe.label.toLowerCase().includes(this.filterTerm.toLowerCase())
      );
    } else {
      this.recipes = this.allRecipes;
    }
  }

  onSearch() {
    this.searchRecipes();
  }

  onFilterChange() {
    this.applyFilter();
  }

  onCuisineTypeChange(event: any) {
    this.cuisineType = event.target.value;
  }

  onHealthLabelChange(event: any) {
    this.healthLabel = event.target.value;
  }
}
