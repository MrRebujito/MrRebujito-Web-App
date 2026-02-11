import { HttpClient, HttpHeaders } from '@angular/common/http'; // <--- IMPORTANTE: Añadido HttpHeaders
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Socio } from '../model/socio';
import { Caseta } from '../model/caseta';

@Injectable({
  providedIn: 'root'
})
export class SocioService {
  private apiUrl = 'http://localhost:8080/socio';

  constructor(private http: HttpClient) { }

  // Métodos CRUD básicos...
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

  getMisCasetas(): Observable<Caseta[]> {
    const token = sessionStorage.getItem('token'); 
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Caseta[]>(`${this.apiUrl}/misCasetas`, { headers: headers });
  }
}