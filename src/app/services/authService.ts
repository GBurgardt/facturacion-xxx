import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { Headers, Http, Request, RequestOptions, RequestOptionsArgs, RequestMethod } from '@angular/http';
import { Sucursal } from 'app/models/sucursal';
import { Perfil } from 'app/models/perfil';
import { Usuario } from '../models/usuario';

// Libreria para encriptar en MD5 la clave
import * as crypto from 'crypto-js';

// Operadores del observablke. Si no importo esto tira un error.
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/toPromise';
import { TipoComprobante } from '../models/tipoComprobante';
import { resourcesREST } from 'constantes/resoursesREST';
import { Rubro } from 'app/models/rubro';
import { SubRubro } from 'app/models/subRubro';
import { FormaPago } from '../models/formaPago';

@Injectable()
export class AuthService {

    constructor(
        private http: Http
    ) { }

    /**
    * @description Método general para hacer una request
    * @argument pathParams
    * @argument method
    * @argument headers
    * @argument endPoint
    */
    private request(
        pathParams: string[],
        method: RequestMethod,
        headers: any,
        endPoint: string,
        body: any,
        queryParams: any
    ) {

        // Creo los headerss
        let auxHeaders: Headers = new Headers(headers);
        auxHeaders.append('Content-Type', 'application/json');

        // Creo la url
        let url: string;

        // Si tiene pathParams los agrego a la url
        if (pathParams.length > 0) {
            // Creo string con los pathParams (parametros en la url)
            let pathParamString = pathParams.map(param => {
                return param;
            }).join('/');
            url = `${environment.facturacionRest.urlBase}/${endPoint}/${pathParamString}`;
        } else {
            // sin pathParams
            url = `${environment.facturacionRest.urlBase}/${endPoint}`;
        }

        // Creo el string que voy a adjuntar a la url al final, el mismo comienza con un ?
        let queryParamsString = '?';

        // Agrego los parámetors
        Object.keys(queryParams).forEach(keyQuery => {
            queryParamsString = `${queryParamsString}&${keyQuery}=${queryParams[keyQuery]}`;
        });

        // Si se agregó algún parámetro, entonces lo adjunto a la url
        if (queryParamsString != '?') {
            url = `${url}${queryParamsString}`;
        }

        // opciones de consulta
        var opciones: RequestOptionsArgs = {
            url: url,
            method: method,
            search: null,
            headers: auxHeaders,
            body: (Object.keys(body).length === 0 && body.constructor === Object) ? null : JSON.stringify(body)
        };

        var reqOptions = new RequestOptions(opciones);
        var req = new Request(reqOptions);

        return this.http.request(req).timeout(environment.facturacionRest.timeoutDefault).map(res =>
            res.json()
        );
    }

    /**
    * @description Se loguea y genera un token.
    * @argument usuario
    * @argument clave
    */
    login(usuario: string, clave: string) {
        return this.request(
            [usuario],
            RequestMethod.Post,
            {
                clave: crypto.MD5(clave),
                //clave: ' ' + clave
            },
            'usuarios',
            {},
            {}
        ).toPromise();
    }


    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////              MÉTODOS REUTILIZABLES          ///////////////////
    ///////////////////////////////////////////////////////////////////////////////////

    /**
    * @description Obtiene una lista de un recurso especificado
    * @argument token
    * @argument resource Ejemplos: 'cteTipo', 'rubros'
    * @argument queryParams Query params para setearle a la consulta
    */
    getResourceList = (token: string) => (nombreRecurso: string) => (queryParams?) => {
        // Si el resource solicitado no está incluido en la lista de recursos disponisbles, retorno un error
        // if (!Object.keys(resourcesREST)
        //         .map(key => resourcesREST[key])
        //         .includes(nombreRecurso)) {
        //     return Observable.throw('Recurso inexistente')
        // }

        return this.request(
            [],
            RequestMethod.Get,
            {
                token: token,
            },
            nombreRecurso,
            {},
            queryParams ? queryParams : {}
        );
    }

    /**
    * @description Borrar un recurso a partir de us id
    * @argument token
    * @argument idRecurso
    */
    removeRecurso = (idRecurso: any) => (token) => (nombreRecurso) => {

        return this.request(
            [idRecurso.toString()],
            RequestMethod.Delete,
            {
                token: token
            },
            nombreRecurso,
            {},
            {}
        ).toPromise();
    }


    /**
    * @description Registra un recurso cualquiera
    * @argument recurso
    * @argument headers Json que en general tiene el token (en usuario suele tener la clave)
    * @argument nombreRecurso
    */
    registrarRecurso = (recurso: any) => (headers) => (nombreRecurso) => {
        return this.request(
            [],
            RequestMethod.Post,
            headers,
            nombreRecurso,
            this.generarBodyRegistrarRecurso(recurso)(nombreRecurso),
            {}
        ).toPromise();
    }


    /**
    * @description Editar un recurso cualquiera
    * @argument recurso
    * @argument headers
    * @argument nombreRecurso
    */
    editarRecurso = (recurso: any) => (headers) => (nombreRecurso) => {

        return this.request(
            [],
            RequestMethod.Put,
            headers,
            nombreRecurso,
            this.generarBodyEditarRecurso(recurso)(nombreRecurso),
            {}
        ).toPromise();
    }

    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////             MÉTODOS DE SOPORTE              ///////////////////
    ///////////////////////////////////////////////////////////////////////////////////

