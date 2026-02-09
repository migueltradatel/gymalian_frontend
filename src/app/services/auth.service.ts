import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private userSubject = new BehaviorSubject<any>(null);
    public user$ = this.userSubject.asObservable();

    constructor(private api: ApiService, private router: Router) {
        this.loadUser();
    }

    loadUser() {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        const userId = localStorage.getItem('userId');
        if (token && role && userId) {
            this.userSubject.next({ role, userId });
        }
    }

    register(data: any): Observable<any> {
        return this.api.post('/auth/register', data).pipe(
            tap((res: any) => this.setSession(res))
        );
    }

    login(data: any): Observable<any> {
        return this.api.post('/auth/login', data).pipe(
            tap((res: any) => this.setSession(res))
        );
    }

    private setSession(authResult: any) {
        localStorage.setItem('token', authResult.token);
        localStorage.setItem('role', authResult.role);
        localStorage.setItem('userId', authResult.userId);
        this.userSubject.next({ role: authResult.role, userId: authResult.userId });
    }

    logout() {
        localStorage.clear();
        this.userSubject.next(null);
        this.router.navigate(['/login']);
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem('token');
    }

    getRole(): string | null {
        return localStorage.getItem('role');
    }
}
