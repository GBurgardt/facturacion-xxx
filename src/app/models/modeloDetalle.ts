import { SisTipoModelo } from "./sisTipoModelo";

export class ModeloDetalle {
    idModeloDetalle: number;
    ctaContable: number;
    orden: number;
    descripcion: string;
    dh: string;
    prioritario: boolean;

    operador: string;
    valor: number;
    idSisTipoModelo: number;

    constructor (modeloDetalle?: {
        idModeloDetalle: number;
        ctaContable: number;
        orden: number;
        descripcion: string;
        dh: string;
        prioritario: boolean;

        operador: string;
        valor: number;
        tipoModelo: any;
    }) {
        if (modeloDetalle) {
            this.idModeloDetalle = modeloDetalle.idModeloDetalle;
            this.ctaContable = modeloDetalle.ctaContable;
            this.orden = modeloDetalle.orden;
            this.descripcion = modeloDetalle.descripcion;
            this.dh = modeloDetalle.dh;
            this.prioritario = modeloDetalle.prioritario;

            this.operador = modeloDetalle.operador ? modeloDetalle.operador : null;
            this.valor = modeloDetalle.valor ? modeloDetalle.valor : null;
            this.idSisTipoModelo = modeloDetalle.tipoModelo ? modeloDetalle.tipoModelo.idTipoModelo : null;
        } else {
            this.idModeloDetalle = null;
            this.ctaContable = null;
            this.orden = null;
            this.descripcion = null;
            this.dh = null;
            this.prioritario = null;

            this.operador = null;
            this.valor = null;
            this.idSisTipoModelo = null;
        }
    }

}
