import { Component, Input } from '@angular/core';

@Component({
    selector: 'tabla-forma-pago',
    templateUrl: './tablaFormaPago.html',
    styleUrls: ['./tablaFormaPago.scss']
})
    
export class TablaFormaPago {

    test = false;

    @Input() data;

    constructor() {
        this.data = [1,2,3,4,12,3,4,1,2,3,5,12,12]
    }
    
}
