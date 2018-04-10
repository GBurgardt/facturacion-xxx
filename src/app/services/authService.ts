import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { Headers, Http, Request, RequestOptions, RequestOptionsArgs, RequestMethod } from '@angular/http';

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
        method: string,
        headers: any,
        endPoint: string,
        body: any,
        queryParams: any
    ) {
        if (method !== 'GET' && method !== 'POST') {
            return Observable.throw('Error en el method');
        };

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
            method: method === 'GET' ? RequestMethod.Get : RequestMethod.Post,
            search: null,
            headers: auxHeaders,
            body: JSON.stringify(body)
        };

        var reqOptions = new RequestOptions(opciones);
        var req = new Request(reqOptions);

        return this.http.request(req).timeout(environment.facturacionRest.timeoutDefault).map(res => {
            return res.json();
        });
    }

    /** 
    * @description Se loguea y genera un token.
    * @argument usuario
    * @argument clave
    */
    login(usuario: string, clave: string) {
        return this.request(
            [usuario],
            'POST',
            {
                clave: ' ' + clave,
            },
            'usuarios',
            {},
            {}
        ).toPromise();
    }

}