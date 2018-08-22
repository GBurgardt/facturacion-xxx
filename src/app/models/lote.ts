import { DateLikePicker } from "./dateLikePicker";

export class Lote {
    nroLote: string;
    item: number;
    serie: string;
    fechaElab: DateLikePicker;
    fechaVto: DateLikePicker;
    vigencia: boolean;
    codProducto: string;
    descripcionProd: string;
    stock: number;
    ingresos: number;
    egresos: number;

    cantidad: number;
    numero: number;
    comprobante: string;

    constructor(lote?: {
        nroLote: string;
        item: number;
        serie: string;
        fechaElab: any;
        fechaVto: any;
        vigencia: boolean;
        codProducto: string;
        descripcionProd: string;
        stock: number;
        ingresos: number;
        egresos: number;

        cantidad: number;
        numero: number;
        comprobante: string;
    }) {
        if (lote) {
            this.nroLote = lote.nroLote;
            this.item = lote.item;
            this.serie = lote.serie;
            this.fechaElab = new DateLikePicker(new Date(lote.fechaElab));
            this.fechaVto = new DateLikePicker(new Date(lote.fechaVto));
            this.vigencia = lote.vigencia;
            this.codProducto = lote.codProducto;
            this.descripcionProd = lote.descripcionProd;
            this.stock = lote.stock;
            this.ingresos = lote.ingresos;
            this.egresos = lote.egresos
            
            this.cantidad = lote.cantidad;
            this.numero = lote.numero;
            this.comprobante = lote.comprobante;

        } else {
            this.nroLote = null;
            this.item = null;
            this.serie = null;
            this.fechaElab = null;
            this.fechaVto = null;
            this.vigencia = null;
            this.codProducto = null;
            this.descripcionProd = null;
            this.stock = null;
            this.ingresos = null;
            this.egresos = null;

                        
            this.cantidad = null;
            this.numero = null;
            this.comprobante = null;
        }
    }
}