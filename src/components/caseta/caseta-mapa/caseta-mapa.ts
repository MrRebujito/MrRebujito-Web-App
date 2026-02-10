import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

@Component({
  selector: 'app-caseta-mapa',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card mb-4">
      <div class="card-header bg-info text-white">
        <h5 class="mb-0"><i class="bi bi-geo-alt-fill"></i> Ubicación en Mapa</h5>
      </div>
      <div class="card-body p-0">
        <div id="map" style="height: 400px; width: 100%;"></div>
        <div class="p-3" *ngIf="!latitud || !longitud">
          <p class="text-muted mb-0">
            <i class="bi bi-info-circle"></i>
            No hay coordenadas disponibles para mostrar en el mapa.
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    #map { 
      z-index: 1; 
    }
  `]
})
export class CasetaMapa implements AfterViewInit {
  @Input() latitud?: number;
  @Input() longitud?: number;
  @Input() nombre?: string;

  private map: any;

  ngAfterViewInit(): void {
    if (this.latitud && this.longitud) {
      this.initMap();
    }
  }

  private initMap(): void {
    // Coordenadas por defecto (Sevilla)
    const lat = this.latitud || 37.389092;
    const lng = this.longitud || -5.984459;

    // Inicializar mapa
    this.map = L.map('map').setView([lat, lng], 15);

    // Añadir capa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Añadir marcador
    const marker = L.marker([lat, lng]).addTo(this.map);
    
    if (this.nombre) {
      marker.bindPopup(`<b>${this.nombre}</b>`).openPopup();
    }
  }
}