
import { DateLikePicker } from "./dateLikePicker";
import { TipoComprobante } from "./tipoComprobante";
import { PtoVenta } from "./ptoVenta";
import { LetraCodigo } from "./letraCodigo";

export class Numerador {
    idCteNumerador: number;
    descripcion: string;
    fechaApertura: DateLikePicker;
    fechaCierre: DateLikePicker;
    ptoVenta: PtoVenta;
    // numerador: number;
    numerador: string;
    letrasCodigos: LetraCodigo;
    auxNumero: string;
    
    constructor(numerador?: {
        idCteNumerador: number;
        descripcion: string;
        ptoVenta: any;
        fechaApertura: any;
        fechaCierre: any;
        numerador: string;
        letrasCodigos: any;
    }) {
        if (numerador) {
            this.idCteNumerador = numerador.idCteNumerador;
            this.descripcion = numerador.descripcion;
            this.ptoVenta = new PtoVenta(numerador.ptoVenta);
            this.fechaApertura = new DateLikePicker(new Date(numerador.fechaApertura));
            this.fechaCierre = new DateLikePicker(new Date(numerador.fechaCierre));
            this.numerador = numerador.numerador;
            this.letrasCodigos = new LetraCodigo(numerador.letrasCodigos)
            this.auxNumero = `${this.ptoVenta.ptoVenta.toString().padStart(4, '0')}-${this.numerador.toString().padStart(8, '0')}`;
        } else {
            this.idCteNumerador = null;
            this.descripcion = null;
            this.ptoVenta = null;
            this.fechaApertura = null;
            this.fechaCierre = null;
            this.numerador = null;
            this.letrasCodigos = null;
            this.auxNumero = null;
        }
    }
}