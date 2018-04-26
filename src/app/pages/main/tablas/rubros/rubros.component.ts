import { Component } from '@angular/core';
import { DataTablesService } from '../../../reusable/tablas/dataTables/dataTables.service';
import { UsuariosService } from '../../../../services/usuariosService';
import { LocalStorageService } from '../../../../services/localStorageService';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { Usuario } from 'app/models/usuario';
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
        private service: DataTablesService,
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

    /**
     * Redireciona a la pagina de editar
     */
    onClickEdit = (rubro: Rubro) => {
       
        this.router.navigate(['/pages/tablas/rubros/editar', rubro.idRubro]);
    }

    /**
     * Borra el usuario y muestra un mensajito avisando tal accion
     */
    onClickRemove = async(usuario) => {
        
        // Pregunto si está seguro
        this.utilsService.showModal(
            'Borrar usuario'
        )(
            '¿Estás seguro de borrar el usuario?'
        )(
           async () => {
                // Borro usuario
                //const respUsuarioBorrado = await this.usuariosService.removeUsuario(usuario);     
                
                // Obtengo la lista de usuarios actualizada
                //this.dataTipoComprobantes = this.usuariosService.getUsuariosList();
            }
        )({
            tipoModal: 'confirmation'
        });
    }

}
