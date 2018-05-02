import { Injectable } from '@angular/core';
import { AuthService } from 'app/services/authService';
import { Sucursal } from '../models/sucursal';
import { Perfil } from 'app/models/perfil';
import { Usuario } from '../models/usuario';
import { LocalStorageService } from './localStorageService';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/Observable';
import { UtilsService } from './utilsService';
import { resourcesREST } from 'constantes/resoursesREST';

// Libreria para encriptar en MD5 la clave
import * as crypto from 'crypto-js';

@Injectable()
export class UsuariosService {

    constructor(
        private authService: AuthService,
        private localStorageService: LocalStorageService,
        private utilsService: UtilsService
    ) { }

    /**
     * Obtiene la lista de usuarios correspondiente
     */
    getUsuariosList = () => {
        const lista: Observable<Usuario[]> = this.authService.getResourceList(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        )(
            resourcesREST.usuarios.nombre
        )().map(list => {
            return list.arraydatos.map(resource => {
                return new Usuario(resource);
            })
        });

        return lista;
    }

    /**
     * Obtiene los perfiles de una sucursal
     */
    getPerfilesFromSucursal = (sucursal: Sucursal) => {
        return this.authService.getResourceList(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        )(
            resourcesREST.perfiles.nombre
        )({
            sucursal: sucursal.idSucursal
        }).map(  
            perfilesResp => {
                return perfilesResp.arraydatos.map(perfil => new Perfil(perfil));
            }
        );
    }

    /**
     * Obtiene las sucursales disponible de la empresa
     */
    getSucursalesFromEmpresa = () => {
        return this.authService.getResourceList(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        )(
            resourcesREST.sucursales.nombre
        )().map(sucursalesResp => 
            sucursalesResp.arraydatos.map(sucursal => new Sucursal(sucursal))
        );
    }

    /**
     * Registra un nuevo usuario
     */
    registrarUsuario = (recurso: Usuario) => {
        return this.authService.registrarRecurso(
            recurso
        )({
            clave: crypto.MD5(recurso.clave),
            token: this.localStorageService.getObject(environment.localStorage.acceso).token
        })(
            resourcesREST.usuarios.nombre
        );
    }

    /**
     * Edita un usuario existente
     */
    editarUsuario = (recurso: Usuario) => {
        return this.authService.editarRecurso(
            recurso
        )({
            clave: crypto.MD5(recurso.clave),
            token: this.localStorageService.getObject(environment.localStorage.acceso).token
        })(
            resourcesREST.usuarios.nombre
        );
    }

    /**
     * Borra un usuario
     */
    removeUsuario = (recurso: Usuario) => {
        return this.authService.removeRecurso(
            recurso.idUsuario
        )(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        )(
            resourcesREST.usuarios.nombre
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