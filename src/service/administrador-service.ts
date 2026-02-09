import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Administrador } from '../model/administrador';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private url = "http://localhost:8080/administrador";

  constructor(private http: HttpClient) { }

  // CRUD Completo
  getAllAdministradores(): Observable<Administrador[]> {
    return this.http.get<Administrador[]>(this.url);
  }

  getAdministrador(id: number): Observable<Administrador> {
    return this.http.get<Administrador>(`${this.url}/${id}`);
  }

  saveAdministrador(administrador: Administrador): Observable<string> {
    return this.http.post(this.url, administrador, { responseType: 'text' });
  }

  updateAdministrador(administrador: Administrador): Observable<string> {
    return this.http.put(this.url, administrador, { responseType: 'text' });
  }

  deleteAdministrador(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  // Métodos de gestión de usuarios (banear/desbanear)
  banearActor(actorId: number): Observable<string> {
    return this.http.put(`http://localhost:8080/banear/${actorId}`, {}, { responseType: 'text' });
  }

  desbanearActor(actorId: number): Observable<string> {
    return this.http.put(`http://localhost:8080/desbanear/${actorId}`, {}, { responseType: 'text' });
  }

  // Login (devuelve token JWT)
  login(username: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>('http://localhost:8080/login', { username, password });
  }
}
