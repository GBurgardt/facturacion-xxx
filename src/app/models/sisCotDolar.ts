import { DateLikePicker } from "./dateLikePicker";

export class SisCotDolar {
    idSisCotDolar: number;
    fechaCotizacion: DateLikePicker;
    cotizacion: number;

    constructor(sisCotDolar?: {
        idSisCotDolar: number;
        fechaCotizacion: Date;
        cotizacion: number;
    }) {
        if (sisCotDolar) {
            this.idSisCotDolar = sisCotDolar.idSisCotDolar;
            this.fechaCotizacion = new DateLikePicker(new Date(sisCotDolar.fechaCotizacion));
            this.cotizacion = sisCotDolar.cotizacion
        } else {
            this.idSisCotDolar = null;
            this.fechaCotizacion = new DateLikePicker(new Date());
            this.cotizacion = null
        }
    }

}