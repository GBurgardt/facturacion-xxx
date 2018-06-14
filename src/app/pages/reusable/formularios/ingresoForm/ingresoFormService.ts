//import * as _ from 'lodash';
import { Injectable } from "@angular/core";
import { Padron } from "../../../../models/padron";
import { AuthService } from "app/services/authService";
import { LocalStorageService } from "app/services/localStorageService";
import { environment } from "environments/environment";
import { ProductoPendiente } from "../../../../models/productoPendiente";
import { RecursoService } from "app/services/recursoService";
import { resourcesREST } from "constantes/resoursesREST";

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
                                prov.padronNombre.toString().toLowerCase().includes(textoBuscado)
        );              
    }

    getProveFormated = (prove) => `${prove.padronNombre} (${prove.padronCodigo})`;

    getColumnsProductos = () => [
        {
            nombre: 'articulo',
            key: 'codProducto',
            ancho: '15%'
        },
        {
            nombre: 'descripcion',
            key: 'articulo',
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
            key: 'trazable',
            ancho: '5%',
            enEdicion: null
        }
    ];

    getColumnsTrazabilidad = () => [
        {
            nombre: 'articulo',
            key: 'codProducto',
            ancho: '15%'
        },
        {
            nombre: 'descripcion',
            key: 'articulo',
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
        return prodsPend.filter(prod => prod.trazable);
    }

}