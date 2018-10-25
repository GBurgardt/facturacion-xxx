import { TipoComprobante } from "./tipoComprobante";
import { Moneda } from "./moneda";
import { DateLikePicker } from "./dateLikePicker";

export class Comprobante {
    tipo: TipoComprobante;
    puntoVenta: string;
    numero: string;
    letra: string;
    moneda: Moneda;
    fechaComprobante: DateLikePicker;
    fechaVto: DateLikePicker;
    observaciones: string;

    // numero: 

    constructor(comprobante?: {
        tipo: any;
        puntoVenta: string;
        numero: string;
        letra: string;
        moneda: any;
        fechaComprobante: any;
        fechaVto: any;
        observaciones: string;
    }) {
        if (comprobante) {
            this.tipo = new TipoComprobante(comprobante.tipo)
            this.puntoVenta = comprobante.puntoVenta
            this.numero = comprobante.numero
            this.letra = comprobante.letra
            this.moneda = new Moneda(comprobante.moneda)
            this.fechaComprobante = comprobante.fechaComprobante
            // debugger;
            this.fechaVto = comprobante.fechaVto
            this.observaciones = comprobante.observaciones
        } else {
            this.tipo = new TipoComprobante()
            this.puntoVenta = null
            this.numero = null
            this.letra = null
            this.moneda = new Moneda()
            this.fechaComprobante = new DateLikePicker()
            this.fechaVto = new DateLikePicker()
            this.observaciones = null
        }
    }

}