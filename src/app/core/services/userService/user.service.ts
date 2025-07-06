import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserService{

    private apiUrl = 'https://jsonplaceholder.typicode.com/users/1';

  constructor(private http: HttpClient) {}

  getUser(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
