import { Component, Input } from '@angular/core';

import { environment } from 'environments/environment';
import { UtilsService } from '../../../../../../services/utilsService';
import { Router } from '@angular/router';

import { SubRubro } from 'app/models/subRubro';

import { Rubro } from 'app/models/rubro';
import { Observable } from 'rxjs/Observable';
import { RecursoService } from '../../../../../../services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';

@Component({
    selector: 'nuevo-sub-rubro',
    styleUrls: ['./nuevoSubRubro.scss'],
    templateUrl: './nuevoSubRubro.html',
})

export class NuevoSubRubro {
    recurso: SubRubro = new SubRubro();

    rubros: Observable<Rubro[]>;

    constructor(
        private recursoService: RecursoService,
        private utilsService: UtilsService,
        private router: Router
    ) {
        // Cargo lo rubros disponibles
        this.rubros = this.recursoService.getRecursoList(resourcesREST.rubros)();
    }

    onClickCrearRubro = async () => {
        try {

            const respRubroCreado: any = await this.recursoService.setRecurso(this.recurso)();

            this.utilsService.showModal(
                respRubroCreado.control.codigo
            )(
                respRubroCreado.control.descripcion
            )(
                () => this.router.navigate(['/pages/tablas/sub-rubros'])
            )();
        }
        catch(ex) {
            this.utilsService.decodeErrorResponse(ex);
        }
    }

}
