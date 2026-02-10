import { Injectable } from '@angular/core';
import { Ayuntamiento } from '../model/ayuntamiento';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AyuntamientoService {
  private url = "http://localhost:8080/ayuntamiento";

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    if (token) {
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    }
    return new HttpHeaders();
  }

  getAyuntamientos(): Observable<Ayuntamiento[]> {
    return this.http.get<Ayuntamiento[]>(this.url);
  }

  getAyuntamientoById(id: number): Observable<Ayuntamiento> {
    return this.http.get<Ayuntamiento>(`${this.url}/${id}`);
  }

  // meto para crear ayuntamiento (solo ADMIN)
  saveAyuntamiento(ayuntamiento: Ayuntamiento): Observable<string> {
    const headers = this.getAuthHeaders();
    return this.http.post(this.url, ayuntamiento, { headers: headers, responseType: 'text'});
  }

  // metodo para admin actualizar cualquier ayuntamiento por ID
  updateAyuntamiento(id: number, ayuntamiento: Ayuntamiento): Observable<string> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.url}/${id}`, ayuntamiento, { headers: headers, responseType: 'text'});
  }

  // metodo para actualizar su propio perfil (sin ID)
  updatePropioPerfil(ayuntamiento: Ayuntamiento): Observable<string> {
    const headers = this.getAuthHeaders();
    return this.http.put(this.url, ayuntamiento, { headers: headers, responseType: 'text'});
  }

  // Metodo para admin borrar cualquier ayuntamiento por ID
  deleteAyuntamiento(id: number): Observable<string> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.url}/${id}`, { headers: headers, responseType: 'text'});
  }

  // metodo para borrar su propio perfil (sin ID)
  deletePropioPerfil(): Observable<string> {
    const headers = this.getAuthHeaders();
    return this.http.delete(this.url, { headers: headers, responseType: 'text'});
  }
}