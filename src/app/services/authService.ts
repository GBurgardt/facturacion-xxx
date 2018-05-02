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

    /** 
    * @description Obtiene una lista de los perfiles disponibles de una sucursal
    * @argument token
    * @argument sucursal
    */
    getPerfilesList(token: string, sucursal: number) {
        return this.request(
            [],
            RequestMethod.Post,
            {
                token: token
            },
            'perfiles',
            {
                idSucursal: sucursal
            },
            {}
        );
    }

    /**
     * Obtiene una lista de sucursales de la empresa
     * @param token 
     */
    getSucursalesList(token: string) {
        return this.request(
            [],
            RequestMethod.Get,
            {
                token: token
            },
            'sucursales',
            {},
            {}
        );
    }

    /** 
    * @description Obtiene una lista de usuarios correspondientes a una empresa
    * @argument token
    */
    registrarUsuario(usuario: Usuario, token) {
        return this.request(
            [],
            RequestMethod.Post,
            {
                clave: crypto.MD5(usuario.clave),
                token: token
            },
            'usuarios',
            {
                nombre: usuario.nombre,
                telefono: usuario.telefono,
                perfil: usuario.perfil.idPerfil,
                mail: usuario.email
            },
            {}
        ).toPromise();
    }

    /** 
    * @description Edita un usuario
    * @argument token
    * @argument idUsuario
    */
    editarUsuario(usuario: Usuario, token) {
        return this.request(
            [],
            RequestMethod.Put,
            {
                clave: crypto.MD5(usuario.clave),
                //clave: usuario.clave,
                token: token
            },
            'usuarios',
            {
                idUsuario: usuario.idUsuario,
                nombre: usuario.nombre,
                telefono: usuario.telefono,
                perfil: usuario.perfil.idPerfil,
                mail: usuario.email
            },
            {}
        ).toPromise();
    }

    /** 
    * @description Edita un tipo de comprobante
    * @argument token
    * @argument tipoComprobante
    */
    editarTipoComprobante(tipoComprobante: TipoComprobante, token) {
        console.log(tipoComprobante);
        return this.request(
            [],
            RequestMethod.Put,
            {
                token: token
            },
            'cteTipo',
            {
                idCteTipo: tipoComprobante.idCteTipo,
                codigoComp: tipoComprobante.codigoComp,
                descCorta: tipoComprobante.descCorta,
                descripcion: tipoComprobante.descripcion,
                cursoLegal: tipoComprobante.cursoLegal,
                codigoAfip: tipoComprobante.codigoAfip,
                surenu: tipoComprobante.surenu,
                observaciones: tipoComprobante.observaciones ? tipoComprobante.observaciones : ''
            },
            {}
        ).toPromise();
    }


    /** 
     * @description Editar un rubro
     * @argument token
     * @argument rubro
     */
    editarRubro(rubro: Rubro, token) {
        console.log(rubro);
        return this.request(
            [],
            RequestMethod.Put,
            {
                token: token
            },
            'rubros',
            {
                idRubro: rubro.idRubro,
                codigo: rubro.codigoRubro,
                descripcion: rubro.descripcion
            },
            {}
        ).toPromise();
    }

    /** 
      * @description Editar un sub rubro
      * @argument token
      * @argument recurso
      */
    editarSubRubro(recurso: SubRubro, token) {
        console.log(recurso);
        return this.request(
            [],
            RequestMethod.Put,
            {
                token: token
            },
            'subRubros',
            {
                idSubRubro: recurso.idSubRubro,
                codigo: recurso.codigoSubRubro,
                descripcion: recurso.descripcion,
            },
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
    * @argument body Un body para setearle a la consulta
    */
    getResourceList = (token: string) => (nombreRecurso: string) => (body?) => {
        // Si el resource solicitado no está incluido en la lista de recursos disponisbles, retorno un error
        if (!Object.keys(resourcesREST)
                .map(key => resourcesREST[key])
                .includes(nombreRecurso)) {
            return Observable.throw('Recurso inexistente')
        }

        return this.request(
            [],
            RequestMethod.Get,
            {
                token: token,
            },
            nombreRecurso,
            body ? body : {},
            {}
        );
    }

    /** 
    * @description Borrar un recurso
    * @argument token
    * @argument recurso
    */
    removeRecurso = (recurso: any) => (token) => (nombreRecurso) => {
        // Si el resource solicitado no está incluido en la lista de recursos disponisbles, retorno un error
        if (!Object.keys(resourcesREST)
                .map(key => resourcesREST[key])
                .includes(nombreRecurso)) {
            return Observable.throw('Recurso inexistente')
        }
        
        return this.request(
            [this.getIdRecurso(recurso)(nombreRecurso)],
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
    * @argument rubro
    * @argument token
    */
    registrarRecurso = (recurso: any) => (token) => (nombreRecurso) => {
        // Si el resource solicitado no está incluido en la lista de recursos disponisbles, retorno un error
        if (!Object.keys(resourcesREST)
                .map(key => resourcesREST[key])
                .includes(nombreRecurso)) {
            return Observable.throw('Recurso inexistente')
        }

        return this.request(
            [],
            RequestMethod.Post,
            {
                token: token
            },
            nombreRecurso,
            this.generarBodyRegistrarRecurso(recurso)(nombreRecurso),
            {}
        ).toPromise();
    }

    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////             MÉTODOS DE SOPORTE              ///////////////////
    ///////////////////////////////////////////////////////////////////////////////////

    /**
     * Obtengo el idRecurso a paritr del recurso y su nombre
     */
    getIdRecurso = (recurso) => (nombreRecurso) => {
        if (nombreRecurso === resourcesREST.usuarios) {
            return recurso.idUsuario.toString()
        }
        if (nombreRecurso === resourcesREST.cteTipo) {
            return recurso.idCteTipo.toString()
        }
        if (nombreRecurso === resourcesREST.rubros) {
            return recurso.idRubro.toString()
        }
        if (nombreRecurso === resourcesREST.subRubros) {
            return recurso.idSubRubro.toString()
        }
    }

    /**
     * Genero y retorno el body para enviar a una consulta POST de registrar un recurso
     */
    generarBodyRegistrarRecurso = (recurso: any) => (nombreRecurso) => {
        if (nombreRecurso === resourcesREST.subRubros) {
            return {
                idRubro: recurso.rubro.idRubro,
                codigo: recurso.codigoSubRubro,
                descripcion: recurso.descripcion,
            }
        }

        if (nombreRecurso === resourcesREST.rubros) {
            return {
                codigo: recurso.codigoRubro,
                descripcion: recurso.descripcion
            }
        }

        if (nombreRecurso === resourcesREST.cteTipo) {
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

        if (nombreRecurso === resourcesREST.formaPago) {
            return {
                idFormaPago: recurso.idFormaPago,
                tipo: recurso.tipo.idSisFormaPago,
                descripcion: recurso.descripcion
            }
        }

    }


}