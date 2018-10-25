import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { AuthService } from 'app/services/authService';

import { LocalStorageService } from './localStorageService';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/Observable';
import { UtilsService } from './utilsService';
import { resourcesREST } from 'constantes/resoursesREST';

import dynamicClass from 'app/services/dynamicClassService';
import { FiltroListaPrecios } from '../models/filtroListaPrecio';
import { DetalleProducto } from '../models/detalleProducto';
import { BehaviorSubject } from '../../../node_modules/rxjs';
import { ProductoPendiente } from 'app/models/productoPendiente';

@Injectable()
export class RecursoService {

    private edicionFinalizada: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    
    constructor(
        private authService: AuthService,
        private localStorageService: LocalStorageService,
        private utilsService: UtilsService
    ) {
        // Inicializo en false cada vez que ingresa
        // this.edicionFinalizada.next(false);
    }
    
    /**
     * Cambia el estado de la edicion finalizada
     */
    setEdicionFinalizada = (val) => this.edicionFinalizada.next(val);

    /**
     * Retorna el valor de la edicion, si finalizó o no para este recurso
     */
    getEdicionFinalizada = () => this.edicionFinalizada.value

    /**
     * Obtiene la lista de un recurso mappeada a su clase
     * @param recursoRest Json con nombre y Clase del modelo a mappear
     * @param queryOrPathParams? Si es un array, son path. Si es un Objecto, son querys
     */
    getRecursoList = (recursoRest) => (queryOrPathParams?) => {
        // Si es un object (json), es queryParam, sino es pathParam
        const tipoParam = Array.isArray(queryOrPathParams) ? 'path' : 'query';

        const lista: Observable<any[]> = this.authService.getResourceList(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        )(
            recursoRest.nombre
        )(queryOrPathParams)(tipoParam).map(list => {
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
    setRecurso = (recurso: any) => (headers?) => 
        this.authService.registrarRecurso(
            recurso
        )(
            headers ? headers : {
                token: this.localStorageService.getObject(environment.localStorage.acceso).token
            }
        )(
            this.utilsService.getNameRestOfResource(recurso)
        );
    

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
        )
        // .then(() => this.toggleEdicionFinalizada()) // Finaliza la edición
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


    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////                CASOS PARTICULARES           ///////////////////
    ///////////////////////////////////////////////////////////////////////////////////

    /**
     * Obtengo una lista de productos filtrada
     */
    getProductosByFiltro = (filtros: FiltroListaPrecios) => {
        return this.authService.getProductosByFiltro(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        )(filtros)
            .map(respuesta => respuesta.arraydatos.map(detalleProd => new DetalleProducto(detalleProd)) )
            .catch(err => {
                // Si hay algun error muestro el mensaje
                this.utilsService.decodeErrorResponse(err);
                return Observable.throw(err)
            });
    }

    getProximoCodigoProducto = () => this.authService
        .getProximoCodigoProducto(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        )
        .map(resp => resp.datos.proximoCodigo)

    /**
     * Checkea si edito un recurso
     */
    checkIfEquals = (recurso, recursoOriginal) => {
        const t1 = Object.assign({}, recurso)
        const t2 = Object.assign({}, recursoOriginal)
        debugger
        return _.isEqual(
            Object.assign({}, recurso),
            Object.assign({}, recursoOriginal)
        )
    }


    

}
