import { DateLikePicker } from "./dateLikePicker";

export class Cotizacion {
    idSisCotDolar: number;
    fechaCotizacion: Date;
    cotizacion: number;

    constructor(cotizacion?: {
        idSisCotDolar: number;
        fechaCotizacion: any;
        cotizacion: number;
    }) {
        if (cotizacion) {
            this.idSisCotDolar = cotizacion.idSisCotDolar
            this.fechaCotizacion = cotizacion.fechaCotizacion
            this.cotizacion = cotizacion.cotizacion
        } else {
            this.idSisCotDolar = null
            this.fechaCotizacion = null
            this.cotizacion = null
        }
    }

}