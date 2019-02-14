export class PtoVenta {
    idPtoVenta: number;
    ptoVenta: any;

    constructor(numero?: {
        idPtoVenta: number;
        ptoVenta: any;
    }) {
        if (numero) {
            this.idPtoVenta = numero.idPtoVenta;
            this.ptoVenta = numero.ptoVenta;
        } else {
            this.idPtoVenta = null;
            this.ptoVenta = null;
        }
    }
}