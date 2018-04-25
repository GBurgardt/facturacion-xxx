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

    // Info del usuario a crear
    infoNewUser: {
        nombre: string;
        email: string;
        clave: string;
        telefono: string;
        sucursal: Sucursal;
        perfil: Perfil;
    };

    constructor(
        private usuariosService: UsuariosService,
        private utilsService: UtilsService,
        private router: Router
    ) {
        // Obtengo las sucursales disponibles de la empresa
        this.sucursales = usuariosService.getSucursalesFromEmpresa();

        // Inicializo en null la sucursal y el perfil
        this.infoNewUser = {nombre: null, email: null, clave: null, telefono: null, sucursal: null, perfil: null};
    }

    /**
     * Se dispara cuando se cambia la sucursal en el dropdown
     * @param event 
     */
    changeSucursal(event) {
        this.usuariosService.getPerfilesFromSucursal(
            this.infoNewUser.perfil.sucursal.idSucursal
        ).subscribe(a=>{
            console.log(a);
            debugger;
        });
        // this.perfiles = this.usuariosService.getPerfilesFromSucursal(
        //     this.infoNewUser.perfil.sucursal.idSucursal
        // );
    }

    /**
     * Finaliza la creacion del user
     */
    onClickCrearUsuario = async () => {
        
        try {
            // Creo el usuario nuevo
            const respUsuarioCreado = await this.usuariosService.registrarUsuario(
                this.infoNewUser
            );
    
            // Muestro mensaje de okey y redirecciono a la lista de usuarios
            this.utilsService.showModal(
                respUsuarioCreado.control.codigo
            )(
                respUsuarioCreado.control.descripcion
            )(
                () => this.router.navigate(['/pages/tablas/usuarios']) 
            );
        }
        catch(ex) {
            const errorBody = JSON.parse(ex['_body']);

            // Mostrar mensaje de error
            this.utilsService.showModal(errorBody.control.codigo)(errorBody.control.descripcion);
            
        }
    }

}
