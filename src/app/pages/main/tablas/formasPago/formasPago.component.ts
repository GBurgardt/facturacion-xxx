import { Component } from '@angular/core';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { UtilsService } from '../../../../services/utilsService';

import { Rubro } from 'app/models/rubro';
import { SubRubrosService } from '../../../../services/subRubrosService';
import { FormaPago } from '../../../../models/formaPago';
import { FormaPagoService } from '../../../../services/formaPagoService';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'formas-pago',
    styleUrls: ['./formasPago.scss'],
    templateUrl: './formasPago.html'
})
export class FormasPago {

    // Data de la tabla
    tableData: Observable<FormaPago[]>;

    // Columnas de la tabla
    tableColumns;

    constructor(
        private formaPagoService: FormaPagoService,
        private router: Router,
        private utilsService: UtilsService
    ) {
        // Guardo las columnas de la tabla con sus respectivas anchuras
        this.tableColumns = [
            {
                nombre: 'descripcion',
                key: 'descripcion',
                ancho: '45%'
            },
            {
                nombre: 'tipo',
                key: 'tipo',
                subkey: 'descripcion',
                ancho: '45%'
            }
        ]
        
        this.tableData = this.formaPagoService.getList();
    }

    onClickEdit = (recurso: FormaPago) => {   
        this.router.navigate(['/pages/tablas/forma-pago/editar', recurso.idFormaPago]);
    }

    onClickRemove = async(recurso) => {
        this.utilsService.showModal(
            'Borrar forma de pago'
        )(
            '¿Estás seguro de borrarla'
        )(
           async () => {
                // const resp = await this.subRubrosService.removeSubRubro(recurso);     
                
                // this.tableData = this.subRubrosService.getSubRubrosList();
            }
        )({
            tipoModal: 'confirmation'
        });
    }

}
