import { Injectable } from '@angular/core';
import { AuthService } from 'app/services/authService';
import { LocalStorageService } from './localStorageService';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/Observable';
import { resourcesREST } from 'constantes/resoursesREST';

import { FormaPago } from '../models/formaPago';
import { TipoFormaPago } from '../models/tipoFormaPago';

@Injectable()
export class FormaPagoService {

    constructor(
        private authService: AuthService,
        private localStorageService: LocalStorageService
    ) { }

    
    getList = () => {
        const lista: Observable<FormaPago[]> = this.authService.getResourceList(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        )(
            resourcesREST.formaPago.nombre
        )().map(list => {
            return list.arraydatos.map(resource => {
                return new FormaPago(resource);
            })
        });

        return lista;
    }

    getTiposFormaPagoList = () => {
        return this.authService.getResourceList(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        )(
            resourcesREST.sisFormaPago.nombre
        )().map(list => {
            return list.arraydatos.map(resource => {
                return new TipoFormaPago(resource);
            })
        });
    }

    registrarRecurso = (recurso: FormaPago) => {
        return this.authService.registrarRecurso(
            recurso
        )({
            token: this.localStorageService.getObject(environment.localStorage.acceso).token
        })(
            resourcesREST.formaPago.nombre
        )
    }

    // getSubRubroById = (idSubRubro: number) => {
    //     return this.getSubRubrosList().map((list: SubRubro[]) =>
    //         list.find(recurso => recurso.idSubRubro === idSubRubro)
    //     );
    // }

    
    // editarSubRubro = (recurso: SubRubro) => {
    //     return this.authService.editarSubRubro(
    //         recurso, 
    //         this.localStorageService.getObject(environment.localStorage.acceso).token
    //     );
    // }
    

    // removeSubRubro = (recurso: SubRubro) => {
    //     return this.authService.removeSubRubro(
    //         recurso,
    //         this.localStorageService.getObject(environment.localStorage.acceso).token
    //     );
    // }

}