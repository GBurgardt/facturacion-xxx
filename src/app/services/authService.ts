import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Headers, Http, Request, RequestOptions, RequestOptionsArgs, RequestMethod, ResponseContentType } from '@angular/http';

// Libreria para encriptar en MD5 la clave
import * as crypto from 'crypto-js';

// Operadores del observablke. Si no importo esto tira un error.
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/toPromise';

import { resourcesREST } from 'constantes/resoursesREST';

import { FiltroListaPrecios } from '../models/filtroListaPrecio';
import { DetalleProducto } from '../models/detalleProducto';
import { Padron } from '../models/padron';
import { ProductoBuscaModelo } from 'app/models/productoBuscaModelo';
import { Comprobante } from 'app/models/comprobante';
import { ComprobanteRelacionado } from '../models/comprobanteRelacionado';

import { Cotizacion } from 'app/models/cotizacion';
import { ProductoPendiente } from 'app/models/productoPendiente';
import { ModeloFactura } from 'app/models/modeloFactura';
import { Deposito } from '../models/deposito';
import { SisModulo } from '../models/sisModulo';
import { Producto } from '../models/producto';
import { SisEstado } from '../models/sisEstado';
import { TipoComprobante } from 'app/models/tipoComprobante';
import { DateLikePicker } from 'app/models/dateLikePicker';
import { UtilsService } from './utilsService';
import { SisCanje } from '../models/sisCanje';
import { DetalleFormaPago } from 'app/models/detalleFormaPago';
import { Rubro } from '../models/rubro';
import { SubRubro } from '../models/subRubro';
import { FormaPago } from 'app/models/formaPago';
import { Factura } from 'app/models/factura';
import { ModeloDetalle } from '../models/modeloDetalle';
import sisModulos from 'constantes/sisModulos';

@Injectable()
export class AuthService {

    constructor(
        private http: Http,
        private utilsService: UtilsService
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
        queryParams: any,
        notJson = false
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
            body: (Object.keys(body).length === 0 && body.constructor === Object) ? null : JSON.stringify(body),
            responseType: notJson ? ResponseContentType.ArrayBuffer : ResponseContentType.Json
        };

        var reqOptions = new RequestOptions(opciones);
        var req = new Request(reqOptions);

