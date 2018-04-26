import { Component } from '@angular/core';
import { UsuariosService } from '../../../../../../services/usuariosService';
import { LocalStorageService } from '../../../../../../services/localStorageService';
import { Usuario } from '../../../../../../models/usuario';
import { Sucursal } from 'app/models/sucursal';
import { Perfil } from '../../../../../../models/perfil';
import { environment } from 'environments/environment';
import { UtilsService } from '../../../../../../services/utilsService';
import { Router } from '@angular/router';

@Component({
    selector: 'nuevo-usuario',
    styleUrls: ['./nuevoUsuario.scss'],
    templateUrl: './nuevoUsuario.html',
})
export class NuevoUsuario {
    // Sucursales de la empresa
    sucursales;

    // Perfiles disponible para tal sucursal
    perfiles;

    // Usuario nuevo
    usuarioNuevo: Usuario = new Usuario();

    constructor(
        private usuariosService: UsuariosService,
        private utilsService: UtilsService,
        private router: Router
    ) {
        // Obtengo las sucursales disponibles de la empresa
        this.sucursales = usuariosService.getSucursalesFromEmpresa();

    }

    /**
     * Se dispara cuando se cambia la sucursal en el dropdown
     * @param event 
     */
    changeSucursal(event) {        
        this.perfiles = this.usuariosService.getPerfilesFromSucursal(
            this.usuarioNuevo.perfil.sucursal
        );
    }

    /**
     * Finaliza la creacion del user
     */
    onClickCrearUsuario = async () => {
        
        try {
            // Creo el usuario nuevo
            const respUsuarioCreado = await this.usuariosService.registrarUsuario(
                this.usuarioNuevo
            );
    
            // Muestro mensaje de okey y redirecciono a la lista de usuarios
            this.utilsService.showModal(
                respUsuarioCreado.control.codigo
            )(
                respUsuarioCreado.control.descripcion
            )(
                () => this.router.navigate(['/pages/tablas/usuarios']) 
            )();
        }
        catch(ex) {
            const errorBody = JSON.parse(ex['_body']);

            // Mostrar mensaje de error
            this.utilsService.showModal(errorBody.control.codigo)(errorBody.control.descripcion);
            
        }
    }

}
