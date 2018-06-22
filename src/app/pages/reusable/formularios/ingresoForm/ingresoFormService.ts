import * as _ from 'lodash';
import { Injectable } from "@angular/core";
import { Padron } from "../../../../models/padron";
import { AuthService } from "app/services/authService";
import { LocalStorageService } from "app/services/localStorageService";
import { environment } from "environments/environment";
import { ProductoPendiente } from "../../../../models/productoPendiente";
import { RecursoService } from "app/services/recursoService";
import { resourcesREST } from "constantes/resoursesREST";
import { Producto } from "app/models/producto";
import { Parametro } from "../../../../models/parametro";
import { Cotizacion } from "app/models/cotizacion";
import { ProductoBuscaModelo } from "../../../../models/productoBuscaModelo";
import { ModeloFactura } from "../../../../models/modeloFactura";
import { Comprobante } from "app/models/comprobante";
import { ComprobanteRelacionado } from "app/models/comprobanteRelacionado";

@Injectable()
export class IngresoFormService {
    constructor(
        private authService: AuthService,
        private localStorageService: LocalStorageService,
        private recursoService: RecursoService
    ) { }

    filtrarProveedores = (listaProveedores, textoBuscado) => {
        return listaProveedores.filter(
            (prov: Padron) =>   prov.padronCodigo.toString().includes(textoBuscado) ||
                                prov.padronApelli.toString().toLowerCase().includes(textoBuscado)
        );              
    }

    getProveFormated = (prove) => `${prove.padronNombre} (${prove.padronCodigo})`;

    getColumnsProductos = () => [
        {
            nombre: 'articulo',
            key: 'producto',
            subkey: 'codProducto',
            ancho: '15%'
        },
        {
            nombre: 'descripcion',
            key: 'producto',
            subkey: 'descripcion',
            ancho: '20%'
        },
        {
            nombre: 'imputacion',
            key: 'imputacion',
            ancho: '15%',
            enEdicion: null
        },
        {
            nombre: 'precio',
            key: 'precio',
            ancho: '10%',
            enEdicion: null
        },
        {
            nombre: 'ivaPorc',
            key: 'ivaPorc',
            ancho: '5%'
        },
        {
            nombre: 'cantidad',
            key: 'pendiente',
            ancho: '10%',
            enEdicion: null
        },
        {
            nombre: 'deposito',
            key: 'deposito',
            ancho: '10%',
            enEdicion: null
        },
        {
            nombre: 'trazable',
            key: 'producto',
            subkey: 'trazable',
            ancho: '5%',
            enEdicion: null
        }
    ];

    getColumnsTrazabilidad = () => [
        {
            nombre: 'articulo',
            key: 'producto',
            subkey: 'codProducto',
            ancho: '15%'
        },
        {
            nombre: 'descripcion',
            key: 'producto',
            subkey: 'descripcion',
            ancho: '20%'
        },
        {
            nombre: 'GLN',
            key: 'gln',
            ancho: '5%',
            enEdicion: null
        },
        {
            nombre: 'lote',
            key: 'lote',
            ancho: '5%',
            enEdicion: null
        },
        {
            nombre: 'serie',
            key: 'serie',
            ancho: '5%',
            enEdicion: null
        },
        {
            nombre: 'fecha elab',
            key: 'fechaElab',
            ancho: '20%',
            enEdicion: null
        },
        {
            nombre: 'fecha vto',
            key: 'fechaVto',
            ancho: '20%',
            enEdicion: null
        }
    ];

    getColumnsFactura = () => [
        {
            nombre: 'cuenta',
            key: 'cuentaContable',
            ancho: '30%'
        },
        {
            nombre: 'descripcion',
            key: 'descripcion',
            ancho: '30%'
        },
        {
            nombre: 'importe',
            key: 'importeTotal',
            ancho: '30%'
        }
    ]

    /**
     * Buscar los productos pendientes
     */
    buscarPendientes = (proveedor: Padron) => (comprobanteRel: any) => {
        return this.authService.getProductosPendientes(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        )(proveedor)(comprobanteRel)
            .map(respuesta => respuesta.arraydatos.map(prodPend => new ProductoPendiente(prodPend)));
    }

    /**
     * Retorna todos los productos de la empresa actual
     */
    getAllProductos = () => {
        //this.recursoService.getRecursoList(resourcesREST.productos)().subscribe(a=>console.log(a));
        return this.recursoService.getRecursoList(resourcesREST.productos)();
    }

    /**
     * Retorna un array de solo los prodPendientes que son trazables
     */
    getOnlyTrazables = (prodsPend: ProductoPendiente[]) => {
        return prodsPend.filter(prod => prod.producto.trazable);
    }

    /**
     * Retorna los datos de cotizacion
     */
    getCotizacionDatos = () => this.authService.getCotizacion(
        this.localStorageService.getObject(environment.localStorage.acceso).token
    ).map(responseCotiz => new Cotizacion(responseCotiz.datos));

    /**
     * Retorna un array de todas las letras (del iva) del proovedr seleccionado
     */
    getLetrasProveedor = (proveSelec: Padron) => this.authService.getSisSitIva(
        this.localStorageService.getObject(environment.localStorage.acceso).token
    )(proveSelec).map(
        respSisIva => respSisIva.datos.letra.split(',')
    )

