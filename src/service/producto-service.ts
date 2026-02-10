import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Producto } from '../model/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  // Ajusta el puerto si tu backend no está en el 8080
  private apiUrl = 'http://localhost:8080/producto'; 

  constructor(private http: HttpClient) { }

  // 1. Obtener todos (para la Tabla)
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  // 2. Obtener uno por ID (para el Detalle y Editar)
  getProductoById(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }

  // 3. Crear nuevo (FALTABA ESTE)
  createProducto(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, producto);
  }

  // 4. Actualizar existente (FALTABA ESTE)
  updateProducto(id: number, producto: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/${id}`, producto);
  }

  // 5. Borrar (para la Tabla)
  deleteProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}