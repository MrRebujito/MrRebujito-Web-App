import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Caseta } from '../model/caseta';
import { Socio } from '../model/socio';
import { Producto } from '../model/producto';

@Injectable({
  providedIn: 'root'
})
export class CasetaService {
  private apiUrl = 'http://localhost:8080/caseta';

  constructor(private http: HttpClient) { }

  // ========== CRUD BÁSICO ==========
  
  // Obtener todas las casetas
  getAllCasetas(): Observable<Caseta[]> {
    return this.http.get<Caseta[]>(this.apiUrl);
  }

  // Obtener una caseta por ID
  getCaseta(id: number): Observable<Caseta> {
    return this.http.get<Caseta>(`${this.apiUrl}/${id}`);
  }

  // Crear nueva caseta
  saveCaseta(caseta: Caseta): Observable<string> {
    return this.http.post(this.apiUrl, caseta, { responseType: 'text' });
  }

  // Actualizar caseta
  updateCaseta(caseta: Caseta): Observable<string> {
    return this.http.put(this.apiUrl, caseta, { responseType: 'text' });
  }

  // Eliminar caseta (requiere autenticación)
  deleteCaseta(): Observable<void> {
    return this.http.delete<void>(this.apiUrl);
  }

  // ========== FUNCIONALIDADES ESPECÍFICAS ==========
  
  // Obtener todos los socios de una caseta
  getSociosByCaseta(): Observable<Socio[]> {
    return this.http.get<Socio[]>(`${this.apiUrl}/socios`);
  }

  // Añadir un socio a la caseta
  addSocioToCaseta(socioId: number): Observable<string> {
    return this.http.get(`${this.apiUrl}/anadirSocio/${socioId}`, { responseType: 'text' });
  }

  // Eliminar un socio de la caseta
  removeSocioFromCaseta(socioId: number): Observable<string> {
    return this.http.get(`${this.apiUrl}/eliminarSocio/${socioId}`, { responseType: 'text' });
  }

  // Obtener la carta/productos de una caseta
  getCartaByCaseta(id: number): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/carta/${id}`);
  }

  // Obtener la carta de la caseta logueada
  getCartaCasetaLogin(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/carta`);
  }

  // Crear solicitud de licencia
  crearSolicitud(ayuntamientoId: number): Observable<string> {
    return this.http.post(`${this.apiUrl}/solicitud/${ayuntamientoId}`, {}, { responseType: 'text' });
  }
}