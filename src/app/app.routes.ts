import { Routes } from '@angular/router';
import { TableSolicitudLicencia } from '../components/solicitud-licencia/table-solicitud-licencia/table-solicitud-licencia';
import { TableAyuntamiento } from '../components/ayuntamiento/table-ayuntamiento/table-ayuntamiento';
import { DetailAyuntamiento } from '../components/ayuntamiento/detail-ayuntamiento/detail-ayuntamiento';
import { SocioTable } from '../components/socio/socio-table/socio-table';
import { SocioDetail } from '../components/socio/socio-detail/socio-detail';
import { SocioForm } from '../components/socio/socio-form/socio-form';
import { DetailSolicitudLicencia } from '../components/solicitud-licencia/detail-solicitud-licencia/detail-solicitud-licencia';
import { Login } from '../components/actor-login/login';
import { FormAyuntamiento } from '../components/ayuntamiento/form-ayuntamiento/form-ayuntamiento';
import { AuthGuard } from '../service/auth-guard';

export const routes: Routes = [

  // Rutas públicas
  { path: '', redirectTo: '/solicitudes', pathMatch: 'full' },

  // Rutas protegidas
  //socio
  {
    path: 'socios/editar/:id',
    component: SocioForm,
    canActivate: [AuthGuard]
  },
  //ayuntamiento
  {
    path: 'socios/form/:id',
    component: SocioForm,
    canActivate: [AuthGuard]
  },

  /* Ruta para perfil de admin (necesitarás crear este componente)
  {
    path: 'admin/perfil',
    component: AdminProfileComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] } // Guard específico por rol
  },*/

  // Ruta del login
  { path: 'login', component: Login },

  // Rutas de solicitudLicencia
  { path: 'solicitudes', component: TableSolicitudLicencia },
  { path: 'solicitudes/:id', component: DetailSolicitudLicencia },

  // Rutas de ayuntamiento
  { path: 'ayuntamientos', component: TableAyuntamiento },
  { path: 'ayuntamientos/form', component: FormAyuntamiento },
  { path: 'ayuntamientos/form/:id', component: FormAyuntamiento },
  { path: 'ayuntamientos/:id', component: DetailAyuntamiento },


  //Socio
  { path: 'socios', component: SocioTable },
  { path: 'socios/nuevo', component: SocioForm },
  { path: 'socios/editar/:id', component: SocioForm },
  { path: 'socios/:id', component: SocioDetail },

  // Rutas de socio
  { path: 'socios', component: SocioTable }
];