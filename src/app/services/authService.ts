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
    * @description Obtiene una lista de usuarios correspondientes a una empresa
    * @argument token
    */
    getUsuariosList(token: string) {
        return this.request(
            [],
            RequestMethod.Get,
            {
                token: token,
            },
            'usuarios',
            {},
            {}
        );
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
    * @description Borrar usuario de la bd
    * @argument token
    * @argument idUsuario
    */
    removeUsuario(usuario: Usuario, token) {
        return this.request(
            [usuario.idUsuario.toString()],
            RequestMethod.Delete,
            {
                token: token
            },
            'usuarios',
            {},
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
    * @description Registra un tipo comprobante
    * @argument tipoComprobante
    * @argument token
    */
    registrarTipoComprobante(tipoComprobante: TipoComprobante, token) {
        return this.request(
            [],
            RequestMethod.Post,
            {
                token: token
            },
            'cteTipo',
            {
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
    * @description Registra un rubro
    * @argument rubro
    * @argument token
    */
    registrarRubro(rubro: Rubro, token) {

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('mock');
            }, 300);
        });

        // return this.request(
        //     [],
        //     RequestMethod.Post,
        //     {
        //         token: token
        //     },
        //     'rubros',
        //     {
        //         codigoComp: tipoComprobante.codigoComp,
        //         descCorta: tipoComprobante.descCorta,
        //         descripcion: tipoComprobante.descripcion,
        //         cursoLegal: tipoComprobante.cursoLegal,
        //         codigoAfip: tipoComprobante.codigoAfip,
        //         surenu: tipoComprobante.surenu,
        //         observaciones: tipoComprobante.observaciones ? tipoComprobante.observaciones : ''
        //     },
        //     {}
        // ).toPromise();
    }

    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////              MÉTODOS REUTILIZABLES          ///////////////////
    ///////////////////////////////////////////////////////////////////////////////////


    /** 
    * @description Obtiene una lista de un recurso especificado
    * @argument token
    * @argument resource Ejemplos: 'cteTipo', 'rubros'
    */
    getResource = (token: string) => (nombreResource: string) => {
        // Si el resource solicitado no está incluido en la lista de recursos disponisbles, retorno un error
        if (!Object.keys(resourcesREST).includes(nombreResource)) {
            return Observable.throw('Recurso inexistente')
        }

        return this.request(
            [],
            RequestMethod.Get,
            {
                token: token,
            },
            nombreResource,
            {},
            {}
        );
    }

    // postResource = (token: string) => (nombreResource: string) => {
    //     return this.request(
    //         [],
    //         RequestMethod.Post,
    //         {
    //             token: token
    //         },
    //         'rubros',
    //         {
    //             codigoComp: tipoComprobante.codigoComp,
    //             descCorta: tipoComprobante.descCorta,
    //             descripcion: tipoComprobante.descripcion,
    //             cursoLegal: tipoComprobante.cursoLegal,
    //             codigoAfip: tipoComprobante.codigoAfip,
    //             surenu: tipoComprobante.surenu,
    //             observaciones: tipoComprobante.observaciones ? tipoComprobante.observaciones : ''
    //         },
    //         {}
    //     ).toPromise();
    // }


}