import { Component, Input } from '@angular/core';

import { environment } from 'environments/environment';
import { UtilsService } from '../../../../../../services/utilsService';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { RecursoService } from '../../../../../../services/recursoService';

import { ListaPrecio } from '../../../../../../models/listaPrecio';
import { Rubro } from 'app/models/rubro';
import { SubRubro } from 'app/models/subRubro';
import { resourcesREST } from 'constantes/resoursesREST';
import { Moneda } from '../../../../../../models/moneda';
import { Producto } from '../../../../../../models/producto';
import { FiltroListaPrecios } from '../../../../../../models/filtroListaPrecio';
import { DetalleProducto } from '../../../../../../models/detalleProducto';

import * as _ from 'lodash';

@Component({
    selector: 'nuevo-lista-precio',
    styleUrls: ['./nuevoListaPrecio.scss'],
    templateUrl: './nuevoListaPrecio.html',
})

export class NuevoListaPrecio {
    recurso: ListaPrecio = new ListaPrecio();
    monedas: Observable<Moneda[]>;
    rubros: Observable<Rubro[]>;
    subRubros: Observable<SubRubro[]>;
    
    // Los filtros que después le mando la backend
    filtroListaPrecios: FiltroListaPrecios = new FiltroListaPrecios();

    // Columnas de la tabla
    columnasTabla;

    // Bandera que habilita los detalles una vez que se completo la data de la nueva lsita
    detallesActivos: boolean = false;

    constructor(
        private recursoService: RecursoService,
        private utilsService: UtilsService,
        private router: Router
    ) {
        this.monedas = this.recursoService.getRecursoList(resourcesREST.sisMonedas)();
        this.rubros = this.recursoService.getRecursoList(resourcesREST.rubros)();
        this.subRubros = this.recursoService.getRecursoList(resourcesREST.subRubros)();
        
        // 'enEdicion' alverga el id del recurso actualmente en edicion
        this.columnasTabla = [
            {
                nombre: 'codigo',
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
            // {
            //     nombre: 'precio',
            //     key: 'producto',
            //     subkey: 'precioVentaProv',
            //     ancho: '10%',
            //     enEdicion: null
            // },
            // {
            //     nombre: 'inferior',
            //     key: 'producto',
            //     subkey: 'precioVentaProv',
            //     ancho: '10%',
            //     enEdicion: null
            // },
            // {
            //     nombre: 'superior',
            //     key: 'producto',
            //     subkey: 'precioVentaProv',
            //     ancho: '10%',
            //     enEdicion: null
            // },
            {
                nombre: 'precio',
                key: 'precio',
                ancho: '10%',
                enEdicion: null
            },
            {
                nombre: 'inferior',
                key: 'cotaInf',
                ancho: '10%',
                enEdicion: null
            },
            {
                nombre: 'superior',
                key: 'cotaSup',
                ancho: '10%',
                enEdicion: null
            },
            {
                nombre: 'observaciones',
                key: 'observaciones',
                ancho: '25%',
                enEdicion: null
            }
        ];
    }

    /**
     * En realidad 'enEdicion' tiene siempre el mismo valor. Lo seteo en varias columnas para saber cual se puede editar
     * y cual no. 
     */
    onClickEdit = (recurso: DetalleProducto) => { 
        this.columnasTabla = this.columnasTabla.map(tabla => {
            let newTabla = tabla;
            if (newTabla.enEdicion !== undefined) {
                newTabla.enEdicion = recurso.idDetalleProducto
            }
            return newTabla;
        });
    }

    /**
     * Acá solo tengo que 'cerrar la edición' ya que los campos ya están bindeados y se cambian automáticamente
     */
    onClickConfirmEdit = (recurso: DetalleProducto) => { 
        // Todos los atributos 'enEdicion' distintos de undefined y también distintos de null o false, los seteo en false
        this.columnasTabla = this.columnasTabla.map(tabla => {
            let newTabla = tabla;
            if (newTabla.enEdicion !== undefined && newTabla.enEdicion) {
                newTabla.enEdicion = false;
            }
            return newTabla;
        })
    }

    /** 
     * Acá se elimina un producto de el array (Aclaración: NO se borra el producto de la BD, solamente se borra del array de acá)
     */
    onClickRemove = (recurso: DetalleProducto) => { 
        this.utilsService.showModal(
            'Borrar detalle'
        )(
            '¿Estás seguro de borrar este producto de la lista?'
        )(
            () => {
                // Borro el producto de el array
                this.recurso.listaPrecioDetCollection = this.recurso.listaPrecioDetCollection
                    .filter((detalleProd: DetalleProducto) => detalleProd.producto.idProductos !== recurso.producto.idProductos);
            }
        )({
            tipoModal: 'confirmation'
        });
    }

    /**
     * Hace una consulta y trae todos los productos según los filtros seteados
     */
    onClickAgregar = async (e) => {
        // El porcentajeCabecera está en la nueva lista creada, tengo que agregarlo a los filtros
        this.filtroListaPrecios.porcentajeCabecera = this.recurso.porc1;
        try {
            // Agrego los detalles a la lista de detalles de la lista de precios
            this.recursoService.getProductosByFiltro(this.filtroListaPrecios).subscribe(listaDetalles => {
                this.recurso.listaPrecioDetCollection = _.uniqWith(
                    this.recurso.listaPrecioDetCollection.concat(listaDetalles),
                    (a:DetalleProducto,b:DetalleProducto) => a.producto.idProductos === b.producto.idProductos
                );
            })
        }
        catch(ex) {
            this.utilsService.decodeErrorResponse(ex);
        }
    }

    /**
     * Eliminar productos de la lista
     */
    onClickEliminar = (e) => {
        // El porcentajeCabecera está en la nueva lista creada, tengo que agregarlo a los filtros
        this.filtroListaPrecios.porcentajeCabecera = this.recurso.porc1;
        try {
            // Elimino los elementos encontrados de la lista de detalles actual
            this.recursoService.getProductosByFiltro(this.filtroListaPrecios).subscribe((detallesEncontrados: DetalleProducto[]) => {

                this.recurso.listaPrecioDetCollection = _.filter(
                    this.recurso.listaPrecioDetCollection,
                    detProd => !_.some(
                        detallesEncontrados, 
                        detProdEnc => detProd.producto.idProductos === detProdEnc.producto.idProductos
                    )
                );
            })
        }
        catch(ex) {
            this.utilsService.decodeErrorResponse(ex);
        }
    }

    /**
     * Confirmar la creacion de la lista
     */
    onClickConfirmar = async(e) => {
        try {
            const resp: any = await this.recursoService.setRecurso(this.recurso)();

            this.utilsService.showModal(
                resp.control.codigo
            )(
                resp.control.descripcion
            )(
                () => this.router.navigate(['/pages/tablas/lista-precios'])
            )();
        }
        catch(ex) {
            this.utilsService.decodeErrorResponse(ex);
        }
        
    }


    /**
     * Habilita el resto del menu para seguir el proceso, o vuelto atrás
     */
    onClickTogglePaso = (e) => {
        this.detallesActivos = !this.detallesActivos;
    }

}
