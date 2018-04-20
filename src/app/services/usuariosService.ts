import { Injectable } from '@angular/core';
import { AuthService } from 'app/services/authService';
import { Sucursal } from '../models/sucursal';
import { Perfil } from 'app/models/perfil';

@Injectable()
export class UsuariosService {

    constructor(
        private authService: AuthService
    ) { }

    /**
     * Obtiene la lista de usuarios correspondiente
     */
    getUsuariosList = (token) => {

        // Mappeo solamente los datos que uso
        const listaUsuarios = this.authService.getUsuariosList(token).map(listUsuarios => {
            return listUsuarios.arraydatos.map(usuario => {
                return {
                    nombre: usuario.nombre,
                    mail: usuario.email,
                    telefono: usuario.telefono
                }
            })

        });

        return listaUsuarios;
    }

    /**
     * Obtiene los perfiles de una sucursal
     */
    getPerfilesFromSucursal = (token) => (idSucursal) => {
        return this.authService.getPerfilesList(token, idSucursal).map(perfilesResp => 
            perfilesResp.arraydatos.map(perfil => new Perfil(perfil))
        );
    }

    /**
     * Obtiene las sucursales disponible de la empresa
     */
    getSucursalesFromEmpresa = (token) => {
        return this.authService.getSucursalesList(token).map(sucursalesResp => 
            sucursalesResp.arraydatos.map(sucursal => new Sucursal(sucursal))
        );
    }



    // .then(resp => {
            
    //     const test = resp.arraydatos.map(dato => {
    //         return {
    //             nombre: dato.nombre,
    //             mail: dato.email,
    //             telefono: dato.telefono
    //         }
    //     });

    //     this.dataUsuarios = new Promise((resolve, reject) => {
    //         setTimeout(() => {
    //             resolve(test);
    //         }, 2000);
    //     });

        
        
    // });

}