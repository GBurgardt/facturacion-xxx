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
    sucursales: Observable<Sucursal[]>;

    // Perfiles disponible para tal sucursal
    perfiles: Observable<Perfil[]>;

    constructor(
        private usuariosService: UsuariosService,
        private utilsService: UtilsService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        // Obtengo las sucursales disponibles de la empresa
        this.sucursales = usuariosService.getSucursalesFromEmpresa();
        
        // Busco el id del usuario a editar en la ruta
        this.route.params.subscribe(params => {
            
            // Obtengo el usuario que se va a editar
            this.usuariosService.getUsuarioById(parseInt(params.idUsuario)).subscribe(usuario =>{
                this.usuarioEnEdicion = usuario;
    
                // Obtengo los perfiles disponibles de la sucursal del usuario
                this.perfiles = usuariosService.getPerfilesFromSucursal(this.usuarioEnEdicion.perfil.sucursal)
            });   
        });
        
    }

    compareWithSucursal(item1: Sucursal, item2: Sucursal) {
        return item1.idSucursal === item2.idSucursal;
    }

    compareWithPerfil(item1: Perfil, item2: Perfil) {
        return item1.idPerfil === item2.idPerfil;
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
     * Se dispara cuando se cambia el perfil en el dropdown
     * @param event 
     */
    changePerfil(event) {
        //console.log(this.usuarioEnEdicion.perfil.sucursal);
        //console.log(this.usuarioEnEdicion);
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
            this.utilsService.decodeErrorResponse(ex);
            
        }
    }

}
