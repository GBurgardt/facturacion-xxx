export class ProductoPendiente {
    comprobante: string;
    numero: string;
    codProducto: string;
    original: number;
    pendiente: number;
    articulo: string;
    precio: number;
    dolar: number;
    moneda: string;
    porCalc: number;
    ivaPorc: number;
    deposito: number;
    trazable: boolean;
    rubro: string;
    subRubro: string;

    constructor(productoPendiente?: {
        comprobante: string;
        numero: string;
        codProducto: string;
        original: number;
        pendiente: number;
        articulo: string;
        precio: number;
        dolar: number;
        moneda: string;
        porCalc: number;
        ivaPorc: number;
        deposito: number;
        trazable: boolean;
        rubro: string;
        subRubro: string;
    }) {
        if (productoPendiente) {
            this.comprobante = productoPendiente.comprobante
            this.numero = productoPendiente.numero
            this.codProducto = productoPendiente.codProducto
            this.original = productoPendiente.original
            this.pendiente = productoPendiente.pendiente
            this.articulo = productoPendiente.articulo
            this.precio = productoPendiente.precio
            this.dolar = productoPendiente.dolar
            this.moneda = productoPendiente.moneda
            this.porCalc = productoPendiente.porCalc
            this.ivaPorc = productoPendiente.ivaPorc
            this.deposito = productoPendiente.deposito
            this.trazable = productoPendiente.trazable
            this.rubro = productoPendiente.rubro
            this.subRubro = productoPendiente.subRubro
        } else {
            this.comprobante = null
            this.numero = null
            this.codProducto = null
            this.original = null
            this.pendiente = null
            this.articulo = null
            this.precio = null
            this.dolar = null
            this.moneda = null
            this.porCalc = null
            this.ivaPorc = null
            this.deposito = null
            this.trazable = null
            this.rubro = null
            this.subRubro = null
        }
    }

}