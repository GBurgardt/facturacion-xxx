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
import { FiltroListaPrecios } from '../models/filtroListaPrecio';
import { DetalleProducto } from '../models/detalleProducto';
import { Padron } from '../models/padron';
import { ProductoBuscaModelo } from 'app/models/productoBuscaModelo';

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
    login = (usuario: string) => (clave: string) => {
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
    * @description Obtiene una lista de productos filtrados
    * @argument token
    * @argument filtros Lo filtro
    */
    getProductosByFiltro = (token: string)  => (filtros: FiltroListaPrecios) => {

        return this.request(
            [],
            RequestMethod.Post,
            {
                token: token,
            },
            resourcesREST.filtroListaPrecios.nombre,
            {
                codProdDesde: filtros.codProdDesde !== '' ? filtros.codProdDesde : null,
                codProdHasta: filtros.codProdHasta !== '' ? filtros.codProdHasta : null,
                codProvedor: filtros.codProvedor,
                rubro: filtros.rubro.idRubro,
                subRubro: filtros.subRubro.idSubRubro,
                porcentajeCabecera: filtros.porcentajeCabecera,
                porcentajeInf: filtros.porcentajeInf,
                porcentajeSup: filtros.porcentajeSup
            },
            {}
        );
    }

    /**
    * @description Obtiene productos pendientes
    * @argument token
    * @argument filtros Lo filtro
    */
    getProductosPendientes = (token: string) => (proveedor: Padron) => (comprobanteRelacionado: {
        tipo: TipoComprobante,
        numero: number,
        todosLosPendientes: boolean
    }) => {
        return this.request(
            [],
            RequestMethod.Post,
            {
                token: token,
            },
            resourcesREST.buscarPendientes.nombre,
            {
                cteTipo : comprobanteRelacionado.tipo.idCteTipo,
                facNumero : comprobanteRelacionado.todosLosPendientes ? 0 : comprobanteRelacionado.numero,
                codigoProv : Number(proveedor.padronCodigo),
                pendiente : comprobanteRelacionado.todosLosPendientes ? 1 : 0,
                idProducto : 0,
                idDeposito : 0,
                despacho : ""
            },
            {}
        );
    }

    /**
     * Devulete la cotizacion
     */
    getCotizacion = (token) => {
        return this.request(
            [],
            RequestMethod.Get,
            {
                token: token,
            },
            resourcesREST.buscaCotizacion.nombre,
            {},
            {}
        );
    }

    /**
     * Busca los modelos de la tab facutracion
     */
    buscaModelos = (token) => (productos: ProductoBuscaModelo[] ) => {
        return this.request(
            [],
            RequestMethod.Post,
            {
                token: token,
            },
            resourcesREST.buscaModelo.nombre,
            {
                productos: productos
            },
            {}
        );
    }

    /**
     * 
     */
    grabaComprobante =  (token) => 
                        (productos: ProductoBuscaModelo[] ) => {
        return this.request(
            [],
            RequestMethod.Post,
            {
                token: token,
            },
            'grabaComprobante',
            {
                idCteTipo: 34,
                letra: "D",
                numero: 457896541236,
                fechaEmision: "2018-06-21",
                fechaVencimiento: "2018-08-21",
                fechaConta: "2018-06-21",
                cai: "789RS789",
                caiVto: "2018-08-21",
                codBarra: "123456789456",
                idPadron: 12345,
                idFormaPago: 5,
                productoCanje: " ",
                precioReferenciaCanje: 0,
                interesCanje: 0,
                idMoneda: 1,
                nombre: "FabricaTest",
                cuit: "20-38571446-8",
                sisSitIva: "RI",
                codigoPostal: "2000",
                listaPrecio: " ",
                cotDolar: 28.1,
                fechaDolar: "2018-04-18",
                observaciones: "test",
                idModeloCab: null,
                relComprobante: null,
                relPuntoVenta: null,
                relNumero: null,
                idFactCab: 1,
                factCabecera: true,
                factDet: true,
                factFormaPago: true,
                factImputa: true,
                factPie: true,
                produmo: true,
                grillaArticulos: [
                    {
                        idProducto: 3,
                        articulo: "LecheLS",
                        pendiente: 482.6,
                        precio: 900,
                        porCalc: 1.3,
                        descuento: "Test",
                        ivaPorc: 0.25,
                        cantidadBulto: 15,
                        despacho: "despacho",
                        trazable: true,
                        idDeposito: 3,
                        observacionDetalle: "obs",
                        imputacion: "Imputa",
                        idFactCabImputa: 1,
                        itemImputada: 1
                    },
                    {
                        idProducto: 4,
                        articulo: "Lavand-A",
                        pendiente: 555.6,
                        precio: 900987,
                        porCalc: 1.36,
                        descuento: "Test2",
                        ivaPorc: 0.26,
                        cantidadBulto: 15,
                        despacho: "despacho",
                        trazable: true,
                        idDeposito: 3,
                        observacionDetalle: "obs",
                        imputacion: "Imputa",
                        idFactCabImputa: 1,
                        itemImputada: 1
                    }
                ]
            },
            {}
        );
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
                observaciones: recurso.observaciones ? recurso.observaciones : '',
                idSisComprobante: recurso.comprobante.idSisComprobantes
            }
        }

        if (nombreRecurso === resourcesREST.formaPago.nombre) {
            return {
                tipo: recurso.tipo.idSisFormaPago,
                descripcion: recurso.descripcion,
                idListaPrecio: recurso.listaPrecio.idListaPrecio
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

        if (nombreRecurso === resourcesREST.depositos.nombre) {
            return {
                codigoDep: recurso.codigoDep,
                descripcion: recurso.descripcion,
                domicilio: recurso.domicilio,
                codigoPostal: recurso.codigoPostal,
            }
        }

        if (nombreRecurso === resourcesREST.listaPrecios.nombre) {
            return {
                codLista: recurso.codigoLista,
                // fechaAlta: this.utilsService.dateToString(recurso.fechaAlta),
                // vigenciaDesde: this.utilsService.dateToString(recurso.vigenciaDesde),
                // vigenciaHasta: this.utilsService.dateToString(recurso.vigenciaHasta),
                fechaAlta: `${recurso.fechaAlta.year}-${recurso.fechaAlta.month}-${recurso.fechaAlta.day}`,
                vigenciaDesde: `${recurso.vigenciaDesde.year}-${recurso.vigenciaDesde.month}-${recurso.vigenciaDesde.day}`,
                vigenciaHasta: `${recurso.vigenciaHasta.year}-${recurso.vigenciaHasta.month}-${recurso.vigenciaHasta.day}`,
                activa: recurso.activa,
                idPadronCliente: recurso.idPadronCliente,
                idPadronRepresentante: recurso.idPadronRepresentante,
                porc1: recurso.porc1,
                condiciones: recurso.condiciones,
                idMoneda: recurso.idMoneda.idMoneda,
                preciosDet: recurso.listaPrecioDetCollection.map((detalle: DetalleProducto) => {
                    return {
                        precio: detalle.precio,
                        cotaInf: detalle.cotaInf,
                        cotaSup: detalle.cotaSup,
                        observaciones: detalle.observaciones ? detalle.observaciones : null,
                        idProducto: detalle.producto.idProductos
                    }
                })
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
                observaciones: recurso.observaciones ? recurso.observaciones : '',
                idSisComprobante: recurso.comprobante.idSisComprobantes
            }
        }

        if (nombreRecurso === resourcesREST.formaPago.nombre) {
            return {
                idFormaPago: recurso.idFormaPago,
                tipo: recurso.tipo.idSisFormaPago,
                descripcion: recurso.descripcion,
                idListaPrecio: recurso.listaPrecio.idListaPrecio
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

        if (nombreRecurso === resourcesREST.depositos.nombre) {
            return {
                idDeposito: recurso.idDeposito,
                codigoDep: recurso.codigoDep,
                descripcion: recurso.descripcion,
                domicilio: recurso.domicilio,
                codigoPostal: recurso.codigoPostal,
            }
        }

        if (nombreRecurso === resourcesREST.listaPrecios.nombre) {
            return {
                idLista: recurso.idListaPrecio,
                fechaAlta: `${recurso.fechaAlta.year}-${recurso.fechaAlta.month}-${recurso.fechaAlta.day}`,
                vigenciaDesde: `${recurso.vigenciaDesde.year}-${recurso.vigenciaDesde.month}-${recurso.vigenciaDesde.day}`,
                vigenciaHasta: `${recurso.vigenciaHasta.year}-${recurso.vigenciaHasta.month}-${recurso.vigenciaHasta.day}`,
                condiciones: recurso.condiciones,
                preciosDet: recurso.listaPrecioDetCollection.map((detalle: DetalleProducto) => {
                    return {
                        precio: detalle.precio,
                        cotaInf: detalle.cotaInf,
                        cotaSup: detalle.cotaSup,
                        observaciones: detalle.observaciones ? detalle.observaciones : null,
                        idProducto: detalle.producto.idProductos
                    }
                })
            }
        }

        
    }

}
