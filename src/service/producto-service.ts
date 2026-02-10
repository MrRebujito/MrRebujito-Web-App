import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Producto } from '../model/producto'; 

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private url = "http://localhost:8080/producto";

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

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.url);
  }

  getProductoById(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.url}/${id}`);
  }

  saveProducto(producto: Producto): Observable<string> {
    const headers = this.getAuthHeaders();
    return this.http.post(this.url, producto, { headers: headers, responseType: 'text' });
  }

  updateProducto(id: number, producto: Producto): Observable<string> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.url}/${id}`, producto, { headers: headers, responseType: 'text' });
  }

  deleteProducto(id: number): Observable<string> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.url}/${id}`, { headers: headers, responseType: 'text' });
  }
}