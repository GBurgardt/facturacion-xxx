import { Component, Input } from '@angular/core';
import { environment } from 'environments/environment';
import { UtilsService } from '../../../../../../services/utilsService';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FormaPago } from '../../../../../../models/formaPago';
import { TipoFormaPago } from 'app/models/tipoFormaPago';
import { RecursoService } from '../../../../../../services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';


@Component({
    selector: 'nueva-forma-pago',
    styleUrls: ['./nuevaFormaPago.scss'],
    templateUrl: './nuevaFormaPago.html',
})

export class NuevaFormaPago {
    recurso: FormaPago = new FormaPago();

    tiposFormaPago: Observable<TipoFormaPago[]>;

    constructor(
        private recursoService: RecursoService,
        private utilsService: UtilsService,
        private router: Router
    ) {
        // Cargo lo tipos de forma pago disponibles
        this.tiposFormaPago = this.recursoService.getRecursoList(resourcesREST.sisFormaPago)();
    }

    onClickCrear = async () => {
        try {
            const resp: any = await this.recursoService.setRecurso(this.recurso)();

            this.utilsService.showModal(
                resp.control.codigo
            )(
                resp.control.descripcion
            )(
                () => this.router.navigate(['/pages/tablas/formas-pago'])
            )();
        }
        catch(ex) {
            this.utilsService.decodeErrorResponse(ex);
        }
    }

}
