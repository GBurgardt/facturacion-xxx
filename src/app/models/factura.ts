import { TipoComprobante } from "./tipoComprobante";
import { DateLikePicker } from "app/models/dateLikePicker";

export class Factura {
    tipo: TipoComprobante;
    puntoVenta: number;
    numero: number;
    fechaContable: DateLikePicker;
    fechaVto: DateLikePicker;

    constructor(factura?: {
        tipo: any;
        puntoVenta: number;
        numero: number;
        fechaContable: any;
        fechaVto: any;
    }) {
        if (factura) {
            this.tipo = new TipoComprobante(factura.tipo)
            this.puntoVenta = factura.puntoVenta
            this.numero = factura.numero
            this.fechaContable = factura.fechaContable
            this.fechaVto = factura.fechaVto
        } else {
            this.tipo = new TipoComprobante()
            this.puntoVenta = null
            this.numero = null
            this.fechaContable = null
            this.fechaVto = null
        }
    }

}