import { Injectable } from '@angular/core';
import { SolicitudLicencia } from '../model/solicitudLicencia';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SolicitudLicenciaService {
  private url = "http://localhost:8080/solicitud";

  constructor(private http: HttpClient) { }

  getAllSolicitudLicencia(): Observable<SolicitudLicencia[]> {
    return this.http.get<SolicitudLicencia[]>(this.url);
  }

  getSolicitudLicenciaById(id: number): Observable<SolicitudLicencia> {
    return this.http.get<SolicitudLicencia>(`${this.url}/${id}`);
  }

  saveSolicitudLicencia(noticia: SolicitudLicencia): Observable<string> {
    return this.http.post(this.url, noticia, { responseType: 'text' });
  }

  updateSolicitudLicencia(id: number, noticia: SolicitudLicencia): Observable<string> {
    return this.http.put(`${this.url}/${id}`, noticia, { responseType: 'text' });
  }

  deleteSolicitudLicencia(id: number): Observable<string> {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }
}