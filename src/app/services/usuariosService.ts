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
            resourcesREST.usuarios
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
            resourcesREST.perfiles
        )({
            idSucursal: sucursal.idSucursal
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
        return this.authService.getSucursalesList(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        ).map(sucursalesResp => 
            sucursalesResp.arraydatos.map(sucursal => new Sucursal(sucursal))
        );
    }

    /**
     * Registra un nuevo usuario
     */
    registrarUsuario = (recurso: Usuario) => {

        if (!this.utilsService.validateEmail(recurso.email)) {
            return this.utilsService.getPromiseErrorResponse('Error')('Email invalido');
        } else {
            return this.authService.registrarUsuario(
                recurso, 
                this.localStorageService.getObject(environment.localStorage.acceso).token
            );
        }
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
    removeUsuario = (recurso: Usuario) => {
        return this.authService.removeRecurso(
            recurso
        )(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        )(
            resourcesREST.usuarios
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