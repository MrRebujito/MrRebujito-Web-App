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

  saveAyuntamiento(ayuntamiento: Ayuntamiento): Observable<string> {
    return this.http.post(this.url, ayuntamiento, {responseType: 'text'})
  }

  updateAyuntamiento(id: number, ayuntamiento: Ayuntamiento): Observable<String> {
    return this.http.put(`${this.url}/${id}`, ayuntamiento, {responseType: 'text'})
  }

  deleteAyuntamiento(id: number): Observable<string> {
    return this.http.delete(`${this.url}/${id}`, {responseType: 'text'})
  }
}