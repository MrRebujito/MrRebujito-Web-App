import { Routes } from '@angular/router';
import { TableSolicitudLicencia } from '../components/solicitud-licencia/table-solicitud-licencia/table-solicitud-licencia';
import { TableAyuntamiento } from '../components/ayuntamiento/table-ayuntamiento/table-ayuntamiento';
import { DetailAyuntamiento } from '../components/ayuntamiento/detail-ayuntamiento/detail-ayuntamiento';

export const routes: Routes = [
  { path: 'solicitudes', component: TableSolicitudLicencia },

  // Rutas de ayuntamiento
  { path: 'ayuntamientos', component: TableAyuntamiento },
  { path: 'ayuntamientos/:id', component: DetailAyuntamiento }
];