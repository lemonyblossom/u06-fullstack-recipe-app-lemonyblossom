import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { RecipeResponse } from '../interfaces/recipe';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private baseUrl = 'https://api.edamam.com/api/recipes/v2?type=public';
  private app_key = 'a83c1ac4413b17fea8fd10ce1a93dd53';
  private app_id = '857ad764';

  private httOptions = {
    headers: new HttpHeaders({
      accept: 'application/json',
      'Accept-Language': 'en',
    }),
  };

  constructor(private http: HttpClient) { }

  Recipes(
    q: string,
    cuisineType?: string,
    healthLabel?: string
  ): Observable<any> {
    let url = `${this.baseUrl}&q=${q}&app_id=${this.app_id}&app_key=${this.app_key}&random=true`;
    if (cuisineType) url += `&cuisineType=${cuisineType}`;
    if (healthLabel) url += `&health=${healthLabel}`;

    return this.http.get<any>(url, this.httOptions);
  }

  fetchRecipeSuggestions(): Observable<RecipeResponse[]> {
    const dishTypes = ['starter', 'main course', 'desserts'];
    const observables: Observable<RecipeResponse[]>[] = [];

    dishTypes.forEach((dishType) => {
      const url = `${this.baseUrl}&dishType=${dishType}&random=true&app_id=${this.app_id}&app_key=${this.app_key}&from=0&to=3`;
      observables.push(this.http.get<any>(url, this.httOptions).pipe(
        map((res) => {
          return res.hits.map((item: { recipe: any; _links: any }) => {
            return {
              dishType: item.recipe.dishType,
              label: item.recipe.label,
              image: item.recipe.image,
              ingredientLines: item.recipe.ingredientLines,
              totalTime: item.recipe.totalTime,
              yield: item.recipe.yield,
              self: item._links.self.href,
            };
          });
        })
      ));
    });

    return forkJoin(observables).pipe(
      map((res) => {
        return res.reduce((acc, curr) => acc.concat(curr), []);
      })
    );
  }

  getRecipeById(id: string): Observable<any> {
    let url = `https://api.edamam.com/api/recipes/v2/${id}?type=public&app_id=${this.app_id}&app_key=${this.app_key}`;
    return this.http.get<any>(url, this.httOptions);
  }
}
