import { Component, Input } from '@angular/core';

import { environment } from 'environments/environment';
import { UtilsService } from '../../../../../../services/utilsService';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { RecursoService } from '../../../../../../services/recursoService';

import { ListaPrecio } from '../../../../../../models/listaPrecio';

@Component({
    selector: 'nuevo-lista-precio',
    styleUrls: ['./nuevoListaPrecio.scss'],
    templateUrl: './nuevoListaPrecio.html',
})

export class NuevoListaPrecio {
    recurso: ListaPrecio = new ListaPrecio();

    constructor(
        private recursoService: RecursoService,
        private utilsService: UtilsService,
        private router: Router
    ) { }

    onClickCrear = async (e) => {
        try {

            const resp: any = await this.recursoService.setRecurso(
                this.recurso
            )();

            this.utilsService.showModal(
                resp.control.codigo
            )(
                resp.control.descripcion
            )(
                () => this.router.navigate(['/pages/tablas/listaPrecios'])
            )();
        }
        catch(ex) {
            this.utilsService.decodeErrorResponse(ex);
        }
    }

}
