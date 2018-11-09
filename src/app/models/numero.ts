export class Numero {
    idCteNumero: number;
    ptoVenta: any;
    numero: any;

    // Concateno y lo uso cmo auxiliar
    auxNumero: string;

    constructor(numero?: {
        idCteNumero: number;
        ptoVenta: any;
        numero: any
    }) {
        if (numero) {
            this.idCteNumero = numero.idCteNumero;
            this.ptoVenta = numero.ptoVenta;
            this.numero = numero.numero;

            this.auxNumero = `${this.ptoVenta.toString().padStart(4, '0')}-${this.numero.toString().padStart(8, '0')}`
        } else {
            this.idCteNumero = null;
            this.ptoVenta = null;
            this.numero = null

            this.auxNumero = '';
        }
    }
}