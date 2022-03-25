import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    public currentUser: Observable<User>;
    public currentUserSubject: BehaviorSubject<User>;

    constructor(private http: HttpClient, public router: Router) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser') || '{}'));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(email: string, password: string) {
        return this.http.get<any>(`${environment.apiUrl}/login/` + email + `/` + password)
            .pipe(map(user => {
                localStorage.setItem('currentUser', JSON.stringify(user.data));
                this.currentUserSubject.next(user.data);
                return user.data;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(JSON.parse(localStorage.getItem('currentUser') || '{}'));
        this.router.navigate(['/login']).then(() => {
            location.reload();
        });
    }



    
}
