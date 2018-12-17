export class PtoVenta {
    idCtePtoVenta: number;
    ptoVenta: any;

    constructor(numero?: {
        idCteNumero: number;
        ptoVenta: any;
    }) {
        if (numero) {
            this.idCtePtoVenta = numero.idCteNumero;
            this.ptoVenta = numero.ptoVenta;
        } else {
            this.idCtePtoVenta = null;
            this.ptoVenta = null;
        }
    }
}