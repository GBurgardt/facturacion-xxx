import { Component } from '@angular/core';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { UtilsService } from '../../../../services/utilsService';
import { Producto } from '../../../../models/producto';
import { Observable } from 'rxjs/Observable';
import { RecursoService } from '../../../../services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';

@Component({

    selector: 'productos',
    styleUrls: ['./productos.scss'],
    templateUrl: './productos.html'
})




export class Productos {

    // Data de la tabla
    tableData: Observable<Producto[]>;
    // Columnas de la tabla
    tableColumns;
    constructor(
        private recursoService: RecursoService,
        private router: Router,
        private utilsService: UtilsService
    ) {
        this.tableColumns = [
            {
                nombre: 'Codigo',
                key: 'codProducto',
                ancho: '22%'
            },
            {
                nombre: 'descripcion',
                key: 'descripcion',
                ancho: '22%'
            },
            {
                nombre: 'Rubro',
                key: 'subRubro',
                subkey: 'descripcion',
                ancho: '22%'
            },
            {
                nombre: 'Sub rubro',
                key: 'subRubro',
                subkey: 'rubro',
                subsubkey: 'descripcion',
                ancho: '22%'
            }
        ]
        
        this.tableData = this.recursoService.getRecursoList(resourcesREST.productos)();
    }

    onClickEdit = (recurso: Producto) => {   
        this.router.navigate(['/pages/tablas/productos/editar', recurso.idProductos]);
    }

    onClickRemove = async(recurso: Producto) => {
        this.utilsService.showModal(
            'Borrar producto'
        )(
            '¿Estás seguro de borrar el producto?'
        )(
           async () => {
                const resp = await this.recursoService.borrarRecurso(recurso.idProductos)(resourcesREST.productos);
                
                this.tableData = this.recursoService.getRecursoList(resourcesREST.productos)();
            }
        )({
            tipoModal: 'confirmation'
        });
    }
}




