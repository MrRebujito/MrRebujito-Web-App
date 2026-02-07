import { Routes } from '@angular/router';
import { TableSolicitudLicencia } from '../components/solicitud-licencia/table-solicitud-licencia/table-solicitud-licencia';
import { TableAyuntamiento } from '../components/ayuntamiento/table-ayuntamiento/table-ayuntamiento';

export const routes: Routes = [
  { path: 'solicitudes', component: TableSolicitudLicencia },
  { path: 'ayuntamientos', component: TableAyuntamiento }
];