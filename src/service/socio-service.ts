import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Socio } from '../model/socio';
import { Caseta } from '../model/caseta';

@Injectable({
  providedIn: 'root'
})
export class SocioService {
  // La URL base que conecta con el @RequestMapping("/socio") de tu Spring Boot
  private apiUrl = 'http://localhost:8080/socio';

  constructor(private http: HttpClient) { }

  /**
   * MÉTODOS CRUD ESTÁNDAR
   */

  // Obtener todos los socios (Útil para el Admin o Listados)
  getAllSocios(): Observable<Socio[]> {
    return this.http.get<Socio[]>(this.apiUrl);
  }

  // Obtener un socio específico por su ID numérico
  getSocio(id: number): Observable<Socio> {
    return this.http.get<Socio>(`${this.apiUrl}/${id}`);
  }

  // Registrar un nuevo socio
  saveSocio(socio: Socio): Observable<string> {
    return this.http.post(this.apiUrl, socio, { responseType: 'text' });
  }

  updateSocio(id: number, socio: Socio): Observable<string> {
    // Enviamos al endpoint "/socio" a secas, el ID ya va dentro del objeto socio
    return this.http.put(this.apiUrl, socio, { responseType: 'text' });
  }

  // Eliminar un socio por ID
  deleteSocio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }


  // Obtener los datos completos del socio que tiene la sesión iniciada
  getPerfilLogueado(): Observable<Socio> {
    return this.http.get<Socio>(`${this.apiUrl}/detalles`);
  }

  // Obtener la lista de casetas a las que pertenece el socio logueado
  getMisCasetas(): Observable<Caseta[]> {
    return this.http.get<Caseta[]>(`${this.apiUrl}/misCasetas`);
  }
}