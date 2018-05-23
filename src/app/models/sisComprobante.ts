export class SisComprobante {
    idSisComprobantes: number;
    descripcion: string;
    modulo: string;
    imputacion: string;

    constructor(sisComprobante?: {
        idSisComprobantes: number;
        descripcion: string;
        modulo: string;
        imputacion: string;
    }) {
        if (sisComprobante) {
            this.idSisComprobantes = sisComprobante.idSisComprobantes
            this.descripcion = sisComprobante.descripcion
            this.modulo = sisComprobante.modulo
            this.imputacion = sisComprobante.imputacion
        } else {
            this.idSisComprobantes = null
            this.descripcion = null
            this.modulo = null
            this.imputacion = null
        }
    }

}
