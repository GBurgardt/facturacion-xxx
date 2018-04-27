import { Component } from '@angular/core';
import { LocalStorageService } from '../../../../services/localStorageService';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { UtilsService } from '../../../../services/utilsService';
import { RubrosService } from '../../../../services/rubrosService';
import { Rubro } from 'app/models/rubro';

@Component({
    selector: 'rubros',
    styleUrls: ['./rubros.scss'],
    templateUrl: './rubros.html'
})
export class Rubros {

    // Data de la tabla
    tableData;

    // Columnas de la tabla
    tableColumns;

    constructor(
        private rubrosService: RubrosService,
        private router: Router,
        private utilsService: UtilsService
    ) {
        // Guardo las columnas de la tabla con sus respectivas anchuras
        this.tableColumns = [
            {
                nombre: 'descripcion',
                key: 'descripcion',
                ancho: '30%'
            },
            {
                nombre: 'empresa',
                key: 'empresa',
                subkey: 'nombre',
                ancho: '30%'
            },
            {
                nombre: 'cuit empresa',
                key: 'empresa',
                subkey: 'cuit',
                ancho: '30%'
            }
        ]
        
        this.tableData = this.rubrosService.getRubrosList();
    }

    onClickEdit = (rubro: Rubro) => {   
        this.router.navigate(['/pages/tablas/rubros/editar', rubro.idRubro]);
    }

    onClickRemove = async(usuario) => {
        this.utilsService.showModal(
            'Borrar rubro'
        )(
            '¿Estás seguro de borrar el rubro?'
        )(
           async () => {
                const respRubro = await this.rubrosService.removeRubro(usuario);     
                
                this.tableData = this.rubrosService.getRubrosList();
            }
        )({
            tipoModal: 'confirmation'
        });
    }

}