        return this.http.request(req).timeout(environment.facturacionRest.timeoutDefault).map(
            res => notJson ? res : res.json()
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
    getProductosPendientes = (token: string) => (proveedor: Padron) => (comproRel: ComprobanteRelacionado) => {
        return this.request(
            [],
            RequestMethod.Post,
            {
                token: token,
            },
            resourcesREST.buscaPendientes.nombre,
            {
                cteTipo : comproRel.tipo.idCteTipo,
                facNumero : comproRel.todosLosPendientes ? 0 : Number(comproRel.puntoVenta + comproRel.numero),
                codigoProv : Number(proveedor.padronCodigo),
                pendiente : comproRel.todosLosPendientes ? 1 : 0,
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
    buscaModelos = (token) => (productos: ProductoBuscaModelo[]) => (idSisModulo) => {
        return this.request(
            [],
            RequestMethod.Post,
            {
                token: token,
            },
            resourcesREST.buscaModelo.nombre,
            {
                modulo: idSisModulo,
                productos: productos
            },
            {}
        );
    }

    /**
     * Graba un comprobante de comprobanteCompra
     */
    grabaComprobante =  (token) =>
                        (comprobante: Comprobante) =>
                        (comproRelac: ComprobanteRelacionado) =>
                        (provSelec: Padron) =>
                        (productosPend: ProductoPendiente[]) =>
                        (modelosFactura: ModeloFactura[]) =>
                        (cotizacionDatos: { cotizacion: Cotizacion, total: number }) =>
                        (depositoSelec: Deposito) =>
                        (detallesFormaPago: DetalleFormaPago[]) => 
                        (factura: Factura) => {

        return this.request(
            [],
            RequestMethod.Post,
            {
                token: token,
            },
            'grabaComprobante',
            {
                cai: ' ',
                caiVto: this.utilsService.formatearFecha('yyyy-mm-dd')(comprobante.fechaComprobante),
                codBarra: ' ',
                codigoPostal: ' ',
                cotDolar: cotizacionDatos.cotizacion.cotizacion,
                cuit: provSelec.cuit.toString(),
                factCabecera: true,
                factDet: true,
                factFormaPago: true,
                factImputa: true,
                factPie: modelosFactura.length > 0,
                fechaEmision: this.utilsService.formatearFecha('yyyy-mm-dd')(comprobante.fechaComprobante),
                fechaVencimiento: this.utilsService.formatearFecha('yyyy-mm-dd')(comprobante.fechaComprobante),
                fechaConta: this.utilsService.formatearFecha('yyyy-mm-dd')(comprobante.fechaComprobante),
                fechaDolar: cotizacionDatos.cotizacion.fechaCotizacion,
                fechaVencimientoFact: factura ? this.utilsService.formatearFecha('yyyy-mm-dd')(factura.fechaVto) : null,
                fechaContaFact: factura ? this.utilsService.formatearFecha('yyyy-mm-dd')(factura.fechaContable) : null,
                grabaFactura: factura && factura.tipo && factura.tipo.idCteTipo ? true : false,
                grillaArticulos: productosPend.map(prod => {
                    return {
                        idProducto: prod.producto.idProductos,
                        articulo: prod.producto.descripcion ? prod.producto.descripcion : '',
                        pendiente: prod.pendiente,
                        precio: prod.precio,
                        porCalc: prod.porCalc ? prod.porCalc : 0,
                        descuento: prod.descuento,
                        ivaPorc: prod.ivaPorc,
                        cantidadBulto: prod.cantBultos,
                        despacho: prod.despacho ? prod.despacho : ' ',
                        trazable: prod.producto.trazable,
                        idDeposito: depositoSelec.idDeposito,
                        observacionDetalle: prod.producto.observaciones ? prod.producto.observaciones : ' ',
                        imputacion: prod.imputacion.seleccionada.ctaContable,
                        idFactCabImputa: prod.idFactCabImputada ? prod.idFactCabImputada : null,
                        itemImputada: prod.itemImputada,
                        importe: prod.importe
                    }
                }),
                grillaSubTotales: modelosFactura.map(mod => {
                    return {
                        cuenta: mod.cuentaContable,
                        descripcionPie: mod.descripcion,
                        importe: mod.importeTotal,
                        totalComprobante: cotizacionDatos.total,
                        porcentaje: mod.porcentaje ? mod.porcentaje : 0
                    }
                }),
                grillaTrazabilidad: productosPend
                    .filter(prodPend => prodPend.producto.trazable)
                    .map(prodTraza => {
                        return {
                            nroLote: prodTraza.trazabilidad.lote,
                            serie: prodTraza.trazabilidad.serie,
                            fechaElab: this.utilsService.formatearFecha('yyyy-mm-dd')(prodTraza.trazabilidad.fechaElab),
                            fechaVto: this.utilsService.formatearFecha('yyyy-mm-dd')(prodTraza.trazabilidad.fechaVto),
                            vigencia: true,
                                idProducto: prodTraza.producto.idProductos
                            }
                        }),
                grillaFormaPago: detallesFormaPago.map(detFp => {
                    return {
                        plazo: detFp.cantDias ? detFp.cantDias : 0,
                        interes: detFp.porcentaje ? detFp.porcentaje : 0,
                        monto: detFp.monto ? Number(detFp.monto) : 0,
                        detalle: detFp.detalle ? detFp.detalle : ' ',
                        observaciones: detFp.observaciones ? detFp.observaciones : ' ',
                        cuentaContable: detFp.planCuenta ? detFp.planCuenta.planCuentas : ' ',
                        idFormaPagoDet: detFp.idFormaPagoDet
                    }
                }),

                idCteTipo: comprobante.tipo.idCteTipo,
                idPadron: provSelec.padronCodigo,
                idMoneda: comprobante.moneda.idMoneda,
                idModeloCab: null,
                idFactCab: null,
                idModulo: sisModulos.compra,
                listaPrecio: ' ',
                letraFact: factura ? 'A' : null,
                letra: comprobante.letra,
                lote:   productosPend.some(prodPend => prodPend.producto.trazable) &&
                        comprobante.tipo.comprobante.idSisComprobantes !== 4,
                nombre: provSelec.padronApelli,
                numero: Number(comprobante.puntoVenta + comprobante.numero),
                numeroFact: factura ? Number(factura.puntoVenta + factura.numero) : null,
                observaciones: comprobante.observaciones,
                precioReferenciaCanje: 0,
                productoCanje: ' ',
                produmo: true,
                relComprobante: comproRelac.tipo.idCteTipo,
                relPuntoVenta: comproRelac.puntoVenta,
                relNumero: comproRelac.numero,
                sisSitIva: provSelec.condIva.descCorta,
                interesCanje: 0,
                tipoFact: factura && factura.tipo ? factura.tipo.idCteTipo : null
            },
            {}
        );
    }


    /**
     * Emitir remito
     */
    emitirRemito =  (token) =>
                        (comprobante: Comprobante) =>
                        (comproRelac: ComprobanteRelacionado) =>
                        (clienteSelect: Padron) =>
                        (productosPend: ProductoPendiente[]) =>
                        (modelosFactura: ModeloFactura[]) =>
                        (cotizacionDatos: { cotizacion: Cotizacion, total: number }) =>
                        (depositoSelec: Deposito) =>
                        (sisCanje: SisCanje) =>
                        (formasPagoSeleccionadas: FormaPago[]) =>
                        (factura: Factura) => 
                        (detallesFormaPago: DetalleFormaPago[]) => 
    {

        // debugger;

        return this.request(
            [],
            RequestMethod.Post,
            {
                token: token,
            },
            'grabaComprobante',
            {
                idCteTipo: comprobante.tipo.idCteTipo,
                letra: 'X',
                numero: Number(comprobante.puntoVenta + comprobante.numero),

                fechaEmision: this.utilsService.formatearFecha('yyyy-mm-dd')(comprobante.fechaComprobante),
                fechaVencimiento: this.utilsService.formatearFecha('yyyy-mm-dd')(comprobante.fechaComprobante),
                fechaConta: this.utilsService.formatearFecha('yyyy-mm-dd')(comprobante.fechaComprobante),
                cai: ' ',
                caiVto: this.utilsService.formatearFecha('yyyy-mm-dd')(comprobante.fechaComprobante),
                codBarra: ' ',
                idPadron: clienteSelect.padronCodigo,
                idFormaPago: 0,
                productoCanje: sisCanje ? sisCanje.descripcion : " ",
                precioReferenciaCanje: sisCanje ? sisCanje.precio : 0,
                interesCanje: sisCanje ? sisCanje.interes : 0,
                idMoneda: comprobante.moneda.idMoneda,
                nombre: clienteSelect.padronApelli,
                cuit: clienteSelect.cuit.toString(),
                sisSitIva: clienteSelect.condIva.descCorta,
                codigoPostal: ' ',
                listaPrecio: formasPagoSeleccionadas && formasPagoSeleccionadas.length > 0 ? 
                    formasPagoSeleccionadas[0].listaPrecio.idListaPrecio : null,
                cotDolar: cotizacionDatos.cotizacion.cotizacion,
                fechaDolar: cotizacionDatos.cotizacion.fechaCotizacion,
                observaciones: comprobante.observaciones,

                relComprobante: comproRelac.tipo.idCteTipo,
                relPuntoVenta: comproRelac.puntoVenta,
                relNumero: comproRelac.numero,
                factCabecera: true,
                factDet: true,
                factFormaPago: true,
                factImputa: true,
                factPie: true,
                produmo: true,
                lote: true,
                grillaArticulos: productosPend.map(prod => {
                    return {
                        idProducto: prod.producto.idProductos,
                        articulo: prod.producto.descripcion ? prod.producto.descripcion : '',
                        pendiente: prod.pendiente,
                        precio: prod.precio,
                        porCalc: prod.porCalc ? prod.porCalc : 0,
                        descuento: prod.descuento,
                        ivaPorc: prod.ivaPorc,
                        cantidadBulto: prod.cantBultos,
                        despacho: prod.despacho ? prod.despacho : ' ',
                        trazable: prod.producto.trazable,
                        idDeposito: depositoSelec? depositoSelec.idDeposito : null,
                        observacionDetalle: prod.producto.observaciones ? prod.producto.observaciones : ' ',
                        imputacion: prod.imputacion.seleccionada.ctaContable,
                        idFactCabImputa: prod.idFactCabImputada ? prod.idFactCabImputada : null,
                        itemImputada: prod.itemImputada,
                        importe: prod.importe
                    }
                }),
                grillaSubTotales: modelosFactura ? modelosFactura.map(mod => {
                    return {
                        cuenta: mod.cuentaContable,
                        descripcionPie: mod.descripcion,
                        importe: mod.importeTotal,
                        totalComprobante: cotizacionDatos.total,
                        porcentaje: 0
                    }
                }) : [],
                grillaTrazabilidad: productosPend
                    .filter(prodPend => prodPend.producto.trazable)
                    .map(prodTraza => {
                        return {
                            nroLote: prodTraza.trazabilidad.lote,
                            serie: prodTraza.trazabilidad.serie,
                            fechaElab: this.utilsService.formatearFecha('yyyy-mm-dd')(prodTraza.trazabilidad.fechaElab),
                            fechaVto: this.utilsService.formatearFecha('yyyy-mm-dd')(prodTraza.trazabilidad.fechaVto),
                            vigencia: true,
                            idProducto: prodTraza.producto.idProductos
                        }
                    }),
                grillaFormaPago: detallesFormaPago.map(detFp => {
                    return {
                        plazo: detFp.cantDias ? detFp.cantDias : 0,
                        interes: detFp.porcentaje ? detFp.porcentaje : 0,
                        monto: detFp.monto ? Number(detFp.monto) : 0,
                        detalle: detFp.detalle ? detFp.detalle : ' ',
                        observaciones: detFp.observaciones ? detFp.observaciones : ' ',
                        cuentaContable: detFp.planCuenta ? detFp.planCuenta.planCuentas : ' ',
                        idFormaPagoDet: detFp.idFormaPagoDet
                    }
                }),
                // grillaFormaPago: formasPagoSeleccionadas
                //     .map(fPago => {
                //         return {
                //             descripcion: fPago.descripcion,
                //             idSisFormaPago: fPago.tipo.idSisFormaPago

                //         }
                //     }),
                grabaFactura: factura && factura.tipo && factura.tipo.idCteTipo ? true : false,
                tipoFact: factura && factura.tipo ? factura.tipo.idCteTipo : null,
                letraFact: factura ? 'A' : null,
                numeroFact: factura ? Number(factura.puntoVenta + factura.numero) : null,
                fechaVencimientoFact: factura ? this.utilsService.formatearFecha('yyyy-mm-dd')(factura.fechaVto) : null,
                fechaContaFact: factura ? this.utilsService.formatearFecha('yyyy-mm-dd')(factura.fechaContable) : null,
                idModulo: sisModulos.venta

            },
            {}
        );
    }
        


    descargarComprobante = (token) => (idFactCab) => {
        return this.request(
            [],
            RequestMethod.Post,
            {
                token: token,
            },
            `descargarPdf`,
            {
                idFactCab: idFactCab
            },
            { },
            true
        );
    }


    /** */
    getSisSitIva = (token) => (provSelec: Padron) => {
        return this.request(
            [],
            RequestMethod.Get,
            {
                token: token,
            },
            `sisSitIva/${provSelec.condIva.descCorta}`,
            { },
            { }
        );
    }

    /**
    * @description Obtiene productos pendientes
    * @argument token
    * @argument filtros Lo filtro
    */
    getBuscaComprobantes = (token: string) =>   (comprobante: Comprobante) =>
                                                (fechasFiltro: { desde: DateLikePicker, hasta: DateLikePicker}) =>
                                                (sisModuloSelec: SisModulo) =>
                                                (tipoComprobanteSelec: TipoComprobante) =>
                                                (productoSelec: Producto) =>
                                                (sisEstadoSelec: SisEstado) =>
                                                (padronSelec: Padron) =>
                                                (depositoSelec: Deposito) => {
        return this.request(
            [],
            RequestMethod.Post,
            {
                token: token,
            },
            resourcesREST.buscaComprobantes.nombre,
            {
                comprobanteModulo : sisModuloSelec && sisModuloSelec.idSisModulos ? sisModuloSelec.idSisModulos : 0,
                comprobanteTipo : tipoComprobanteSelec && tipoComprobanteSelec.idCteTipo ? tipoComprobanteSelec.idCteTipo : 0,
                comprobanteNumero : comprobante && comprobante.puntoVenta && comprobante.numero ? `${comprobante.puntoVenta}${comprobante.numero}` : 0,
                fechaDesde : this.utilsService.formatearFecha('yyyy-mm-dd')(fechasFiltro.desde),
                fechaHasta : this.utilsService.formatearFecha('yyyy-mm-dd')(fechasFiltro.hasta),
                idProducto : productoSelec && productoSelec.idProductos ? productoSelec.idProductos : 0,
                padCodigo : padronSelec && padronSelec.padronCodigo ? padronSelec.padronCodigo : 0,
                // codigoDep : depositoSelec && depositoSelec.codigoDep ? depositoSelec.codigoDep : 0,
                idDeposito : depositoSelec && depositoSelec.idDeposito ? depositoSelec.idDeposito : 0,
                idEstado : sisEstadoSelec && sisEstadoSelec.idSisEstados ? sisEstadoSelec.idSisEstados : 0
            },
            {}
        );
    }


    /**
    * @description Obtiene las formas de pago
    * @argument token
    */
    getBuscaFormaPago = (token: string) => (cliente?: Padron) => (fecha: any) => this.request(
        [],
        RequestMethod.Post,
        {
            token: token,
        },
        resourcesREST.buscaFormaPago.nombre,
        {
            activa: true,
            todas: true,
            fecha: this.utilsService.formatearFecha('yyyy-mm-dd')(fecha),
            idPadronDesde: cliente ? cliente.padronCodigo : null,
            idPadronHasta: cliente ? cliente.padronCodigo : null
        },
        {}
    );
    

    /**
    * @description
    * @argument token
    */
    getBuscaCteFecha = (token: string) => (comprobante: Comprobante) => {
        return this.request(
            [],
            RequestMethod.Post,
            {
                token: token,
            },
            resourcesREST.buscaCteFecha.nombre,
            {
                idCteTipo: comprobante.tipo.idCteTipo,
	            puntoVenta: comprobante.puntoVenta
            },
            {}
        );
    }

    /**
    * @description Obtiene subtotales (se usa en emision remitos)
    * @argument token
    */
    getCalculoSubtotales = (token: string) => (prodPend: ProductoPendiente) => {
        return this.request(
            [],
            RequestMethod.Post,
            {
                token: token,
            },
            resourcesREST.calculoSubtotales.nombre,
            {
                precio: prodPend.precio,
                cantidad: prodPend.pendiente,
                iva: prodPend.ivaPorc,
                descuento: prodPend.descuento,
                tipoDescuento: prodPend.tipoDescuento
            },
            {}
        );
    }

    /**
    * @description Obtiene los loties de un producto dado
    * @argument token
    */
    getBuscaLote = (token: string) => (filtros: {
        idPadron: string,
        nroLote: string,
        codProducto: string,
        fechaVtoHasta: any
    }) => {
        return this.request(
            [],
            RequestMethod.Post,
            {
                token: token,
            },
            resourcesREST.buscaLote.nombre,
            {
                nroLote: filtros.nroLote ? filtros.nroLote : " ",
                serie: " ",
                fechaVtoDesde: "2000-01-01",
                fechaVtoHasta: this.utilsService.formatearFecha('yyyy-mm-dd')(filtros.fechaVtoHasta),
                vigencia: 1,
                codProducto: filtros.codProducto ? filtros.codProducto : null,
                idPadron: filtros.idPadron ? filtros.idPadron : 0,
                idCteTipo: 0,
                facNumero: 0,
                stock: 1
            },
            {}
        );
    }

    /**
    * @description Obtiene los lotes de varios productos
    * @argument token
    */
   getBuscaLotes = (token: string) => (productos: ProductoPendiente[]) => (comprobante: Comprobante) => {
        return this.request(
            [],
            RequestMethod.Post,
            {
                token: token,
            },
            resourcesREST.buscaLotes.nombre,
            {
                nroLote: " ",
                serie: " ",
                fechaVtoDesde: "2000-01-01",
                fechaVtoHasta: this.utilsService.formatearFecha('yyyy-mm-dd')(comprobante.fechaComprobante),
                vigencia: 1,
                productos: productos.map(prod => {
                    return {
                        idProducto: prod.producto.idProductos
                    }
                }),
                idPadron: 0,
                idCteTipo: 0,
                facNumero: 0,
                stock: 1
            },
            {}
        );
    }

    /**
    * @description Obtiene los stock
    * @argument token
    */
    getBuscaStock = (token: string) => (filtros: {
        fechaHasta: any,
        codProducto: any,
        productoSelect: Producto,
        productoSelect2?: Producto,
        cteTipo?: TipoComprobante,
        deposito?: Deposito,
        rubro?: Rubro,
        subRubro: SubRubro
    }) => (tipo: string) => {
        return this.request(
            [tipo],
            RequestMethod.Post,
            {
                token: token,
            },
            resourcesREST.buscaStock.nombre,
            {
                fechaHasta: this.utilsService.formatearFecha('yyyy-mm-dd')(filtros.fechaHasta),
                idProductoDesde: (filtros.productoSelect && tipo === 'general') ? filtros.productoSelect.idProductos : 0,
                idProductoHasta: filtros.productoSelect2 ? filtros.productoSelect2.idProductos : 0,
                idProducto: (filtros.productoSelect && tipo === 'producto') ? filtros.productoSelect.idProductos : 0,
                idDeposito: 0,
                idCteTipo: filtros.cteTipo ? filtros.cteTipo.idCteTipo : 0,
                idRubro: filtros.rubro ? filtros.rubro.idRubro : 0,
                idSubRubro: filtros.subRubro ? filtros.subRubro.idSubRubro : 0,
                tipoEstado: 0
            },
            {}
        );
    }


    getProximoCodigoProducto = (token) => this.request(
        [],
        RequestMethod.Get,
        {
            token: token
        },
        resourcesREST.proximoCodigo.nombre,
        {},
        {}
    );

    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////              MÉTODOS REUTILIZABLES          ///////////////////
    ///////////////////////////////////////////////////////////////////////////////////

    /**
    * @description Obtiene una lista de un recurso especificado
    * @argument token
    * @argument resource Ejemplos: 'cteTipo', 'rubros'
    * @argument queryParams Query params para setearle a la consulta
    */
    getResourceList = (token: string) => (nombreRecurso: string) => (params?) => (tipoParam?) =>
        this.request(
            params && tipoParam && tipoParam === 'path' ?
                params : [],
            RequestMethod.Get,
            {
                token: token,
            },
            nombreRecurso,
            {},
            params && tipoParam && tipoParam === 'query' ?
                params : {}
        )


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
                idListaPrecio: recurso.listaPrecio.idListaPrecio,
                formaPagoDet: recurso.detalles.map((det: DetalleFormaPago) => ({
                    cantDias: det.cantDias ? det.cantDias : 0,
                    porcentaje: det.porcentaje ? det.porcentaje : 0,
                    detalle: det.detalle ? det.detalle : '',
                    ctaContable: det.planCuenta ? det.planCuenta.planCuentas : ''
                }))
            }
        }

        if (nombreRecurso === resourcesREST.productos.nombre) {
            return {
                codProducto: recurso.codProducto,
                codigoBarra: recurso.codigoBarra,
                descripcionCorta: recurso.descripcionCorta,
                descripcion: recurso.descripcion,
                modeloImputacion: recurso.modeloCab.idModeloCab,
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
                idUnidadVenta: recurso.unidadVenta.idUnidad,
                idMarca: recurso.marca ? recurso.marca.idMarcas : null
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
                        idProducto: detalle.producto.idProductos,
                        cotaInfPorc: detalle.porcentajeInf ? detalle.porcentajeInf : 0,
                        cotaSupPorc: detalle.porcentajeSup ? detalle.porcentajeSup : 0
                    }
                })
            }
        }

        if (nombreRecurso === resourcesREST.modeloImputacion.nombre) {
            return {
                descripcion: recurso.descripcion,
                modeloDetalle: recurso.modeloDetalle.map(det => ({
                    ctaContable: det.planCuenta ? det.planCuenta.planCuentas : null,
                    orden: det.orden,
                    descripcionDetalle: det.descripcion,
                    dh: det.dh,
                    prioritario: det.prioritario ? true : false,
                    valor: det.valor,
                    operador: det.operador,
                    idSisTipoModelo: det.idSisTipoModelo,
                    modulo: det.idSisModulo ? det.idSisModulo : null
                }))
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
                idListaPrecio: recurso.listaPrecio.idListaPrecio,
                formaPagoDet: recurso.detalles.map((det: DetalleFormaPago) => ({
                    cantDias: det.cantDias ? det.cantDias : 0,
                    porcentaje: det.porcentaje ? det.porcentaje : 0,
                    detalle: det.detalle ? det.detalle : '',
                    ctaContable: det.planCuenta ? det.planCuenta.planCuentas : ''
                }))
            }
        }

        if (nombreRecurso === resourcesREST.productos.nombre) {
            // debugger;
            return {
                idProducto: recurso.idProductos,
                codProducto: recurso.codProducto,
                codigoBarra: recurso.codigoBarra,
                descripcionCorta: recurso.descripcionCorta,
                descripcion: recurso.descripcion,
                modeloImputacion: recurso.modeloCab.idModeloCab,
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
                idUnidadVenta: recurso.unidadVenta.idUnidad,
                idMarca: recurso.marca ? recurso.marca.idMarcas : null
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
                        idProducto: detalle.producto.idProductos,
                        cotaInfPorc: detalle.porcentajeInf ? detalle.porcentajeInf : 0,
                        cotaSupPorc: detalle.porcentajeSup ? detalle.porcentajeInf : 0
                    }
                }),
                idPadronCliente: recurso.idPadronCliente,
                idPadronRepresentante: recurso.idPadronRepresentante,
                porc1: recurso.porc1,
            }
        }

        if (nombreRecurso === resourcesREST.modeloImputacion.nombre) {
            return {
                idModeloCab: recurso.idModeloCab,
                descripcion: recurso.descripcion,
                modeloDetalle: recurso.modeloDetalle.map(det => ({
                    ctaContable: det.planCuenta ? det.planCuenta.planCuentas : null,
                    orden: det.orden,
                    descripcionDetalle: det.descripcion,
                    dh: det.dh,
                    prioritario: det.prioritario ? true : false,
                    valor: det.valor ? det.valor : 0,
                    operador: det.operador,
                    idSisTipoModelo: det.idSisTipoModelo,
                    modulo: det.idSisModulo ? det.idSisModulo : null
                }))
            }

        }


    }

}
