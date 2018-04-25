import { Component } from '@angular/core';
import { DataTablesService } from '../../../reusable/tables/dataTables/dataTables.service';
import { UsuariosService } from '../../../../services/usuariosService';
import { LocalStorageService } from '../../../../services/localStorageService';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { Usuario } from 'app/models/usuario';
import { UtilsService } from '../../../../services/utilsService';

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
        private router: Router,
        private utilsService: UtilsService
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
        // Obtengo la lista de usuarios
        this.dataUsuarios = this.usuariosService.getUsuariosList();
    }

    /**
     * Redireciona a la pagina de editar
     */
    onClickEdit = (usuario) => {
        console.log(usuario);
        // Redirecciono al dashboard
        this.router.navigate(['/pages/tablas/usuarios/editar-usuario', usuario.idUsuario]);
    }

    /**
     * Borra el usuario y muestra un mensajito avisando tal accion
     */
    onClickRemove = async(usuario) => {
        console.log(usuario);
        
        // Pregunto si está seguro
        this.utilsService.showModal(
            'Borrar usuario'
        )(
            '¿Estás seguro de borrar el usuario?'
        )(
           async () => {
                // Borro usuario
                const respUsuarioBorrado = await this.usuariosService.removeUsuario(usuario);     
            }
        )({
            tipoModal: 'confirmation'
        });
    }

}
