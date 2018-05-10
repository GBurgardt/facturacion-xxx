import { Component, Input } from '@angular/core';

import { environment } from 'environments/environment';
import { UtilsService } from '../../../../../../services/utilsService';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { RecursoService } from '../../../../../../services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';
import { Deposito } from '../../../../../../models/deposito';

@Component({
    selector: 'editar-deposito',
    styleUrls: ['./editarDeposito.scss'],
    templateUrl: './editarDeposito.html',
})

export class EditarDeposito {
    recurso: Deposito = new Deposito();

    constructor(
        private recursoService: RecursoService,
        private utilsService: UtilsService,
        private router: Router,
        private route: ActivatedRoute,
    ) {
        // Busco el recurso por id
        this.route.params.subscribe(params =>
            this.recursoService.getRecursoList(resourcesREST.depositos)()
                .map((recursoList: Deposito[]) =>
                    recursoList.find(recurso => recurso.idDeposito === parseInt(params.idDeposito))
                )
                .subscribe(recurso =>{
                    this.recurso = recurso;
                })
        );

    }

    onClickEditar = async () => {
        try {

            const resp: any = await this.recursoService.editarRecurso(
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