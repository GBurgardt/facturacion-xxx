import { Component } from '@angular/core';
import { DataTablesService } from '../../../reusable/tables/dataTables/dataTables.service';
import { UsuariosService } from '../../../../services/usuariosService';
import { LocalStorageService } from '../../../../services/localStorageService';
import { environment } from 'environments/environment';

@Component({
    selector: 'maps',
    // template: `<router-outlet></router-outlet>`
    styleUrls: ['./usuarios.scss'],
    templateUrl: './usuarios.html'
})
export class Usuarios {

    // Data de la tabla
    dataUsuarios;

    // Columnas de la tabla
    tableColumns;

    constructor(
        private service: DataTablesService,
        private usuariosService: UsuariosService,
        private localStorageService: LocalStorageService
    ) {
        // Guardo las columnas de la tabla con sus respectivas anchuras
        this.tableColumns = [
            {
                nombre: 'nombre',
                ancho: '30%'
            },
            {
                nombre: 'mail',
                ancho: '40%'
            },
            {
                nombre: 'telefono',
                ancho: '30%'
            }
        ]

        // Obtengo el token activo
        const accesoActivo = this.localStorageService.getObject(environment.localStorage.acceso);

        // Obtengo la lista de usuarios
        this.dataUsuarios = this.usuariosService.getUsuariosList(accesoActivo.token);
    }

}
