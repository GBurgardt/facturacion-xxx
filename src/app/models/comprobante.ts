import { TipoComprobante } from "./tipoComprobante";
import { Moneda } from "./moneda";
import { DateLikePicker } from "./dateLikePicker";
import { Numerador } from "./numerador";
import { SisLetra } from "./sisLetra";
import { LetraCodigo } from "./letraCodigo";

export class Comprobante {
    tipo: TipoComprobante;
    // letra: string;
    letraCodigo: LetraCodigo;
    moneda: Moneda;
    fechaComprobante: DateLikePicker;
    fechaVto: DateLikePicker;
    observaciones: string;

    numerador: Numerador;

    constructor(comprobante?: {
        tipo: any;
        letraCodigo: any;
        moneda: any;
        fechaComprobante: any;
        fechaVto: any;
        observaciones: string;
        numerador: any;
    }) {
        if (comprobante) {
            this.tipo = new TipoComprobante(comprobante.tipo)
            this.letraCodigo = new LetraCodigo(comprobante.letraCodigo)
            this.moneda = new Moneda(comprobante.moneda)
            this.fechaComprobante = comprobante.fechaComprobante
            this.fechaVto = comprobante.fechaVto
            this.observaciones = comprobante.observaciones
            this.numerador = new Numerador(comprobante.numerador)
        } else {
            this.tipo = null;
            this.letraCodigo = null
            this.moneda = null
            this.fechaComprobante = new DateLikePicker()
            this.fechaVto = new DateLikePicker()
            this.observaciones = null
            this.numerador = new Numerador();
        }
    }

}