import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { LoginDetails } from './interfaces/login-details';
import { User } from './interfaces/user';
import { Observable } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RecipeSearchComponent } from './pages/search/recipe-search.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, RecipeSearchComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'RecipeFrontApp';

  loginDetails: LoginDetails;

  loggedIn$: Observable<boolean>;

  constructor(private auth: AuthService) {
    this.loginDetails = {
      email: "seb@seb.seb",
      password: "sebsebseb"
    }

    this.loggedIn$ = this.auth.loggedIn$;
    console.log(auth.getUser2());
  }

  login() {
    this.auth.loginUser(this.loginDetails);
  }
  logout() {
    this.auth.logOut();
  }
}

//allt fluff ska ingå här