    /**
     * Genero y retorno el body para enviar a una consulta POST de registrar un recurso
     */
    generarBodyRegistrarRecurso = (recurso: any) => (nombreRecurso) => {
        if (nombreRecurso === resourcesREST.usuarios.nombre) {
            return {
                nombre: recurso.nombre,
                telefono: recurso.telefono,
                perfil: recurso.perfil.idPerfil,
                mail: recurso.email
            }
        }

        if (nombreRecurso === resourcesREST.subRubros.nombre) {
            return {
                idRubro: recurso.rubro.idRubro,
                codigo: recurso.codigoSubRubro,
                descripcion: recurso.descripcion,
            }
        }

        if (nombreRecurso === resourcesREST.rubros.nombre) {
            return {
                codigo: recurso.codigoRubro,
                descripcion: recurso.descripcion
            }
        }

        if (nombreRecurso === resourcesREST.cteTipo.nombre) {
            return {
                codigoComp: recurso.codigoComp,
                descCorta: recurso.descCorta,
                descripcion: recurso.descripcion,
                cursoLegal: recurso.cursoLegal,
                codigoAfip: recurso.codigoAfip,
                surenu: recurso.surenu,
                observaciones: recurso.observaciones ? recurso.observaciones : ''
            }
        }

        if (nombreRecurso === resourcesREST.formaPago.nombre) {
            return {
                tipo: recurso.tipo.idSisFormaPago,
                descripcion: recurso.descripcion
            }
        }

        if (nombreRecurso === resourcesREST.productos.nombre) {
            return {
                codProducto: recurso.codProducto,
                codigoBarra: recurso.codigoBarra,
                descripcionCorta: recurso.descripcionCorta,
                descripcion: recurso.descripcion,
                modeloImputacion: recurso.modeloImputacion,
                aptoCanje: recurso.aptoCanje,
                stock:  recurso.stock,
                trazable: recurso.trazable,
                traReceta: recurso.traReceta,
                traInforma: recurso.traInforma,
                gtin: recurso.gtin,
                puntoPedido: recurso.puntoPedido,
                costoReposicion: recurso.costoReposicion,
                precioVentaProv: recurso.precioVentaProv,
                observaciones: recurso.observaciones,
                idSubRubro: recurso.subRubro.idSubRubro,
                idIva: recurso.IVA.idIVA,
                idUnidadCompra: recurso.unidadCompra.idUnidad,
                idUnidadVenta: recurso.unidadVenta.idUnidad
            }
        }
    }

    /**
     * Genero y retorno el body para enviar a una consulta POST de editar un recurso
     */
    generarBodyEditarRecurso = (recurso: any) => (nombreRecurso) => {
        if (nombreRecurso === resourcesREST.usuarios.nombre) {
            return {
                idUsuario: recurso.idUsuario,
                nombre: recurso.nombre,
                telefono: recurso.telefono,
                perfil: recurso.perfil.idPerfil,
                mail: recurso.email
            }
        }

        if (nombreRecurso === resourcesREST.subRubros.nombre) {
            return {
                idSubRubro: recurso.idSubRubro,
                codigo: recurso.codigoSubRubro,
                descripcion: recurso.descripcion
            }
        }

        if (nombreRecurso === resourcesREST.rubros.nombre) {
            return {
                idRubro: recurso.idRubro,
                codigo: recurso.codigoRubro,
                descripcion: recurso.descripcion
            }
        }

        if (nombreRecurso === resourcesREST.cteTipo.nombre) {
            return {
                idCteTipo: recurso.idCteTipo,
                codigoComp: recurso.codigoComp,
                descCorta: recurso.descCorta,
                descripcion: recurso.descripcion,
                cursoLegal: recurso.cursoLegal,
                codigoAfip: recurso.codigoAfip,
                surenu: recurso.surenu,
                observaciones: recurso.observaciones ? recurso.observaciones : ''
            }
        }

        if (nombreRecurso === resourcesREST.formaPago.nombre) {
            return {
                idFormaPago: recurso.idFormaPago,
                tipo: recurso.tipo.idSisFormaPago,
                descripcion: recurso.descripcion
            }
        }

        if (nombreRecurso === resourcesREST.productos.nombre) {
            return {
                idProducto: recurso.idProductos,
                codProducto: recurso.codProducto,
                codigoBarra: recurso.codigoBarra,
                descripcionCorta: recurso.descripcionCorta,
                descripcion: recurso.descripcion,
                modeloImputacion: recurso.modeloImputacion,
                aptoCanje: recurso.aptoCanje,
                stock:  recurso.stock,
                trazable: recurso.trazable,
                traReceta: recurso.traReceta,
                traInforma: recurso.traInforma,
                gtin: recurso.gtin,
                puntoPedido: recurso.puntoPedido,
                costoReposicion: recurso.costoReposicion,
                precioVentaProv: recurso.precioVentaProv,
                observaciones: recurso.observaciones,
                idSubRubro: recurso.subRubro.idSubRubro,
                idIva: recurso.IVA.idIVA,
                idUnidadCompra: recurso.unidadCompra.idUnidad,
                idUnidadVenta: recurso.unidadVenta.idUnidad
            }
        }
    }

}
