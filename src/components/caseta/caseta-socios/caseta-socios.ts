import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CasetaService } from '../../../service/caseta-service';
import { SocioService } from '../../../service/socio-service';
import { Socio } from '../../../model/socio';
import { Caseta } from '../../../model/caseta';

@Component({
  selector: 'app-caseta-socios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './caseta-socios.html',
  styleUrl: './caseta-socios.css'
})
export class CasetaSocios implements OnInit {
  casetaId!: number;
  caseta!: Caseta;
  sociosDisponibles: Socio[] = [];
  sociosAsignados: Socio[] = [];
  socioSeleccionadoId: number | null = null;
  
  // Para búsqueda de socios
  textoBusqueda: string = '';
  sociosFiltrados: Socio[] = [];
  mostrandoResultados: boolean = false;
  
  cdr = inject(ChangeDetectorRef);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private casetaService: CasetaService,
    private socioService: SocioService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.casetaId = Number(id);
      this.cargarDatos();
    }
  }

  cargarDatos(): void {
    // Cargar caseta con sus socios
    this.casetaService.getCaseta(this.casetaId).subscribe({
      next: (data) => {
        this.caseta = data;
        this.sociosAsignados = data.socios || [];
        // Después de cargar la caseta, cargamos los socios disponibles
        this.cargarSociosDisponibles();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar caseta:', err);
        alert('Error al cargar los datos de la caseta');
      }
    });
  }

  cargarSociosDisponibles(): void {
    this.socioService.getAllSocios().subscribe({
      next: (todosSocios: Socio[]) => {
        // IDs de socios ya asignados
        const idsAsignados = this.sociosAsignados.map(s => s.id);
        
        // Filtrar socios que NO están asignados Y que no están baneados (opcional)
        this.sociosDisponibles = todosSocios.filter(socio => 
          !idsAsignados.includes(socio.id) && !socio.baneado
        );
        
        // Inicializar la lista filtrada
        this.sociosFiltrados = [...this.sociosDisponibles];
        
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al cargar socios:', err);
        alert('Error al cargar la lista de socios');
      }
    });
  }

  buscarSocios(): void {
    this.mostrandoResultados = true;
    
    if (!this.textoBusqueda.trim()) {
      this.sociosFiltrados = [...this.sociosDisponibles];
      return;
    }

    const busqueda = this.textoBusqueda.toLowerCase().trim();
    
    this.sociosFiltrados = this.sociosDisponibles.filter(socio => {
      const nombreCompleto = `${socio.nombre} ${socio.primerApellido} ${socio.segundoApellido || ''}`.toLowerCase();
      return nombreCompleto.includes(busqueda) || 
             socio.username.toLowerCase().includes(busqueda) ||
             socio.correo.toLowerCase().includes(busqueda);
    });
    
    this.cdr.detectChanges();
  }

  limpiarBusqueda(): void {
    this.textoBusqueda = '';
    this.sociosFiltrados = [...this.sociosDisponibles];
    this.mostrandoResultados = false;
    this.cdr.detectChanges();
  }

  agregarSocio(): void {
    if (!this.socioSeleccionadoId) {
      alert('Por favor seleccione un socio');
      return;
    }

    // Validar aforo (Requisito No Funcional 4)
    if (this.sociosAsignados.length >= this.caseta.aforo) {
      alert(`No se puede añadir más socios. Aforo máximo: ${this.caseta.aforo}`);
      return;
    }

    // Buscar el socio seleccionado para mostrar su nombre
    const socioSeleccionado = this.sociosDisponibles.find(s => s.id === this.socioSeleccionadoId);
    const nombreSocio = socioSeleccionado ? 
      `${socioSeleccionado.nombre} ${socioSeleccionado.primerApellido}` : 
      this.socioSeleccionadoId.toString();

    if (confirm(`¿Añadir a ${nombreSocio} como socio de esta caseta?`)) {
      this.casetaService.addSocioToCaseta(this.socioSeleccionadoId).subscribe({
        next: (respuesta) => {
          alert('Socio agregado correctamente');
          this.socioSeleccionadoId = null;
          this.limpiarBusqueda();
          this.cargarDatos();
        },
        error: (err) => {
          console.error('Error al agregar socio:', err);
          
          let mensajeError = 'Error al agregar el socio.';
          
          if (err.status === 403) {
            mensajeError = 'No tienes permisos para realizar esta acción.';
          } else if (err.status === 400) {
            if (err.error?.includes('aforo')) {
              mensajeError = `Aforo máximo alcanzado (${this.caseta.aforo}). No puedes añadir más socios.`;
            } else if (err.error?.includes('ya está en la caseta')) {
              mensajeError = 'Este socio ya pertenece a la caseta.';
            } else {
              mensajeError = 'Error en la solicitud. Verifica los datos.';
            }
          }
          
          alert(mensajeError);
        }
      });
    }
  }

  eliminarSocio(socioId: number): void {
    // Buscar el socio para mostrar su nombre
    const socioEliminar = this.sociosAsignados.find(s => s.id === socioId);
    const nombreSocio = socioEliminar ? 
      `${socioEliminar.nombre} ${socioEliminar.primerApellido}` : 
      socioId.toString();

    if (!confirm(`¿Está seguro de eliminar a ${nombreSocio} de esta caseta?`)) {
      return;
    }

    this.casetaService.removeSocioFromCaseta(socioId).subscribe({
      next: () => {
        alert('Socio eliminado correctamente');
        this.cargarDatos();
      },
      error: (err) => {
        console.error('Error al eliminar socio:', err);
        alert('Error al eliminar el socio');
      }
    });
  }

  volver(): void {
    this.router.navigate(['/casetas', this.casetaId]);
  }
  
  getIniciales(socio: Socio): string {
    const inicialNombre = socio.nombre?.charAt(0) || '';
    const inicialApellido = socio.primerApellido?.charAt(0) || '';
    return (inicialNombre + inicialApellido).toUpperCase();
  }
}