import { PlanCuenta } from "app/models/planCuenta";

export class DetalleFormaPago {
    idFormaPagoDet: number;
    cantDias: number;
    porcentaje: number;
    detalle: string;
    monto: number;
    observaciones: string;

    formaPagoDescrip: string;

    planCuenta: PlanCuenta;

    constructor(detalleFormaPago?: {
        idFormaPagoDet: number;
        cantDias: number;
        porcentaje: number;
        detalle: string;

        planCuenta: any;
    }) {
        if (detalleFormaPago) {
            this.idFormaPagoDet = detalleFormaPago.idFormaPagoDet;
            this.cantDias = detalleFormaPago.cantDias;
            this.porcentaje = detalleFormaPago.porcentaje;
            this.detalle = detalleFormaPago.detalle

            this.monto = 0;
            this.observaciones = '';
            this.formaPagoDescrip = '';

            this.planCuenta = new PlanCuenta(detalleFormaPago.planCuenta);
        } else {
            this.idFormaPagoDet = null;
            this.cantDias = null;
            this.porcentaje = null;
            this.detalle = null
            this.monto = null;
            this.observaciones = null;
            this.formaPagoDescrip = null;

            this.planCuenta = new PlanCuenta();
        }
    }
}
