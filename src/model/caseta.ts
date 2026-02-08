import { Actor } from "./actor";
import { Socio } from "./socio";
import { SolicitudLicencia } from "./solicitud-licencia";
//import { Producto } from "./producto";

// Enum para los estados de la caseta
export enum EstadoCaseta {
    DISPONIBLE = 'DISPONIBLE',
    OCUPADA = 'OCUPADA',
    MANTENIMIENTO = 'MANTENIMIENTO',
    RESERVADA = 'RESERVADA'
}

export class Caseta extends Actor {
    razonS!: String;
    aforo!: number;
    publica!: boolean;
    socios?: Socio[];
    solicitudesLicencia?: SolicitudLicencia[];
    //productos?: Producto[];


    numero?: number; // Número de caseta
    ubicacion?: string; // Ubicación/dirección específica
    capacidad?: number; // Aforo de la caseta
    estado?: EstadoCaseta; // Estado de la caseta
    latitud?: number; // Para el mapa
    longitud?: number; // Para el mapa
}