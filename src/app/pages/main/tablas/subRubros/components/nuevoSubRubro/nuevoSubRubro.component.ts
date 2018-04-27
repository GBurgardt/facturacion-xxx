import { Component, Input } from '@angular/core';

import { environment } from 'environments/environment';
import { UtilsService } from '../../../../../../services/utilsService';
import { Router } from '@angular/router';
import { RubrosService } from '../../../../../../services/rubrosService';
import { SubRubro } from 'app/models/subRubro';
import { SubRubrosService } from '../../../../../../services/subRubrosService';
import { Rubro } from 'app/models/rubro';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'nuevo-sub-rubro',
    styleUrls: ['./nuevoSubRubro.scss'],
    templateUrl: './nuevoSubRubro.html',
})

export class NuevoSubRubro {
    recurso: SubRubro = new SubRubro();

    rubros: Observable<Rubro[]>;

    constructor(
        private subRubrosService: SubRubrosService,
        private utilsService: UtilsService,
        private router: Router,
        private rubrosService: RubrosService
    ) {
        // Cargo lo rubros disponibles
        this.rubros = this.rubrosService.getRubrosList();
    }

    onClickCrearRubro = async () => {
        try {
            
            const respRubroCreado: any = await this.subRubrosService.registrarSubRubro(
                this.recurso
            );
    
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
