import { TipoComprobante } from "./tipoComprobante";
import { DateLikePicker } from "app/models/dateLikePicker";

export class Factura {
    tipo: TipoComprobante;
    preNumero: number;
    numero: number;
    fechaContable: DateLikePicker;
    fechaVto: DateLikePicker;

    constructor(factura?: {
        tipo: any;
        preNumero: number;
        numero: number;
        fechaContable: any;
        fechaVto: any;
    }) {
        if (factura) {
            this.tipo = new TipoComprobante(factura.tipo)
            this.preNumero = factura.preNumero
            this.numero = factura.numero
            this.fechaContable = factura.fechaContable
            this.fechaVto = factura.fechaVto
        } else {
            this.tipo = new TipoComprobante()
            this.preNumero = null
            this.numero = null
            this.fechaContable = null
            this.fechaVto = null
        }
    }

}