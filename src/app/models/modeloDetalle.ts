import { SisTipoModelo } from "./sisTipoModelo";
import { PlanCuenta } from "./planCuenta";

export class ModeloDetalle {
    idModeloDetalle: number;
    ctaContable: string;
    orden: number;
    descripcion: string;
    dh: string;
    prioritario: boolean;

    operador: string;
    valor: number;
    idSisTipoModelo: number;

    planCuenta: PlanCuenta;

    constructor (modeloDetalle?: {
        idModeloDetalle: number;
        ctaContable: string;
        orden: number;
        descripcion: string;
        dh: string;
        prioritario: boolean;

        operador: string;
        valor: number;
        tipoModelo: any;
        planCuenta: any;
    }) {
        if (modeloDetalle) {
            this.idModeloDetalle = modeloDetalle.idModeloDetalle;
            this.orden = modeloDetalle.orden;
            this.descripcion = modeloDetalle.descripcion;
            this.dh = modeloDetalle.dh;
            this.prioritario = modeloDetalle.prioritario;

            this.operador = modeloDetalle.operador ? modeloDetalle.operador : null;
            this.valor = modeloDetalle.valor ? modeloDetalle.valor : 0;
            this.idSisTipoModelo = modeloDetalle.tipoModelo ? modeloDetalle.tipoModelo.idTipoModelo : null;
            this.ctaContable = modeloDetalle.ctaContable;
            this.planCuenta = new PlanCuenta(modeloDetalle.planCuenta);
        } else {
            this.idModeloDetalle = null;
            this.ctaContable = null;
            this.orden = null;
            this.descripcion = null;
            this.dh = null;
            this.prioritario = null;

            this.operador = null;
            this.valor = 0;
            this.idSisTipoModelo = null;
            this.planCuenta = new PlanCuenta();
        }
    }

}
