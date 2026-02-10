import { TipoAlimento } from "./tipo-alimento";

export class Producto{
    nombre!: string;
    tipoAlimento!: TipoAlimento;
    precio?: number;
}