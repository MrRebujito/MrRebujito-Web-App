import { TipoAlimento } from "./tipo-alimento";

export class Producto{
    id!: number;
    nombre!: string;
    tipoAlimento!: TipoAlimento;
    precio?: number;
}