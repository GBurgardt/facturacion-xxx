import { Numero } from "app/models/numero";

export class Numerador {
    idCteNumerador: number;
    descripcion: string;
    numero: Numero[]

    constructor(numerador?: {
        idCteNumerador: number;
        descripcion: string;
        numero: any
    }) {
        if (numerador) {
            this.idCteNumerador = numerador.idCteNumerador;
            this.descripcion = numerador.descripcion;
            this.numero = numerador.numero.map(n => new Numero(n))
        } else {
            this.idCteNumerador = null;
            this.descripcion = null;
            this.numero = null
        }
    }
}