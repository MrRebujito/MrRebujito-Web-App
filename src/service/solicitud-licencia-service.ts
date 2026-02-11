import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SolicitudLicencia } from '../model/solicitud-licencia';

@Injectable({
  providedIn: 'root'
})
export class SolicitudLicenciaService {
  
  private baseUrl = 'http://localhost:8080'; // Ajusta según tu configuración

  constructor(private http: HttpClient) { }

  /**
   * Obtener headers con token JWT
   */
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  /**
   * GET /solicitud - Ver todas las solicitudes (ADMIN, CASETA, AYUNTAMIENTO)
   */
  getAllSolicitudLicencia(): Observable<SolicitudLicencia[]> {
    return this.http.get<SolicitudLicencia[]>(`${this.baseUrl}/solicitud`, {
      headers: this.getHeaders()
    });
  }

  /**
   * GET /solicitud/{id} - Ver una solicitud por ID
   */
  getSolicitudById(id: number): Observable<SolicitudLicencia> {
    return this.http.get<SolicitudLicencia>(`${this.baseUrl}/solicitud/${id}`, {
      headers: this.getHeaders()
    });
  }

  /**
   * GET /solicitud/Ayuntamiento - Ver solicitudes dirigidas a mi ayuntamiento
   * (Solo AYUNTAMIENTO - obtiene automáticamente el ID del token)
   */
  getSolicitudesDeMiAyuntamiento(): Observable<SolicitudLicencia[]> {
    return this.http.get<SolicitudLicencia[]>(`${this.baseUrl}/solicitud/ayuntamiento`, {
      headers: this.getHeaders()
    });
  }

  /**
   * POST /caseta/solicitud/{ayuntamientoId} - Crear solicitud de licencia (CASETA)
   */
  crearSolicitudCaseta(ayuntamientoId: number): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/caseta/solicitud/${ayuntamientoId}`, 
      null, // No enviamos body, el ID va en la URL
      { 
        headers: this.getHeaders(),
        responseType: 'text' as 'json' 
      }
    );
  }

  /**
   * PUT /solicitud/aceptar/{id} - Aceptar solicitud (AYUNTAMIENTO)
   */
  aceptarSolicitud(id: number): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/solicitud/aceptar/${id}`,
      null,
      { 
        headers: this.getHeaders(),
        responseType: 'text' as 'json'
      }
    );
  }

  /**
   * PUT /solicitud/rechazar/{id} - Rechazar solicitud (AYUNTAMIENTO)
   */
  rechazarSolicitud(id: number): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/solicitud/rechazar/${id}`,
      null,
      { 
        headers: this.getHeaders(),
        responseType: 'text' as 'json'
      }
    );
  }

  /**
   * DELETE /solicitud/{id} - Eliminar solicitud (solo CASETA y solo si está PENDIENTE)
   */
  deleteSolicitudLicencia(id: number): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}/solicitud/${id}`,
      { 
        headers: this.getHeaders(),
        responseType: 'text' as 'json'
      }
    );
  }
}