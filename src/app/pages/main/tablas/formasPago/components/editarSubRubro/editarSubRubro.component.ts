import { Component, Input } from '@angular/core';
import { environment } from 'environments/environment';
import { UtilsService } from '../../../../../../services/utilsService';
import { Router, ActivatedRoute } from '@angular/router';


import { SubRubro } from '../../../../../../models/subRubro';
import { SubRubrosService } from '../../../../../../services/subRubrosService';
import { Rubro } from 'app/models/rubro';

@Component({
    selector: 'editar-sub-rubro',
    styleUrls: ['./editarSubRubro.scss'],
    templateUrl: './editarSubRubro.html',
})
export class EditarSubRubro {
    recurso: SubRubro = new SubRubro();

    constructor(
        private utilsService: UtilsService,
        private router: Router,
        private route: ActivatedRoute,
        private subRubrosService: SubRubrosService
    ) {
        this.route.params.subscribe(params => 
            this.subRubrosService.getSubRubroById(parseInt(params.idSubRubro)).subscribe(recurso =>{
                this.recurso = recurso;
            })
        );
    }

    onClickEditar = async() => {
        try {
            const respuestaEdicion: any = await this.subRubrosService.editarSubRubro(
                this.recurso
            );
    
            this.utilsService.showModal(
                respuestaEdicion.control.codigo
            )(
                respuestaEdicion.control.descripcion
            )(
                () => this.router.navigate(['/pages/tablas/sub-rubros']) 
            )();
        }
        catch(ex) {
            this.utilsService.decodeErrorResponse(ex);
            
        }
    }

}
