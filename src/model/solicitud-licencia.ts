import { Ayuntamiento } from "./ayuntamiento";
import { EstadoLicencia } from "./estado-licencia";

export class SolicitudLicencia {
	id!: number;
    estadoLicencia!: EstadoLicencia;
    ayuntamiento!: Ayuntamiento;
}