import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { User } from '../interfaces/user';
import { LoggedInUser } from '../interfaces/loggedinuser';
import { LoginDetails } from '../interfaces/login-details';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'https://u06-fullstack-recipe-app-lemonyblossom.onrender.com/api/';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
  };
  public loggedIn = new BehaviorSubject<LoggedInUser>({
    user: undefined,
    loginState: false
  });
  public loggedIn$: Observable<LoggedInUser> = this.loggedIn.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const token = localStorage.getItem("token");
    if (token) {
      this.httpOptions.headers = this.httpOptions.headers.set('Authorization', `Bearer ${token}`);
    }
  }

  updateLoginState(loginState: LoggedInUser) {
    this.loggedIn.next(loginState);
  }

  getLoginStatus() {
    return this.loggedIn.value.loginState;
  }

  logIn(loginDetails: LoginDetails) {
    this.http.post<any>(this.baseUrl + 'login', loginDetails, this.httpOptions).pipe(
      catchError(this.handleError)).subscribe(res => {
        console.log(res);
        this.updateLoginState({
          user: res.user,
          loginState: true,
        });
        const token = res.token;
        this.httpOptions.headers = this.httpOptions.headers.set('Authorization', `Bearer ${token}`);
        localStorage.setItem("token", token); // Store token locally
      });
  }

  logOut(): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'logout', {}, this.httpOptions).pipe(
      tap(() => {
        console.log('Logout request successful');
        this.updateLoginState({
          user: undefined,
          loginState: false,
        });
        this.httpOptions.headers = this.httpOptions.headers.delete('Authorization'); // Remove token from headers
        localStorage.removeItem('token'); // Remove token from local storage
      }),
      catchError(this.handleError)
    );
  }

  getCurrentUser(): Observable<User> {
    return this.http
      .get<User>(this.baseUrl + 'getUser/' + this.loggedIn.value.user?.id, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 404) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(`Backend returned code ${error.status}`);
    }
    return throwError(() => new Error('Something went wrong; Try again later.'));
  }

  register(registerDetails: any): Observable<any> {
    return this.http
      .post<any>(
        this.baseUrl + 'register',
        registerDetails,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
}
