import { Injectable } from '@angular/core';
import { AuthService } from 'app/services/authService';
import { LocalStorageService } from './localStorageService';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/Observable';
import { resourcesREST } from 'constantes/resoursesREST';
import { SubRubro } from '../models/subRubro';

@Injectable()
export class SubRubrosService {

    constructor(
        private authService: AuthService,
        private localStorageService: LocalStorageService
    ) { }


    getSubRubrosList = () => {
        const lista: Observable<SubRubro[]> = this.authService.getResourceList(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        )(
            resourcesREST.subRubros.nombre
        )().map(list => {
            return list.arraydatos.map(resource => {
                return new SubRubro(resource);
            })
        });

        return lista;
    }

    getSubRubroById = (idSubRubro: number) => {
        return this.getSubRubrosList().map((list: SubRubro[]) =>
            list.find(recurso => recurso.idSubRubro === idSubRubro)
        );
    }

    
    editarSubRubro = (recurso: SubRubro) => {
        return this.authService.editarRecurso(
            recurso
        )(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        )(
            resourcesREST.subRubros.nombre
        );
    }

    registrarSubRubro = (recurso: SubRubro) => {
        return this.authService.registrarRecurso(
            recurso
        )({
            token: this.localStorageService.getObject(environment.localStorage.acceso).token
        })(
            resourcesREST.subRubros.nombre
        );
    }

    removeSubRubro = (recurso: SubRubro) => {
        return this.authService.removeRecurso(
            recurso.idSubRubro
        )(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        )(
            resourcesREST.subRubros.nombre
        );
    }

}