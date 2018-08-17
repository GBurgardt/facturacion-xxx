export class Numero {
    idCteNumero: number;
    ptoVenta: number;
    numero: number

    constructor(numero?: {
        idCteNumero: number;
        ptoVenta: number;
        numero: number
    }) {
        if (numero) {
            this.idCteNumero = numero.idCteNumero;
            this.ptoVenta = numero.ptoVenta;
            this.numero = numero.numero
        } else {
            this.idCteNumero = null;
            this.ptoVenta = null;
            this.numero = null
        }
    }
}