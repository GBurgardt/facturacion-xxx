import { Injectable } from '@angular/core';
import { AuthService } from 'app/services/authService';
import { Sucursal } from '../models/sucursal';
import { Perfil } from 'app/models/perfil';
import { Usuario } from '../models/usuario';
import { LocalStorageService } from './localStorageService';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UsuariosService {

    constructor(
        private authService: AuthService,
        private localStorageService: LocalStorageService
    ) { }

    /**
     * Obtiene la lista de usuarios correspondiente
     */
    getUsuariosList = () => {
        const listaUsuarios: Observable<Usuario[]> = this.authService.getUsuariosList(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        ).map(listUsuarios => {
            return listUsuarios.arraydatos.map(usuario => {
                return new Usuario(usuario);
            })
        });

        return listaUsuarios;
    }

    /**
     * Obtiene los perfiles de una sucursal
     */
    getPerfilesFromSucursal =  (sucursal: Sucursal) => {
        console.log(sucursal);
        return this.authService.getPerfilesList(
                this.localStorageService.getObject(environment.localStorage.acceso).token, 
                sucursal.idSucursal
            ).map(  
                perfilesResp => {
                    
                    return perfilesResp.arraydatos.map(perfil => new Perfil(perfil));
                }
            );
    }

    /**
     * Obtiene las sucursales disponible de la empresa
     */
    getSucursalesFromEmpresa = () => {
        return this.authService.getSucursalesList(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        ).map(sucursalesResp => 
            sucursalesResp.arraydatos.map(sucursal => new Sucursal(sucursal))
        );
    }

    /**
     * Registra un nuevo usuario
     */
    registrarUsuario = (usuarioNuevo: Usuario) => {
        return this.authService.registrarUsuario(
            usuarioNuevo, 
            this.localStorageService.getObject(environment.localStorage.acceso).token
        );
    }

    /**
     * Edita un usuario existente
     */
    editarUsuario = (usuarioEditado: Usuario) => {
        return this.authService.editarUsuario(
            usuarioEditado, 
            this.localStorageService.getObject(environment.localStorage.acceso).token
        );
    }

    /**
     * Borra un usuario
     */
    removeUsuario = (usuarioABorrar: Usuario) => {
        return this.authService.removeUsuario(
            usuarioABorrar,
            this.localStorageService.getObject(environment.localStorage.acceso).token
        );
    }

    /**
     * Dado un idUsuario retorno un observable con el usuario correspondiente
     * @argument idUsuario idUsuario del usuario
     */
    getUsuarioById = (idUsuario: number) => {
        // Obtengo todos los users de la empresa actual y busco el usuario por el idUsuario
        return this.getUsuariosList().map((usuariosList: Usuario[]) =>
            usuariosList.find(usuario => usuario.idUsuario === idUsuario)
        );
    }

}