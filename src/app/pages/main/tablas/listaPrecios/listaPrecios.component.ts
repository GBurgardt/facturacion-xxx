import { Component } from '@angular/core';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { UtilsService } from '../../../../services/utilsService';
import { Observable } from 'rxjs/Observable';
import { RecursoService } from '../../../../services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';

import { ListaPrecio } from '../../../../models/listaPrecio';

@Component({
    selector: 'lista-precios',
    styleUrls: ['./listaPrecios.scss'],
    templateUrl: './listaPrecios.html'
})
export class ListaPrecios {

    // Data de la tabla
    tableData: Observable<ListaPrecio[]>;

    // Columnas de la tabla
    tableColumns;

    constructor(
        private recursoService: RecursoService,
        private router: Router,
        private utilsService: UtilsService
    ) {
        this.tableColumns = [
            {
                nombre: 'codigo',
                key: 'codigoDep',
                ancho: '22%'
            },
            {
                nombre: 'descripcion',
                key: 'descripcion',
                ancho: '22%'
            },
            {
                nombre: 'domicilio',
                key: 'domicilio',
                ancho: '22%'
            },
            {
                nombre: 'codigo postal',
                key: 'codigoPostal',
                ancho: '22%'
            }
        ]

        this.tableData = this.recursoService.getRecursoList(resourcesREST.listaPrecios)();
    }

    onClickEdit = (recurso: ListaPrecio) => {
        this.router.navigate(['/pages/tablas/listaPrecios/editar', recurso.idListaPrecio]);
    }

    onClickRemove = async(recurso: ListaPrecio) => {
        this.utilsService.showModal(
            'Borrar lista de precio'
        )(
            '¿Estás seguro de borrar la lista de precios?'
        )(
           async () => {
                const resp = await this.recursoService.borrarRecurso(recurso.idListaPrecio)(resourcesREST.listaPrecios);

                this.tableData = this.recursoService.getRecursoList(resourcesREST.listaPrecios)();
            }
        )({
            tipoModal: 'confirmation'
        });
    }

}
