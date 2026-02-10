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
import { RoleGuard } from '../service/role-guard';
import { AdminTable } from '../components/administrador/admin-table/admin-table';
import { AdminForm } from '../components/administrador/admin-form/admin-form';
import { HomeComponent } from '../components/home/home';
import { CasetaTable } from '../components/caseta/caseta-table/caseta-table';
import { CasetaDetail } from '../components/caseta/caseta-detail/caseta-detail';
import { CasetaForm } from '../components/caseta/caseta-form/caseta-form';
import { CasetaSocios } from '../components/caseta/caseta-socios/caseta-socios';

export const routes: Routes = [

  // ==================== RUTAS PÚBLICAS ====================
  { path: '', component: HomeComponent },
  { path: 'login', component: Login },

  // CASETAS - Listar y ver detalles (PÚBLICO según requisitos)
  { path: 'casetas', component: CasetaTable },
  { path: 'casetas/:id', component: CasetaDetail },

  // AYUNTAMIENTOS - Listar (PÚBLICO según requisitos)
  { path: 'ayuntamientos', component: TableAyuntamiento },
  { path: 'ayuntamientos/:id', component: DetailAyuntamiento },

  // SOCIOS - Listar (PÚBLICO)
  { path: 'socios', component: SocioTable },
  { path: 'socios/:id', component: SocioDetail },

  // ==================== RUTAS DE REGISTRO ====================
  // Registrarse como CASETA o SOCIO (PÚBLICO según requisitos)
  { path: 'casetas/nuevo', component: CasetaForm },
  { path: 'socios/nuevo', component: SocioForm },

  // ==================== RUTAS DE ADMINISTRADOR (SOLO ADMIN) ====================
  {
    path: 'administradores',
    component: AdminTable,
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'administradores/nuevo',
    component: AdminForm,
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'administradores/editar/:id',
    component: AdminForm,
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN'] }
  },
  // Registrar ayuntamientos (SOLO ADMIN según requisitos)
  {
    path: 'ayuntamientos/form',
    component: FormAyuntamiento,
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'ayuntamientos/form/:id',
    component: FormAyuntamiento,
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN', 'AYUNTAMIENTO'] } // Admin puede editar cualquiera, Ayuntamiento solo el suyo
  },

  // ==================== RUTAS DE CASETA ====================
  {
    path: 'casetas/editar/:id',
    component: CasetaForm,
    canActivate: [RoleGuard],
    data: { roles: ['CASETA'] }
  },
  // Gestionar socios de caseta (SOLO CASETA según requisitos)
  {
    path: 'casetas/:id/socios',
    component: CasetaSocios,
    canActivate: [RoleGuard],
    data: { roles: ['CASETA'] }
  },

  // ==================== RUTAS DE SOCIO ====================
  // Editar perfil propio (SOLO el SOCIO autenticado)
  {
    path: 'socios/editar/:id',
    component: SocioForm,
    canActivate: [RoleGuard],
    data: { roles: ['SOCIO'] }
  },

  // ==================== RUTAS DE SOLICITUDES DE LICENCIA ====================
  // Listar solicitudes (Accesible para CASETA y AYUNTAMIENTO)
  {
    path: 'solicitudes',
    component: TableSolicitudLicencia,
    canActivate: [AuthGuard]
  },
  // Ver detalle de solicitud
  {
    path: 'solicitudes/:id',
    component: DetailSolicitudLicencia,
    canActivate: [AuthGuard]
  }
];