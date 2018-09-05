export class Stock {
    ingresos: number;
    egresos: number;
    trazable: boolean;
    rubro: string;
    subRubro: string;

    // Estos son por producto
    comprobante: string;
    numero: number;
    fechaEmision: string;
    pendiente: number;
    deposito: string;
    idFactCab: number;

    // Estos por general
    codProducto: string;
    descripcion: string;

    constructor(stock?: {
        ingresos: number;
        egresos: number;
        trazable: boolean;
        rubro: string;
        subRubro: string;

        comprobante?: string;
        numero?: number;
        fechaEmision?: string;
        pendiente?: number;
        deposito?: string;
        idFactCab?: number;

        codProducto?: string;
        descripcion?: string;
    }) {
        if (stock) {
            this.ingresos = stock.ingresos;
            this.egresos = stock.egresos;
            this.trazable = stock.trazable;
            this.rubro = stock.rubro;
            this.subRubro = stock.subRubro;

            this.comprobante = stock.comprobante;
            this.numero = stock.numero;
            this.fechaEmision = stock.fechaEmision;
            this.pendiente = stock.pendiente;
            this.deposito = stock.deposito;
            this.idFactCab = stock.idFactCab;
            
            this.codProducto = stock.codProducto;
            this.descripcion = stock.descripcion;

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

            this.codProducto = null;
            this.descripcion = null;
        }
    }
}
