import { TipoComprobante } from "./tipoComprobante";

export class CteFechas {
    idCteFechas: number;
    puntoVenta: number;
    fechaApertura: Date;
    fechaCierre: Date;
    cteTipo: TipoComprobante;

    constructor(cteFechas?: {
        idCteFechas: number;
        idCteTipo: number;
        puntoVenta: number;
        fechaApertura: Date;
        fechaCierre: Date;
        cteTipo: any;
    }) {
        if (cteFechas) {
            this.idCteFechas = cteFechas.idCteFechas;
            this.puntoVenta = cteFechas.puntoVenta;
            this.fechaApertura = new Date(cteFechas.fechaApertura);
            this.fechaCierre = new Date(cteFechas.fechaCierre);
            this.cteTipo = new TipoComprobante(cteFechas.cteTipo);
        } else {
            this.idCteFechas = null;
            this.puntoVenta = null;
            this.fechaApertura = null;
            this.fechaCierre = null;
            this.cteTipo = new TipoComprobante();
        }
    }

}