import { TipoComprobante } from "./tipoComprobante";
import { Moneda } from "./moneda";
import { DateLikePicker } from "./dateLikePicker";
import { Numerador } from "./numerador";

export class Comprobante {
    tipo: TipoComprobante;
    // puntoVenta: string;
    // numero: string;
    letra: string;
    moneda: Moneda;
    fechaComprobante: DateLikePicker;
    fechaVto: DateLikePicker;
    observaciones: string;

    numerador: Numerador;

    constructor(comprobante?: {
        tipo: any;
        // puntoVenta: string;
        // numero: string;
        letra: string;
        moneda: any;
        fechaComprobante: any;
        fechaVto: any;
        observaciones: string;
        numerador: any;
    }) {
        if (comprobante) {
            this.tipo = new TipoComprobante(comprobante.tipo)
            // this.puntoVenta = comprobante.puntoVenta
            // this.numero = comprobante.numero
            this.letra = comprobante.letra
            this.moneda = new Moneda(comprobante.moneda)
            this.fechaComprobante = comprobante.fechaComprobante
            // debugger;
            this.fechaVto = comprobante.fechaVto
            this.observaciones = comprobante.observaciones
            this.numerador = new Numerador(comprobante.numerador)
        } else {
            // this.tipo = new TipoComprobante()
            this.tipo = null;
            // this.puntoVenta = null
            // this.numero = null
            this.letra = null
            // this.moneda = new Moneda()
            this.moneda = null
            this.fechaComprobante = new DateLikePicker()
            this.fechaVto = new DateLikePicker()
            this.observaciones = null
            this.numerador = new Numerador();
            // this.numerador = null;
        }
    }

}