    /**
     * Busca modelos para tab facturacion
     */
    buscaModelos = (prodsPend: ProductoPendiente[]) => {
        const prodsModel = prodsPend.map(prodP => new ProductoBuscaModelo(
            {
                idProducto: prodP.idProductos,
                precio: prodP.precio,
                cantidad: prodP.pendiente
            }
        ));

        return this.authService.buscaModelos(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        )(prodsModel).map(responBuscMod => responBuscMod.arraydatos.map(respModFact => new ModeloFactura(respModFact)));
    }

    /**
     * 
     */
    confirmarYGrabarComprobante = (comprobante: Comprobante) => 
    (comproRelac: ComprobanteRelacionado) =>
    (provSelec: Padron) => 
    (productosPend: ProductoPendiente[]) => 
    (modelosFactura: ModeloFactura[]) =>
    (cotizacionDatos: { cotizacion: Cotizacion, total: number }) =>  {
        
        // Valido los datos
        this.validarDatosComprobante(comprobante)(comproRelac)(provSelec)(productosPend)(modelosFactura)(cotizacionDatos);

        return this.authService.grabaComprobante(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        )(comprobante)(comproRelac)(provSelec)(productosPend)(modelosFactura)(cotizacionDatos).map(
            respGraba => console.log(respGraba)
        );

    }

    /**
     * Valida que los datos estén correctos
     */
    validarDatosComprobante =  (comprobante: Comprobante) => 
    (comproRelac: ComprobanteRelacionado) =>
    (provSelec: Padron) => 
    (productosPend: ProductoPendiente[]) => 
    (modelosFactura: ModeloFactura[]) =>
    (cotizacionDatos: { cotizacion: Cotizacion, total: number }) => {
        // Primero checkeo nulos
        this.checkNulosDatosComprobantes(comprobante)(comproRelac)(provSelec)(productosPend)(modelosFactura)(cotizacionDatos)


    }

    /**
     * Checkea nulos
     */
    checkNulosDatosComprobantes = (comprobante: Comprobante) => (comproRelac: ComprobanteRelacionado) =>(provSelec: Padron) => (productosPend: ProductoPendiente[]) => (modelosFactura: ModeloFactura[]) =>(cotizacionDatos: { cotizacion: Cotizacion, total: number }) => {
        if (
            provSelec.padronCodigo &&
            comprobante.tipo.idCteTipo && 
            comprobante.letra && 
            comprobante.puntoVenta &&
            comprobante.numero &&
            comprobante.moneda.idMoneda && 
            comprobante.fechaComprobante &&
            comprobante.fechaVto

        ) {

        }
    }

    /**
     * Autocompleta con ceros
     */
    autocompNroComp = (tipo) => (recursoComp) => {
        if (tipo === 'puntoVenta') {
            const lengthPtoVenta = recursoComp.puntoVenta ? recursoComp.puntoVenta.toString().length : 0;
            if (lengthPtoVenta > 4) {
                throw({
                    nombreError: 'Error',
                    descripcionError: 'Debe ingresar 4 caracteres o menos'
                })
            }
            return lengthPtoVenta === 4 ? recursoComp.puntoVenta : 
                lengthPtoVenta === 3 ? `0${recursoComp.puntoVenta}` :
                lengthPtoVenta === 2 ? `00${recursoComp.puntoVenta}` :
                lengthPtoVenta === 1 ? `000${recursoComp.puntoVenta}` : '';

        } else {    
            const lengthNumero = recursoComp.numero ? recursoComp.numero.toString().length : 0;
            if (lengthNumero > 8) {
                throw({
                    nombreError: 'Error',
                    descripcionError: 'Debe ingresar 8 caracteres o menos'
                })
            }
            return lengthNumero === 8 ? recursoComp.numero : 
                lengthNumero === 7 ? `0${recursoComp.numero}` :
                lengthNumero === 6 ? `00${recursoComp.numero}` :
                lengthNumero === 5 ? `000${recursoComp.numero}` :
                lengthNumero === 4 ? `0000${recursoComp.numero}` :
                lengthNumero === 3 ? `00000${recursoComp.numero}` :
                lengthNumero === 2 ? `000000${recursoComp.numero}` :
                lengthNumero === 1 ? `0000000${recursoComp.numero}` : '';
        }
    }

    seleccionarProveedor = (todos: Padron[]) => (seleccionado: Padron) => {
        // Primero busco si el ingresado existe
        const provBuscado = _.clone(todos.find(
            prove => prove.padronCodigo === Number(seleccionado.padronCodigo)
        ));
        // Si existe, lo seteo como seleccionado
        if (provBuscado) {
            return provBuscado;
        } else {
            // Caso contrario..
            // Busco el padronCodigo del proveedor que estaba seleccionado
            const proveedorAnterior: Padron = _.clone(todos.find(
                prove =>    prove.padronApelli === seleccionado.padronApelli &&
                            prove.padronNombre === seleccionado.padronNombre &&
                            prove.cuit === seleccionado.cuit &&
                            prove.codigoPostal === seleccionado.codigoPostal
            ));

            // Si habia uno seleccionado, lo restauro
            if (proveedorAnterior) {
                // Vuelvo el padronCodigo a su valor correcto
                return proveedorAnterior;
            } else {
                // Caso contrario tiro mensajito
                throw({
                    nombre: 'Codigo incorrecto',
                    descripcion: 'El codigo no existe'
                })
                
            }
        }
    }

}