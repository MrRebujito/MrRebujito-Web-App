import { Actor } from "./actor";

export class Socio extends Actor{
    primerApellido!: string;
    segundoApellido?: string;
    fechaAlta?: Date;
}