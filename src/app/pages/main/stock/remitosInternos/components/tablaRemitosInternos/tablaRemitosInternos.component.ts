import { Component, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProductoReducido } from 'app/models/productoReducido';
import { RemitosInternosService } from '../../remitosInternosService';
import { ProductoPendiente } from 'app/models/productoPendiente';

@Component({
    selector: 'tabla-remitos-internos',
    templateUrl: './tablaRemitosInternos.html',
    styleUrls: ['./tablaRemitosInternos.scss']
})
    
export class TablaRemitosInternos {
    // Datos de la tabla
    @Input() dataTable: ProductoPendiente[] = [];

    // Productos para buscar en buscador
    @Input() productosReducidos: BehaviorSubject<ProductoReducido[]>;

    // Índice del producto que está en edición
    indexProdEnEdicion = null;

    constructor(
        private remitosInternosService: RemitosInternosService
    ) { };

    /**
     * Cuando se selecciona el producto reducido se hace una consulta buscando el producto completo
     */
    onSelectItem = (prod: ProductoReducido) => {
        
        this.remitosInternosService.buscarProducto(prod.idProductos)
            .then(
                (prod: ProductoPendiente) => {
                    this.dataTable.push(prod);

                    // Busco el índice del producto
                    const ind = this.dataTable.indexOf(prod);
                    // Lo pongo en edición
                    this.editItem(ind);
                }
            )
    }

    editItem = (ind) => {
        this.indexProdEnEdicion = ind;
        setTimeout(() => document.getElementById('idInputEditPendiente').focus())
    }
}
