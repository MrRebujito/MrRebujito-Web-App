import { Routes } from '@angular/router';
import { TableSolicitudLicencia } from '../components/solicitud-licencia/table-solicitud-licencia/table-solicitud-licencia';
import { TableAyuntamiento } from '../components/ayuntamiento/table-ayuntamiento/table-ayuntamiento';
import { DetailAyuntamiento } from '../components/ayuntamiento/detail-ayuntamiento/detail-ayuntamiento';
import { SocioTable } from '../components/socio/socio-table/socio-table';
import { SocioDetail } from '../components/socio/socio-detail/socio-detail';
import { SocioForm } from '../components/socio/socio-form/socio-form';

export const routes: Routes = [
  { path: 'solicitudes', component: TableSolicitudLicencia },

  // Rutas de ayuntamiento
  { path: 'ayuntamientos', component: TableAyuntamiento },
  { path: 'ayuntamientos/:id', component: DetailAyuntamiento },

  //Socio
  { path: 'socios', component: SocioTable},
  { path: 'socios/nuevo', component: SocioForm },
  { path: 'socios/editar/:id', component: SocioForm },
  { path: 'socios/:id', component: SocioDetail}

];