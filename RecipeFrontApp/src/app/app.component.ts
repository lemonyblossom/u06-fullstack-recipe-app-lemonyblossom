import { AsyncPipe, CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { Component, OnInit, HostListener } from '@angular/core';
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
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = "What's Cookin' ey?";
  recipes: RecipeResponse[] = [];
  loggedIn$: Observable<LoggedInUser>;
  isMenuOpen: boolean = false;

  constructor(private auth: AuthService, private router: Router) {
    this.loggedIn$ = this.auth.loggedIn$;
  }

  ngOnInit(): void { }

  redirectToHome() {
    this.router.navigate(['/']);
  }

  /*  logOut() {
     this.auth.logMeOut();
     alert('Logged out successfully');
 
   } */


  logOut() {
    console.log('Logout function called in AppComponent');
    this.auth.logOut().subscribe({
      next: () => {
        console.log('Logout successful, navigating to login');
        this.router.navigate(['/login']);
      },
      error: (error: any) => {
        console.error('Logout failed:', error);
      }
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.menu') && !target.closest('.menu-button')) {
      this.closeMenu();
    }
  }

}
