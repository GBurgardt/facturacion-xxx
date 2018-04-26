import { Component, Input } from '@angular/core';
import { environment } from 'environments/environment';
import { UtilsService } from '../../../../../../services/utilsService';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Rubro } from '../../../../../../models/rubro';
import { RubrosService } from 'app/services/rubrosService';

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
        private rubrosService: RubrosService
    ) {
        this.route.params.subscribe(params => 
            this.rubrosService.getRubroById(parseInt(params.idRubro)).subscribe(rubro =>{
                this.recurso = rubro;
            })
        );
    }

    onClickEditar = async() => {
        try {
            // Edito el usuario seleccionado
            const respuestaEdicion: any = await this.rubrosService.editarRubro(
                this.recurso
            );
    
            // Muestro mensaje de okey y redirecciono a la lista de tipos de comprobantes
            this.utilsService.showModal(
                respuestaEdicion.control.codigo
            )(
                respuestaEdicion.control.descripcion
            )(
                () => this.router.navigate(['/pages/tablas/tipos-comprobantes']) 
            )();
        }
        catch(ex) {
            console.log(ex);
            const errorBody = JSON.parse(ex['_body']);

            // Mostrar mensaje de error
            this.utilsService.showModal(errorBody.control.codigo)(errorBody.control.descripcion);
            
        }
    }

}
