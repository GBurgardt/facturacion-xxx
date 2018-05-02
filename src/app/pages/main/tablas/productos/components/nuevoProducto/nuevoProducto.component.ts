import { Component, Input } from '@angular/core';

import { environment } from 'environments/environment';
import { UtilsService } from '../../../../../../services/utilsService';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Producto } from '../../../../../../models/producto';
import { IVA } from '../../../../../../models/IVA';
import { ProductosService } from '../../../../../../services/productosService';

@Component({
    selector: 'nuevo-producto',
    styleUrls: ['./nuevoProducto.scss'],
    templateUrl: './nuevoProducto.html',
})

export class NuevoProducto {
    recurso: Producto = new Producto();

    ivas: Observable<IVA[]>;

    constructor(
        private productosService: ProductosService,
        private utilsService: UtilsService,
        private router: Router
    ) {
        this.ivas = this.productosService.getIvaList();
    }

    onClickCrear = async () => {
        try {
            
            const resp: any = await this.productosService.setRecurso(
                this.recurso
            );
    
            this.utilsService.showModal(
                resp.control.codigo
            )(
                resp.control.descripcion
            )(
                () => this.router.navigate(['/pages/tablas/productos']) 
            )();
        }
        catch(ex) {
            this.utilsService.decodeErrorResponse(ex);        
        }
    }

}
