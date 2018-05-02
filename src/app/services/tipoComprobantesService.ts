import { Injectable } from '@angular/core';
import { AuthService } from 'app/services/authService';
import { Sucursal } from '../models/sucursal';
import { Perfil } from 'app/models/perfil';
import { Usuario } from '../models/usuario';
import { LocalStorageService } from './localStorageService';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/Observable';
import { TipoComprobante } from '../models/tipoComprobante';
import { resourcesREST } from 'constantes/resoursesREST';

@Injectable()
export class TipoComprobantesService {

    constructor(
        private authService: AuthService,
        private localStorageService: LocalStorageService
    ) { }

    /**
     * Obtiene la lista de tipos de comprobantes
     */
    getTipoComprobantesList = () => {
        const listaTipoComprobantes: Observable<TipoComprobante[]> = this.authService.getResourceList(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        )(
            resourcesREST.cteTipo.nombre
        )().map(listTipoComprobantes => {
            return listTipoComprobantes.arraydatos.map(tipoComprobante => {
                return new TipoComprobante(tipoComprobante);
            })
        });

        return listaTipoComprobantes;
    }

    /**
    * Dado un idTipoComprobante retorno un observable con el tipoComprobante correspondiente
    * @argument idTipoComprobante idTipoComprobante del tipo comprobante
    */
    getTipoComprobanteById = (idTipoComprobante: number) => {
        // Obtengo todos los tiposComprobantes de la empresa actual y busco el TipoComprobante por el idTipoComprobante
        return this.getTipoComprobantesList().map((tiposComprobantesList: TipoComprobante[]) =>
            tiposComprobantesList.find(tipoComprobante => tipoComprobante.idCteTipo === idTipoComprobante)
        );
    }

    /**
     * Edita un tipo de comprobante existente
     */
    editarTipoComprobante = (recurso: TipoComprobante) => {
        return this.authService.editarRecurso(
            recurso
        )(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        )(
            resourcesREST.cteTipo.nombre
        );
    }

    /**
     * Registra un nuevo tipo comp
     */
    registrarTipoComprobante = (recurso: TipoComprobante) => {
        return this.authService.registrarRecurso(
            recurso
        )({
            token: this.localStorageService.getObject(environment.localStorage.acceso).token
        })(
            resourcesREST.cteTipo.nombre
        );
    }

    /**
    * Borra un tipo comprobante
    */
    removeTipoComprobante = (recurso: TipoComprobante) => {
        // return this.authService.removeTipoComprobante(
        //     tipoComprobante,
        //     this.localStorageService.getObject(environment.localStorage.acceso).token
        // );
        return this.authService.removeRecurso(
            recurso.idCteTipo
        )(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        )(
            resourcesREST.cteTipo.nombre
        );
    }

}