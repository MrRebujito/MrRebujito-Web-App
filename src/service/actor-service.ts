import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
    return this.http.post(this.urlLogin, actorLogin, { responseType: 'text' });
  }

  actorLogin(): Observable<Actor> {
    return this.http.get<Actor>(this.urlActorLogin);
  }
}