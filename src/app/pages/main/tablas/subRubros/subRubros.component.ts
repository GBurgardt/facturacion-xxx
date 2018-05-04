import { Component } from '@angular/core';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { UtilsService } from '../../../../services/utilsService';

import { Rubro } from 'app/models/rubro';

import { SubRubro } from '../../../../models/subRubro';
import { RecursoService } from 'app/services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'sub-rubros',
    styleUrls: ['./subRubros.scss'],
    templateUrl: './subRubros.html'
})
export class SubRubros {

    // Data de la tabla
    tableData: Observable<SubRubro[]>;

    // Columnas de la tabla
    tableColumns;

    constructor(
        private recursoService: RecursoService,
        private router: Router,
        private utilsService: UtilsService
    ) {
        // Guardo las columnas de la tabla con sus respectivas anchuras
        this.tableColumns = [
            {
                nombre: 'ID sub rubro',
                key: 'idSubRubro',
                ancho: '30%'
            },
            {
                nombre: 'descripcion',
                key: 'descripcion',
                ancho: '30%'
            },
            {
                nombre: 'ID rubro',
                key: 'rubro',
                subkey: 'idRubro',
                ancho: '30%'
            }
        ]
        
        this.tableData = this.recursoService.getRecursoList(resourcesREST.subRubros)();
    }

    onClickEdit = (recurso: SubRubro) => {   
        this.router.navigate(['/pages/tablas/sub-rubros/editar', recurso.idSubRubro]);
    }

    onClickRemove = async(recurso: SubRubro) => {
        this.utilsService.showModal(
            'Borrar sub rubro'
        )(
            '¿Estás seguro de borrar el sub rubro?'
        )(
           async () => {
                const resp = await this.recursoService.borrarRecurso(recurso.idSubRubro)(resourcesREST.subRubros);
                
                this.tableData = this.recursoService.getRecursoList(resourcesREST.subRubros)();
            }
        )({
            tipoModal: 'confirmation'
        });
    }

}
