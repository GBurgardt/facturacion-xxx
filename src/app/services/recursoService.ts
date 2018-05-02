import { Injectable } from '@angular/core';
import { AuthService } from 'app/services/authService';

import { LocalStorageService } from './localStorageService';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/Observable';
import { UtilsService } from './utilsService';
import { resourcesREST } from 'constantes/resoursesREST';


import { Usuario } from 'app/models/usuario';
import dynamicClass from 'app/services/dynamicClassService';

@Injectable()
export class RecursoService {

    constructor(
        private authService: AuthService,
        private localStorageService: LocalStorageService,
        private utilsService: UtilsService
    ) { }

    /**
     * Obtiene la lista de un recurso mappeada a su clase
     * @param recursoRest Json con nombre y Clase del modelo a mappear
     */
    getRecursoList = (recursoRest) => (queryParams?) => {
        const lista: Observable<any[]> = this.authService.getResourceList(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        )(
            recursoRest.nombre
        )(queryParams).map(list => {
            return list.arraydatos.map(resource => {
                return new recursoRest.Clase(resource);
            })
        });

        return lista;
    }


    /**
     * Registra en la BD un nuevo recurso
     * @param recurso El recurso a registrar
     * @param headers Opcionalmente se le pueden setear los headers que se quiera
     */
    setRecurso = (recurso: any) => (headers?) => {
        return this.authService.registrarRecurso(
            recurso
        )(
            headers ? headers : {
                token: this.localStorageService.getObject(environment.localStorage.acceso).token
            }
        )(
            this.utilsService.getNameRestOfResource(recurso)
        );
    }

    /**
     * Edita un recurso existente
     * @param recurso El recurso
     * @param headers Opcionalmente se le pueden setear los headers que se quiera
     */
    editarRecurso = (recurso: any) => (headers?) => {
        return this.authService.editarRecurso(
            recurso
        )(
            headers ? headers : {
                token: this.localStorageService.getObject(environment.localStorage.acceso).token
            }
        )(
            this.utilsService.getNameRestOfResource(recurso)
        );
    }

    /**
     * Borra un recurso dado su id
     */
    borrarRecurso = (idRecurso) => (recursoRest) => {
        return this.authService.removeRecurso(
            idRecurso
        )(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        )(
            recursoRest.nombre
        );
    }

    /**
     * Dado un id de un recurso, retorno este recurso
     * @argument idRecurso
     */
    getUsuarioById = (idRecurso: number) => {
        
        return this.getRecursoList(resourcesREST.usuarios)().map((recursoList: Usuario[]) =>
            recursoList.find(usuario => usuario.idUsuario === idRecurso)
        );
    }

}