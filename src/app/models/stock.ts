export class Stock {
    comprobante: string;
    numero: number;
    fechaEmision: string;
    ingresos: number;
    egresos: number;
    pendiente: number;
    deposito: string;
    trazable: boolean;
    rubro: string;
    subRubro: string;
    idFactCab: number;

    constructor(stock?: {
        comprobante: string;
        numero: number;
        fechaEmision: string;
        ingresos: number;
        egresos: number;
        pendiente: number;
        deposito: string;
        trazable: boolean;
        rubro: string;
        subRubro: string;
        idFactCab: number;
    }) {
        if (stock) {
            this.comprobante = stock.comprobante;
            this.numero = stock.numero;
            this.fechaEmision = stock.fechaEmision;
            this.ingresos = stock.ingresos;
            this.egresos = stock.egresos;
            this.pendiente = stock.pendiente;
            this.deposito = stock.deposito;
            this.trazable = stock.trazable;
            this.rubro = stock.rubro;
            this.subRubro = stock.subRubro;
            this.idFactCab = stock.idFactCab;
        } else {
            this.comprobante = null;
            this.numero = null;
            this.fechaEmision = null;
            this.ingresos = null;
            this.egresos = null;
            this.pendiente = null;
            this.deposito = null;
            this.trazable = null;
            this.rubro = null;
            this.subRubro = null;
            this.idFactCab = null;
        }
    }
}
