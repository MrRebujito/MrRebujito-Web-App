import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Actor } from '../model/actor';
import { ActorLogin } from '../model/actor-login';

@Injectable({
  providedIn: 'root',
})
export class ActorService {
  private urlLogin = "http://localhost:8080/login";
  private urlActorLogin = "http://localhost:8080/actorLogin";

  constructor(private http: HttpClient) { }

  login(actorLogin: ActorLogin): Observable<string> {
    // IMPORTANTE: responseType: 'text' porque el backend devuelve el token como string plano
    return this.http.post(this.urlLogin, actorLogin, { responseType: 'text' });
  }

  actorLogin(): Observable<Actor> {
    // Recuperamos el token y lo enviamos en la cabecera para que funcione el nuevo endpoint
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Actor>(this.urlActorLogin, { headers: headers });
  }

  getCurrentActor(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + sessionStorage.getItem('token')
    });
    return this.http.get(`${this.urlActorLogin}`, { headers });
  }
}