import { Component, Input } from '@angular/core';
import { environment } from 'environments/environment';
import { UtilsService } from '../../../../../../services/utilsService';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Rubro } from '../../../../../../models/rubro';

import { RecursoService } from 'app/services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';

@Component({
    selector: 'editar-rubro',
    styleUrls: ['./editarRubro.scss'],
    templateUrl: './editarRubro.html',
})
export class EditarRubro {
    recurso: Rubro = new Rubro();

    constructor(
        private utilsService: UtilsService,
        private router: Router,
        private route: ActivatedRoute,
        private recursoService: RecursoService
    ) {
        this.route.params.subscribe(params => 
            this.recursoService.getRecursoList(resourcesREST.rubros)()
                .map((recursoList: Rubro[]) =>
                    recursoList.find(recurso => recurso.idRubro === parseInt(params.idRubro))
                )
                .subscribe(recurso =>{
                    this.recurso = recurso;
                })
        );
    }

    onClickEditar = async() => {
        try {
            const respuestaEdicion: any = await this.recursoService.editarRecurso(
                this.recurso
            )();
    
            this.utilsService.showModal(
                respuestaEdicion.control.codigo
            )(
                respuestaEdicion.control.descripcion
            )(
                () => this.router.navigate(['/pages/tablas/rubros']) 
            )();
        }
        catch(ex) {
            this.utilsService.decodeErrorResponse(ex);
            
        }
    }

}
