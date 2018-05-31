import { Component, Input } from '@angular/core';

import { UtilsService } from 'app/services/utilsService';
import { Observable } from 'rxjs/Observable';
import { Producto } from 'app/models/producto';
import { Padron } from '../../../../models/padron';

@Component({
    selector: 'ingreso-form',
    templateUrl: './ingresoForm.html',
    styleUrls: ['./ingresoForm.scss']
})

/**
 * Form reutilizable
 */
export class IngresoForm {
    @Input() titulo = 'test';
    @Input() recurso;

    // Padron (del proveedor)
    padron: Padron = new Padron();




    // TABLAS: Datos de las tablas. Estas se van rellenando, asi que arrancan vacias
    // Data de la tabla de Articulos (facDetalle). 
    dataProductos: Observable<Producto[]>;
    // Columnas de la tabla Articulos (facDetalle)
    columnsProductos;



    constructor() {
        this.columnsProductos = [
            {
                nombre: 'articulo',
                key: 'codProducto',
                ancho: '22%'
            },
            {
                nombre: 'descripcion',
                key: 'descripcion',
                ancho: '22%'
            },
            {
                nombre: 'precio',
                key: 'precio',
                ancho: '22%'
            },
            {
                nombre: 'ivaPorc',
                key: 'ivaPorc',
                ancho: '22%'
            },
            {
                nombre: 'cantidad',
                key: 'cantidad',
                ancho: '22%'
            },
            {
                nombre: 'deposito',
                key: 'deposito',
                subkey: 'codigoDep',
                ancho: '22%'
            }
        ];
        
        //this.tableData = this.recursoService.getRecursoList(resourcesREST.productos)();
    }

}
