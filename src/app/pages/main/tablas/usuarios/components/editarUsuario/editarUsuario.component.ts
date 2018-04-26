import { Component, Input } from '@angular/core';
import { UsuariosService } from '../../../../../../services/usuariosService';
import { LocalStorageService } from '../../../../../../services/localStorageService';
import { Usuario } from '../../../../../../models/usuario';
import { Sucursal } from 'app/models/sucursal';
import { Perfil } from '../../../../../../models/perfil';
import { environment } from 'environments/environment';
import { UtilsService } from '../../../../../../services/utilsService';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'editar-usuario',
    styleUrls: ['./editarUsuario.scss'],
    templateUrl: './editarUsuario.html',
})
export class EditarUsuario {
    // TODO: Mapear bien sucursales y perfiles

    // Usuario que se va a editar
    usuarioEnEdicion: Usuario = new Usuario();

    // Sucursales de la empresa
    sucursales;

    // Perfiles disponible para tal sucursal
    perfiles;

    constructor(
        private usuariosService: UsuariosService,
        private utilsService: UtilsService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        // Obtengo las sucursales disponibles de la empresa
        this.sucursales = usuariosService.getSucursalesFromEmpresa();
        
        // Busco el id del usuario a editar en la ruta
        this.route.params.subscribe(params => 
            // Obtengo el usuario que se va a editar
            this.usuariosService.getUsuarioById(parseInt(params.idUsuario)).subscribe(usuario =>{
                this.usuarioEnEdicion = usuario;
                console.log('this.usuarioEnEdicion');
                console.log(this.usuarioEnEdicion);
            })
        );

    }

    /**
     * Se dispara cuando se cambia la sucursal en el dropdown
     * @param event 
     */
    changeSucursal(event) {
        this.perfiles = this.usuariosService.getPerfilesFromSucursal(
            this.usuarioEnEdicion.perfil.sucursal
        );
    }

    /**
     * Se dispara cuando se cambia la sucursal en el dropdown
     * @param event 
     */
    changePerfil(event) {
        console.log(this.usuarioEnEdicion.perfil.sucursal);
    }

    /**
     * Finaliza la creacion del user
     */
    onClickEditarUsuario = async() => {
        
        //console.log(this.usuarioEnEdicion);

        try {
            // Edito el usuario seleccionado
            const respUsuarioEditado = await this.usuariosService.editarUsuario(
                this.usuarioEnEdicion
            );
    
            // Muestro mensaje de okey y redirecciono a la lista de usuarios
            this.utilsService.showModal(
                respUsuarioEditado.control.codigo
            )(
                respUsuarioEditado.control.descripcion
            )(
                () => this.router.navigate(['/pages/tablas/usuarios']) 
            )();
        }
        catch(ex) {
            console.log(ex);
            const errorBody = JSON.parse(ex['_body']);

            // Mostrar mensaje de error
            this.utilsService.showModal(errorBody.control.codigo)(errorBody.control.descripcion);
            
        }
    }

}
