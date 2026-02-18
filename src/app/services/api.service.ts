import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        if (token) {
            headers = headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    }

    get(path: string): Observable<any> {
        return this.http.get(`${this.apiUrl}${path}`, { headers: this.getHeaders() });
    }

    post(path: string, body: any): Observable<any> {
        return this.http.post(`${this.apiUrl}${path}`, body, { headers: this.getHeaders() });
    }

    put(path: string, body: any): Observable<any> {
        return this.http.put(`${this.apiUrl}${path}`, body, { headers: this.getHeaders() });
    }

    delete(path: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}${path}`, { headers: this.getHeaders() });
    }
}
