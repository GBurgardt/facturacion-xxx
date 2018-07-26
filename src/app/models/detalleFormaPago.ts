export class DetalleFormaPago {
    idFormaPagoDet: number;
    cantDias: number;
    porcentaje: number;
    detalle: string;
    monto: number;
    observaciones: string;

    constructor(detalleFormaPago?: {
        idFormaPagoDet: number;
        cantDias: number;
        porcentaje: number;
        detalle: string
    }) {
        if (detalleFormaPago) {
            this.idFormaPagoDet = detalleFormaPago.idFormaPagoDet;
            this.cantDias = detalleFormaPago.cantDias;
            this.porcentaje = detalleFormaPago.porcentaje;
            this.detalle = detalleFormaPago.detalle

            this.monto = 0;
            this.observaciones = '';
        } else {
            this.idFormaPagoDet = null;
            this.cantDias = null;
            this.porcentaje = null;
            this.detalle = null
            this.monto = null;
            this.observaciones = null;
        }
    }
}