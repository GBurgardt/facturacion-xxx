import { Component } from '@angular/core';

@Component({
    selector: 'comprobante-compra',
    styleUrls: ['./comprobanteCompra.scss'],
    templateUrl: './comprobanteCompra.html'
})
export class ComprobanteCompra {
    test: any = {
        proveedor: null,
        nombreProveedor: null,
        cuit: null,
        iva: null,
        cte: null,
        nro: null,
        moneda: null,
        fechaCompra: null,
        fechaVto: null,
        todoPendiente: null
    };

    constructor() { }
}
