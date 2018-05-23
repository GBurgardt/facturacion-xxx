import { Component, Input } from '@angular/core';
import { LocalStorageService } from '../../../../../../services/localStorageService';
import { environment } from 'environments/environment';
import { UtilsService } from '../../../../../../services/utilsService';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { TipoComprobante } from '../../../../../../models/tipoComprobante';

import { RecursoService } from '../../../../../../services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';
import { SisComprobante } from 'app/models/sisComprobante';

@Component({
    selector: 'editar-tipo-comprobante',
    styleUrls: ['./editarTipoComprobante.scss'],
    templateUrl: './editarTipoComprobante.html',
})
export class EditarTipoComprobante {

    // Usuario que se va a editar
    recurso: TipoComprobante = new TipoComprobante();

    sisComprobantes: Observable<SisComprobante[]>;

    constructor(
        private utilsService: UtilsService,
        private router: Router,
        private route: ActivatedRoute,
        private recursoService: RecursoService
    ) {
        this.route.params.subscribe(params =>
            this.recursoService.getRecursoList(resourcesREST.cteTipo)()
                .map((recursoList: TipoComprobante[]) =>
                    recursoList.find(recurso => recurso.idCteTipo === parseInt(params.idTipoComprobante))
                )
                .subscribe(recurso =>{
                    this.recurso = recurso;
                })
        );

        this.sisComprobantes = this.recursoService.getRecursoList(resourcesREST.sisComprobantes)();

    }

    /**
     * Editar
     */
    onClickEditarTipoComprobante = async() => {
        try {
            // Edito el usuario seleccionado
            const resp = await this.recursoService.editarRecurso(this.recurso)();

            // Muestro mensaje de okey y redirecciono a la lista de tipos de comprobantes
            this.utilsService.showModal(
                resp.control.codigo
            )(
                resp.control.descripcion
            )(
                () => this.router.navigate(['/pages/tablas/tipos-comprobantes'])
            )();
        }
        catch(ex) {
            this.utilsService.decodeErrorResponse(ex);

        }
    }

}
