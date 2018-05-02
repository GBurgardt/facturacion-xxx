import { Component } from '@angular/core';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { UtilsService } from '../../../../services/utilsService';
import { Producto } from '../../../../models/producto';
import { ProductosService } from 'app/services/productosService';
import { Observable } from 'rxjs/Observable';



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
        private productosService: ProductosService,
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
        
        this.tableData = this.productosService.getList();
    }

    onClickEdit = (recurso: Producto) => {   
        this.router.navigate(['/pages/tablas/productos/editar', recurso.idProductos]);
    }

    onClickRemove = async(recurso) => {
        this.utilsService.showModal(
            'Borrar sub rubro'
        )(
            '¿Estás seguro de borrar el sub rubro?'
        )(
           async () => {
                // const resp = await this.subRubrosService.removeSubRubro(recurso);     
                
                // this.tableData = this.subRubrosService.getSubRubrosList();
            }
        )({
            tipoModal: 'confirmation'
        });
    }

}
