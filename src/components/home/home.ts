import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {
  
  // Estilos dinámicos para el binding en el HTML
  tiltStyle: SafeStyle = '';
  parallaxText: SafeStyle = '';
  
  // Posiciones individuales para cada asset flotante
  p1: SafeStyle = ''; // Jarra
  p2: SafeStyle = ''; // Guitarra
  p3: SafeStyle = ''; // Sombrero
  p4: SafeStyle = ''; // Abanico

  constructor(private sanitizer: DomSanitizer) {}

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    
    // Coordenadas normalizadas (-1 a 1) desde el centro
    const x = (e.clientX - w / 2) / (w / 2);
    const y = (e.clientY - h / 2) / (h / 2);

    // 1. Inclinación del contenedor principal (Tilt Effect)
    // Rota suavemente contrario al movimiento del ratón
    this.tiltStyle = this.sanitizer.bypassSecurityTrustStyle(
      `perspective(1000px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`
    );

    // 2. Parallax del Texto (muy sutil)
    this.parallaxText = this.sanitizer.bypassSecurityTrustStyle(
      `translate(${x * -10}px, ${y * -10}px)`
    );

    // 3. Parallax Profundo para Assets
    // Cada elemento se mueve con diferente intensidad para simular distancia Z
    
    // Jarra (Cerca, se mueve más)
    this.p1 = this.sanitizer.bypassSecurityTrustStyle(
      `translate(${x * 30}px, ${y * 30}px)`
    );
    
    // Guitarra (Medio, movimiento inverso)
    this.p2 = this.sanitizer.bypassSecurityTrustStyle(
      `translate(${x * -20}px, ${y * -20}px) rotate(-15deg)`
    );
    
    // Sombrero (Lejos/Fondo, se mueve poco)
    this.p3 = this.sanitizer.bypassSecurityTrustStyle(
      `translate(${x * 10}px, ${y * 10}px) rotate(10deg)`
    );
    
    // Abanico (Cerca, movimiento rápido inverso)
    this.p4 = this.sanitizer.bypassSecurityTrustStyle(
      `translate(${x * -40}px, ${y * -25}px) rotate(20deg)`
    );
  }
}