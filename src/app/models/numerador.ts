import { Numero } from "app/models/numero";
import { DateLikePicker } from "./dateLikePicker";
import { TipoComprobante } from "./tipoComprobante";

export class Numerador {
    idCteNumerador: number;
    descripcion: string;
    fechaApertura: any;
    fechaCierre: any;
    cteTipo: TipoComprobante;
    numero: Numero;

    constructor(numerador?: {
        idCteNumerador: number;
        descripcion: string;
        numero: any;
        fechaApertura: any;
        fechaCierre: any;
        cteTipo: any;
    }) {
        if (numerador) {
            this.idCteNumerador = numerador.idCteNumerador;
            this.descripcion = numerador.descripcion;
            this.numero = new Numero(numerador.numero);
            // this.fechaApertura = numerador.fechaApertura;
            // this.fechaCierre = numerador.fechaCierre;
            this.fechaApertura = new Date(numerador.fechaApertura);
            this.fechaCierre = new Date(numerador.fechaCierre);
            // this.fechaApertura = new DateLikePicker(
            //     new Date(numerador.fechaApertura)
            // );
            // this.fechaCierre = new DateLikePicker(
            //     new Date(numerador.fechaCierre)
            // );
            this.cteTipo = new TipoComprobante(numerador.cteTipo);
        } else {
            this.idCteNumerador = null;
            this.descripcion = null;
            this.numero = new Numero();
            // this.numero = null;
            this.fechaApertura = null;
            this.fechaCierre = null;
            this.cteTipo = new TipoComprobante();
        }
    }
}