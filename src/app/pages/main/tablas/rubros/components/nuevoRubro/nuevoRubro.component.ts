import { Component, Input } from '@angular/core';

import { environment } from 'environments/environment';
import { UtilsService } from '../../../../../../services/utilsService';
import { Router } from '@angular/router';
import { Rubro } from '../../../../../../models/rubro';
import { RubrosService } from '../../../../../../services/rubrosService';

@Component({
    selector: 'nuevo-rubro',
    styleUrls: ['./nuevoRubro.scss'],
    templateUrl: './nuevoRubro.html',
})

export class NuevoRubro {
    recurso: Rubro = new Rubro();

    constructor(
        private rubroService: RubrosService,
        private utilsService: UtilsService,
        private router: Router
    ) { }

    onClickCrearRubro = async () => {
        try {
            
            const respRubroCreado: any = await this.rubroService.registrarRubro(
                this.recurso
            );
    
            this.utilsService.showModal(
                respRubroCreado.control.codigo
            )(
                respRubroCreado.control.descripcion
            )(
                () => this.router.navigate(['/pages/tablas/rubros']) 
            )();
        }
        catch(ex) {
            this.utilsService.decodeErrorResponse(ex);       
        }
    }

}
