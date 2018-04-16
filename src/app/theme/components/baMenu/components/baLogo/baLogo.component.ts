import { Component, Input, Output, EventEmitter } from '@angular/core';
import { LocalStorageService } from '../../../../../services/localStorageService';

@Component({
    selector: 'ba-logo',
    templateUrl: './baLogo.html',
    styleUrls: ['./baLogo.scss']
})
export class BaLogo {

    nombreEmpresa: string;

    constructor(private localStorageService: LocalStorageService) {
        console.log(this.localStorageService.getObject('perfilActivo').sucursal.empresa.nombre);
        this.nombreEmpresa = this.localStorageService.getObject('perfilActivo').sucursal.empresa.nombre;
    }
}
