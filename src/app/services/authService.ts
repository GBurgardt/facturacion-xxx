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
            body: JSON.stringify(body)
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
    getPerfilesList(token: string, sucursal: string) {
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
    registrarUsuario(infoNewUser: {
        nombre: string;
        email: string;
        clave: string;
        telefono: string;
        sucursal: Sucursal;
        perfil: Perfil;
    }, token) {
        return this.request(
            [],
            RequestMethod.Post,
            {
                clave: crypto.MD5(infoNewUser.clave),
                //clave: infoNewUser.clave,
                token: token
            },
            'usuarios',
            {
                nombre: infoNewUser.nombre,
                telefono: infoNewUser.telefono,
                perfil: infoNewUser.perfil.idPerfil,
                mail: infoNewUser.email
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
            [],
            RequestMethod.Delete,
            {
                token: token
            },
            'usuarios',
            {
                idUsuario: usuario.idUsuario
            },
            {}
        ).toPromise();
    }

}