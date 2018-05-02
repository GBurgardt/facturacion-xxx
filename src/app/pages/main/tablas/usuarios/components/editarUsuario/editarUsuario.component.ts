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
import { RecursoService } from '../../../../../../services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';

import * as crypto from 'crypto-js';

@Component({
    selector: 'editar-usuario',
    styleUrls: ['./editarUsuario.scss'],
    templateUrl: './editarUsuario.html',
})
export class EditarUsuario {
    // Usuario que se va a editar
    recurso: Usuario = new Usuario();

    // Sucursales de la empresa
    sucursales: Observable<Sucursal[]>;

    // Perfiles disponible para tal sucursal
    perfiles: Observable<Perfil[]>;

    constructor(
        private utilsService: UtilsService,
        private router: Router,
        private route: ActivatedRoute,
        private recursoService: RecursoService,
        private localStorageService: LocalStorageService
    ) {
        // Obtengo las sucursales disponibles de la empresa
        this.sucursales = recursoService.getRecursoList(resourcesREST.sucursales)();
        
        // Busco el id del usuario a editar en la ruta
        this.route.params.subscribe(params => {
            
            // Obtengo el usuario que se va a editar
            this.recursoService.getRecursoList(resourcesREST.usuarios)()
                .map((recursoList: Usuario[]) =>
                    recursoList.find(usuario => usuario.idUsuario === parseInt(params.idUsuario))
                )
                .subscribe(usuario =>{
                    this.recurso = usuario;
        
                    // Obtengo los perfiles disponibles de la sucursal del usuario
                    this.perfiles = this.recursoService.getRecursoList(
                        resourcesREST.perfiles
                    )({
                        sucursal: this.recurso.perfil.sucursal.idSucursal
                    });
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
        this.perfiles = this.recursoService.getRecursoList(
            resourcesREST.perfiles
        )({
            sucursal: this.recurso.perfil.sucursal.idSucursal
        });
    }

    /**
     * Finaliza la creacion del user
     */
    onClickEditarUsuario = async() => {
        
        //console.log(this.usuarioEnEdicion);

        try {
            // Edito el usuario seleccionado
            const resp = await this.recursoService.editarRecurso(
                this.recurso
            )({
                clave: crypto.MD5(this.recurso.clave),
                token: this.localStorageService.getObject(environment.localStorage.acceso).token
            });


            // Muestro mensaje de okey y redirecciono a la lista de usuarios
            this.utilsService.showModal(
                resp.control.codigo
            )(
                resp.control.descripcion
            )(
                () => this.router.navigate(['/pages/tablas/usuarios']) 
            )();
        }
        catch(ex) {
            this.utilsService.decodeErrorResponse(ex);
            
        }
    }

}
