import { Component, Input } from '@angular/core';

import { environment } from 'environments/environment';
import { UtilsService } from '../../../../../../services/utilsService';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { RecursoService } from '../../../../../../services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';
import { ListaPrecio } from 'app/models/listaPrecio';


@Component({
    selector: 'editar-lista-precio',
    styleUrls: ['./editarListaPrecio.scss'],
    templateUrl: './editarListaPrecio.html',
})

export class EditarListaPrecio {
    recurso: ListaPrecio = new ListaPrecio();

    constructor(
        private recursoService: RecursoService,
        private utilsService: UtilsService,
        private router: Router,
        private route: ActivatedRoute,
    ) {
        // Busco el recurso por id
        this.route.params.subscribe(params =>
            this.recursoService.getRecursoList(resourcesREST.listaPrecios)()
                .map((recursoList: ListaPrecio[]) =>
                    recursoList.find(recurso => recurso.idListaPrecio === parseInt(params.idListaPrecio))
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
                () => this.router.navigate(['/pages/tablas/listaPrecios'])
            )();
        }
        catch(ex) {
            this.utilsService.decodeErrorResponse(ex);
        }
    }

}
