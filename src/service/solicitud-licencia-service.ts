import { Injectable } from '@angular/core';
import { SolicitudLicencia } from '../model/solicitud-licencia';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SolicitudLicenciaService {
  private url = "http://localhost:8080/solicitud";

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

  getAllSolicitudLicencia(): Observable<SolicitudLicencia[]> {
    return this.http.get<SolicitudLicencia[]>(this.url);
  }

  getSolicitudLicenciaById(id: number): Observable<SolicitudLicencia> {
    return this.http.get<SolicitudLicencia>(`${this.url}/${id}`);
  }

  saveSolicitudConAyuntamientoId(ayuntamientoId: number): Observable<any> {
    return this.http.post(`${this.url}/crear-con-ayuntamiento/${ayuntamientoId}`, {});
  }

  saveSolicitudLicencia(solicitud: SolicitudLicencia): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(this.url, solicitud, { headers });
  }

  updateSolicitudLicencia(id: number, solicitud: SolicitudLicencia): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put<any>(`${this.url}/${id}`, solicitud, { headers });
  }

  deleteSolicitudLicencia(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete<any>(`${this.url}/${id}`, { headers });
  }
}