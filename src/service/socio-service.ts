import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Socio } from '../model/socio';

@Injectable({
  providedIn: 'root'
})
export class SocioService {
  private apiUrl = 'http://localhost:8080/socio';

  constructor(private http: HttpClient) { }

  getAllSocios(): Observable<Socio[]> {
    return this.http.get<Socio[]>(this.apiUrl);
  }

  getSocio(id: number): Observable<Socio> {
    return this.http.get<Socio>(`${this.apiUrl}/${id}`);
  }

  saveSocio(socio: Socio): Observable<string> {
    return this.http.post(this.apiUrl, socio, { responseType: 'text' });
  }

  updateSocio(socio: Socio): Observable<string> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put(this.apiUrl, socio, { 
      headers: headers, 
      responseType: 'text' 
    });
  }

  deleteSocio(): Observable<string> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete(this.apiUrl, { 
      headers: headers, 
      responseType: 'text' 
    });
  }
}