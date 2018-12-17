
import { DateLikePicker } from "./dateLikePicker";
import { TipoComprobante } from "./tipoComprobante";
import { PtoVenta } from "./ptoVenta";

export class Numerador {
    idCteNumerador: number;
    descripcion: string;
    fechaApertura: any;
    fechaCierre: any;
    ptoVenta: PtoVenta;
    numerador: number;

    auxNumero: string;

    constructor(numerador?: {
        idCteNumerador: number;
        descripcion: string;
        ptoVenta: any;
        fechaApertura: any;
        fechaCierre: any;
        numerador: number;
    }) {
        if (numerador) {
            this.idCteNumerador = numerador.idCteNumerador;
            this.descripcion = numerador.descripcion;
            this.ptoVenta = new PtoVenta(numerador.ptoVenta);
            this.fechaApertura = new Date(numerador.fechaApertura);
            this.fechaCierre = new Date(numerador.fechaCierre);
            this.numerador = numerador.numerador;
            this.auxNumero = `${this.ptoVenta.ptoVenta.toString().padStart(4, '0')}-${this.numerador.toString().padStart(8, '0')}`
        } else {
            this.idCteNumerador = null;
            this.descripcion = null;
            this.ptoVenta = new PtoVenta();
            this.fechaApertura = null;
            this.fechaCierre = null;
            this.numerador = null;
            this.auxNumero = null;
        }
    }
}