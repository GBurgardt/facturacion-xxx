import { Component, Input } from '@angular/core';

import { UtilsService } from 'app/services/utilsService';

@Component({
    selector: 'ingreso-form',
    templateUrl: './ingresoForm.html',
    styleUrls: ['./ingresoForm.scss']
})

/**
 * Form reutilizable
 */
export class IngresoForm {
    @Input() titulo = 'test';
    @Input() recurso;


    mock1: ['da','ew','fafas'];

    constructor() { }

}
