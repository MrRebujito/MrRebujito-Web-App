import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Socio } from '../model/socio';


@Injectable({
  providedIn: 'root'
})
export class SocioService {
  private apiUrl = 'http://localhost:8080/socio';

  constructor(private http: HttpClient) { }

  // CRUD Completo
  getAllSocios(): Observable<Socio[]> {
    return this.http.get<Socio[]>(this.apiUrl);
  }

  getSocio(id: number): Observable<Socio> {
    return this.http.get<Socio>(`${this.apiUrl}/${id}`);
  }

  saveSocio(socio: Socio): Observable<string> {
    return this.http.post(this.apiUrl, socio, { responseType: 'text' });
  }

  updateSocio(id: number, socio: Socio): Observable<string> {
    return this.http.put(this.apiUrl, socio, { responseType: 'text' });
  }

  deleteSocio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}