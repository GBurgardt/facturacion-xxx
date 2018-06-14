export class ModeloDetalle {
    idModeloDetalle: number;
    ctaContable: number;
    orden: number;
    descripcion: string;
    dh: string;
    prioritario: boolean;

    constructor (modeloDetalle?: {
        idModeloDetalle: number;
        ctaContable: number;
        orden: number;
        descripcion: string;
        dh: string;
        prioritario: boolean;
    }) {
        if (modeloDetalle) {
            this.idModeloDetalle = modeloDetalle.idModeloDetalle;
            this.ctaContable = modeloDetalle.ctaContable;
            this.orden = modeloDetalle.orden;
            this.descripcion = modeloDetalle.descripcion;
            this.dh = modeloDetalle.dh;
            this.prioritario = modeloDetalle.prioritario;
        } else {
            this.idModeloDetalle = null;
            this.ctaContable = null;
            this.orden = null;
            this.descripcion = null;
            this.dh = null;
            this.prioritario = null;
        }
    }

}