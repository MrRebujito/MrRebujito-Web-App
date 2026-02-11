import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-help-center',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './help-center.html',
  styleUrls: ['./help-center.css']
})
export class HelpCenter {
  activeTab: string = 'guia'; // guia | roles | faq
  openFaqIndex: number | null = null;

  faqData = [
    { 
      q: '¿Cómo inicio el proceso de solicitud de caseta?', 
      a: 'Debes estar registrado como Titular de Caseta. Una vez dentro, en tu panel principal, verás la opción de "Nueva Solicitud" donde deberás indicar el número de módulos y adjuntar la documentación necesaria para el Ayuntamiento.' 
    },
    { 
      q: '¿Qué significan los estados de la licencia?', 
      a: 'PENDIENTE: Tu solicitud ha sido enviada. EN_REVISION: El Ayuntamiento la está estudiando. APROBADA: Ya tienes tu sitio en el Real. DENEGADA: Revisa los comentarios para conocer el motivo del rechazo.' 
    },
    { 
      q: '¿Cómo gestiono a los socios de mi caseta?', 
      a: 'Desde el módulo de "Gestión de Socios" puedes añadir nuevos integrantes, controlar el pago de cuotas y exportar el listado oficial requerido por las autoridades.' 
    },
    { 
      q: '¿El Ayuntamiento puede ver mis inventarios?', 
      a: 'No. El Ayuntamiento solo tiene acceso a las licencias y datos fiscales de la caseta. La gestión de productos y socios es privada para la directiva de la caseta.' 
    },
    { 
      q: '¿Es este un sitio real de gestión ferial?', 
      a: 'No, es un proyecto académico desarrollado por alumnos del IES Francisco Rodríguez Marín para demostrar la integración de Spring Boot y Angular.' 
    }
  ];

  setTab(tab: string) {
    this.activeTab = tab;
    this.openFaqIndex = null;
  }

  toggleFaq(index: number) {
    this.openFaqIndex = this.openFaqIndex === index ? null : index;
  }
}