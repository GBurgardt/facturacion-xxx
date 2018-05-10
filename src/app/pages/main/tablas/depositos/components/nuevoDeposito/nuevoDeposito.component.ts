import { Component, Input } from '@angular/core';

import { environment } from 'environments/environment';
import { UtilsService } from '../../../../../../services/utilsService';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { RecursoService } from '../../../../../../services/recursoService';

import { resourcesREST } from 'constantes/resoursesREST';

import { Deposito } from '../../../../../../models/deposito';

@Component({
    selector: 'nuevo-deposito',
    styleUrls: ['./nuevoDeposito.scss'],
    templateUrl: './nuevoDeposito.html',
})

export class NuevoDeposito {
    recurso: Deposito = new Deposito();

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
                () => this.router.navigate(['/pages/tablas/depositos'])
            )();
        }
        catch(ex) {
            this.utilsService.decodeErrorResponse(ex);
        }
    }

}
