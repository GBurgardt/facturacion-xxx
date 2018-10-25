import { Numero } from "app/models/numero";
import { DateLikePicker } from "./dateLikePicker";

export class Numerador {
    idCteNumerador: number;
    descripcion: string;
    // numero: Numero[]
    numero: Numero;
    fechaApertura: DateLikePicker;
    fechaCierre: DateLikePicker;

    constructor(numerador?: {
        idCteNumerador: number;
        descripcion: string;
        numero: any;
        fechaApertura: any;
        fechaCierre: any;
    }) {
        if (numerador) {
            this.idCteNumerador = numerador.idCteNumerador;
            this.descripcion = numerador.descripcion;
            // this.numero = numerador.numero.map(n => new Numero(n));
            this.numero = new Numero(numerador.numero);

            this.fechaApertura = numerador.fechaApertura;
            this.fechaCierre = numerador.fechaCierre;
        } else {
            this.idCteNumerador = null;
            this.descripcion = null;
            this.numero = new Numero();

            this.fechaApertura = new DateLikePicker();
            this.fechaCierre = new DateLikePicker();
        }
    }
}