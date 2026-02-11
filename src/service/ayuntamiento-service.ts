import { Injectable } from '@angular/core';
import { Ayuntamiento } from '../model/ayuntamiento';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AyuntamientoService {
  private url = "http://localhost:8080/ayuntamiento";

  constructor(private http: HttpClient) { }

  getAyuntamientos(): Observable<Ayuntamiento[]> {
    return this.http.get<Ayuntamiento[]>(this.url);
  }

  getAyuntamientoById(id: number): Observable<Ayuntamiento> {
    return this.http.get<Ayuntamiento>(`${this.url}/${id}`);
  }

  // Método para crear ayuntamiento (solo ADMIN)
  saveAyuntamiento(ayuntamiento: Ayuntamiento): Observable<string> {
    return this.http.post(this.url, ayuntamiento, { responseType: 'text'});
  }

  // Método para admin actualizar cualquier ayuntamiento por ID
  updateAyuntamiento(id: number, ayuntamiento: Ayuntamiento): Observable<string> {
    return this.http.put(`${this.url}/${id}`, ayuntamiento, { responseType: 'text'});
  }

  // Método para actualizar su propio perfil (sin ID)
  updatePropioPerfil(ayuntamiento: Ayuntamiento): Observable<string> {
    return this.http.put(this.url, ayuntamiento, { responseType: 'text'});
  }

  // Método para admin borrar cualquier ayuntamiento por ID
  deleteAyuntamiento(id: number): Observable<string> {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text'});
  }

  // Método para borrar su propio perfil (sin ID)
  deletePropioPerfil(): Observable<string> {
    return this.http.delete(this.url, { responseType: 'text'});
  }
}