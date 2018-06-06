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

    filtrarProveedores = (listaProveedores, padronCodigo) => {
        return listaProveedores.filter((prov: Padron) => prov.padronCodigo.toString().includes(padronCodigo));
    }

    getProveFormated = (prove) => `${prove.padronNombre} (${prove.padronCodigo})`;

    getColumnsProductos = () => [
        {
            nombre: 'articulo',
            key: 'codProducto',
            ancho: '10%'
        },
        {
            nombre: 'descripcion',
            key: 'articulo',
            ancho: '30%'
        },
        {
            nombre: 'precio',
            key: 'precio',
            ancho: '10%'
        },
        {
            nombre: 'ivaPorc',
            key: 'ivaPorc',
            ancho: '10%'
        },
        {
            nombre: 'cantidad',
            key: 'pendiente',
            ancho: '20%'
        },
        {
            nombre: 'deposito',
            key: 'deposito',
            ancho: '15%'
        },
        {
            nombre: 'trazable',
            key: 'deposito',
            ancho: '5%'
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

}