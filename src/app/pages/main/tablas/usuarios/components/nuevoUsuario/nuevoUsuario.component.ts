import { Component } from '@angular/core';
import { UsuariosService } from '../../../../../../services/usuariosService';
import { LocalStorageService } from '../../../../../../services/localStorageService';
import { Usuario } from '../../../../../../models/usuario';
import { Sucursal } from 'app/models/sucursal';
import { Perfil } from '../../../../../../models/perfil';
import { environment } from 'environments/environment';

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
        contrasena: string;
        telefono: string;
        sucursal: Sucursal;
        perfil: Perfil;
    };

    constructor(
        private usuariosService: UsuariosService,
        private localStorageService: LocalStorageService
    ) {
        // Obtengo las sucursales disponibles de la empresa
        this.sucursales = usuariosService.getSucursalesFromEmpresa(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        );

        // Inicializo en null la sucursal y el perfil
        this.infoNewUser = {nombre: null, email: null, contrasena: null, telefono: null, sucursal: null, perfil: null};
    }

    /**
     * Se dispara cuando se cambia la sucursal en el dropdown
     * @param event 
     */
    changeSucursal(event) {
        this.perfiles = this.usuariosService.getPerfilesFromSucursal(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        )(
            this.infoNewUser.sucursal.idSucursal
        );
    }

    /**
     * Finaliza la creacion del user
     */
    onClickCrearUsuario = () => {
        console.log(this.infoNewUser);
    }

}
