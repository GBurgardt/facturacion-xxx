import { Component, Input } from '@angular/core';
import { environment } from 'environments/environment';
import { UtilsService } from '../../../../../../services/utilsService';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FormaPago } from '../../../../../../models/formaPago';
import { TipoFormaPago } from 'app/models/tipoFormaPago';
import { RecursoService } from '../../../../../../services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';


@Component({
    selector: 'editar-forma-pago',
    styleUrls: ['./editarFormaPago.scss'],
    templateUrl: './editarFormaPago.html',
})

export class EditarFormaPago {
    recurso: FormaPago = new FormaPago();

    tiposFormaPago: Observable<TipoFormaPago[]>;

    constructor(
        private utilsService: UtilsService,
        private router: Router,
        private route: ActivatedRoute,
        private recursoService: RecursoService
    ) {
        this.route.params.subscribe(params =>
            this.recursoService.getRecursoList(resourcesREST.formaPago)()
                .map((recursoList: FormaPago[]) =>
                    recursoList.find(recurso => recurso.idFormaPago === parseInt(params.idFormaPago))
                )
                .subscribe(recurso =>{
                    this.recurso = recurso;
                })
        );

        // Cargo lo tipos de forma pago disponibles
        this.tiposFormaPago = this.recursoService.getRecursoList(resourcesREST.sisFormaPago)();
    }

    onClickEditar = async() => {
        try {
            const respuestaEdicion: any = await this.recursoService.editarRecurso(this.recurso)();

            this.utilsService.showModal(
                respuestaEdicion.control.codigo
            )(
                respuestaEdicion.control.descripcion
            )(
                () => this.router.navigate(['/pages/tablas/formas-pago'])
            )();
        }
        catch(ex) {
            this.utilsService.decodeErrorResponse(ex);

        }
    }

}
