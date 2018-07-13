import { Component, Input } from '@angular/core';

@Component({
    selector: 'tabla-forma-pago',
    templateUrl: './tablaFormaPago.html',
    styleUrls: ['./tablaFormaPago.scss']
})
    
export class TablaFormaPago {

    

    @Input() data;

    constructor(
    ) {

    }
    
}
