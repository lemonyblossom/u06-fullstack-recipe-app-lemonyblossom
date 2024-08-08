import { AsyncPipe, CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { Component, OnInit } from '@angular/core';
import { LoggedInUser } from './interfaces/loggedinuser';
import { LoginComponent } from './pages/login/login.component';
import { FooterComponent } from './footer/footer.component';
import { Observable } from 'rxjs';
import { Router, RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { RecipeResponse } from './interfaces/recipe';
import { CapitalizePipe } from './pipes/capitalize.pipe';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterModule, RouterLinkActive, AsyncPipe, LoginComponent, FooterComponent, CapitalizePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  title = "What's Cookin' ey?";
  recipes: RecipeResponse[] = [];
  loggedIn$: Observable<LoggedInUser>;
  isMenuOpen: boolean = false;

  constructor(private auth: AuthService, private route: Router) {
    this.loggedIn$ = this.auth.loggedIn$;

  }

  ngOnInit(): void {

  }
  redirectToHome() {
    this.route.navigate(['/']);
  }

  logout() {
    this.auth.logOut().subscribe({
      next: () => {
        console.log('Logout successful, navigating to login');
        this.route.navigate(['/login']);
      },
      error: (error: any) => {
        console.error('Logout failed:', error);
      }
    });
  }
}



