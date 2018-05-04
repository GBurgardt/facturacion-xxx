import { Component, Input, Output, EventEmitter } from '@angular/core';
import { LocalStorageService } from '../../../../../services/localStorageService';
import { environment } from 'environments/environment';

@Component({
    selector: 'ba-logo',
    templateUrl: './baLogo.html',
    styleUrls: ['./baLogo.scss']
})
export class BaLogo {

    dropdownOpen: boolean = false;

    nombreEmpresa: string;

    constructor(
        private localStorageService: LocalStorageService
    ) {
        this.nombreEmpresa = this.localStorageService.getObject(environment.localStorage.perfil).sucursal.empresa.nombre;
    }
}
