import { TipoComprobante } from "./tipoComprobante";

export class ComprobanteRelacionado {
    tipo: TipoComprobante;
    puntoVenta: number;
    numero: number;
    todosLosPendientes: boolean;

    constructor(comprobanteRelacionado?: {
        tipo: any;
        puntoVenta: number;
        numero: number;
        todosLosPendientes: boolean;
    }) {
        if (comprobanteRelacionado) {
            this.tipo = new TipoComprobante(comprobanteRelacionado.tipo)
            this.puntoVenta = comprobanteRelacionado.puntoVenta
            this.numero = comprobanteRelacionado.numero
            this.todosLosPendientes = comprobanteRelacionado.todosLosPendientes
        } else {
            this.tipo = new TipoComprobante()
            this.puntoVenta = null
            this.numero = null
            this.todosLosPendientes = null
        }
    }

}