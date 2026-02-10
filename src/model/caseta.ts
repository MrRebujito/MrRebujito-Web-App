import { Actor } from "./actor";
import { Socio } from "./socio";
import { SolicitudLicencia } from "./solicitud-licencia";
import { Producto } from "./producto";

export class Caseta extends Actor {
    razonS!: String;
    aforo!: number;
    publica!: boolean;
    socios?: Socio[];
    solicitudesLicencia?: SolicitudLicencia[];
    productos?: Producto[];
}