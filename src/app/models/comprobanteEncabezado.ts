import { ComprobanteDetalle } from "./comprobanteDetalle";

export class ComprobanteEncabezado {
    idFactCab: number;
    numero: number;
    idPadron: number;
    nombre: string;
    cuit: string;
    cotDolar: number;
    modulo: string;
    comprobante: string;
    moneda: string;
    imputada: string;
    fechaEmi: string;
    detalle: ComprobanteDetalle[];

    // Desplegable de detalles
    showDetalles: boolean;

    constructor(comprobanteEncabezado?: {
        idFactCab: number;
        numero: number;
        idPadron: number;
        nombre: string;
        cuit: string;
        cotDolar: number;
        modulo: string;
        comprobante: string;
        moneda: string;
        imputada: string;
        fechaEmi: string;
        detalle: any[];
    }) {
        if (comprobanteEncabezado) {
            this.idFactCab = comprobanteEncabezado.idFactCab;
            this.numero = comprobanteEncabezado.numero;
            this.idPadron = comprobanteEncabezado.idPadron;
            this.nombre = comprobanteEncabezado.nombre;
            this.cuit = comprobanteEncabezado.cuit;
            this.cotDolar = comprobanteEncabezado.cotDolar;
            this.modulo = comprobanteEncabezado.modulo;
            this.comprobante = comprobanteEncabezado.comprobante;
            this.moneda = comprobanteEncabezado.moneda;
            this.imputada = comprobanteEncabezado.imputada;
            this.fechaEmi = comprobanteEncabezado.fechaEmi;
            this.detalle = comprobanteEncabezado.detalle.map(det => new ComprobanteDetalle(det));

            this.showDetalles = false;
        } else {
            this.idFactCab = null;
            this.numero = null;
            this.idPadron = null;
            this.nombre = null;
            this.cuit = null;
            this.cotDolar = null;
            this.modulo = null;
            this.comprobante = null;
            this.moneda = null;
            this.imputada = null;
            this.fechaEmi = null;
            this.detalle = null;
            
            this.showDetalles = false;
        }
    }

}