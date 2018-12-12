import { Component, HostListener } from '@angular/core';

import { LocalStorageService } from '../../../../../../services/localStorageService';
import { Usuario } from '../../../../../../models/usuario';
import { Sucursal } from 'app/models/sucursal';
import { Perfil } from '../../../../../../models/perfil';
import { environment } from 'environments/environment';
import { UtilsService } from '../../../../../../services/utilsService';
import { Router } from '@angular/router';
import { isString } from 'util';
import { RecursoService } from '../../../../../../services/recursoService';

// Libreria para encriptar en MD5 la clave
import * as crypto from 'crypto-js';
import { resourcesREST } from 'constantes/resoursesREST';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'nuevo-usuario',
    styleUrls: ['./nuevoUsuario.scss'],
    templateUrl: './nuevoUsuario.html',
})
// export class NuevoUsuario implements PendingChangeComponent {
export class NuevoUsuario {
    // Sucursales de la empresa
    sucursales: Observable<Sucursal[]>;

    // Perfiles disponible para tal sucursal
    perfiles: Observable<Perfil[]>;

    // Usuario nuevo
    usuarioNuevo: Usuario = new Usuario();

    constructor(
        public utilsService: UtilsService,
        private router: Router,
        private recursoService: RecursoService,
        private localStorageService: LocalStorageService
    ) {
        this.sucursales = recursoService.getRecursoList(resourcesREST.sucursales)();
    }

    ngOnInit() {
        this.recursoService.setEdicionFinalizada(false);
    }

    @HostListener('window:beforeunload')
    canDeactivate = () => 
        this.recursoService.checkIfEquals(this.usuarioNuevo, new Usuario()) || 
        this.recursoService.getEdicionFinalizada();
    
    /**
     * Se dispara cuando se cambia la sucursal en el dropdown
     * @param event 
     */
    changeSucursal(event) {        
        this.perfiles = this.recursoService.getRecursoList(
            resourcesREST.perfiles
        )({
            sucursal: this.usuarioNuevo.perfil.sucursal.idSucursal
        });
    }

    /**
     * Finaliza la creacion del user
     */
    onClickCrearUsuario = async () => {
        
        try {
            // Creo el usuario nuevo
            const resp: any = await this.recursoService.setRecurso(
                this.usuarioNuevo
            )({
                clave: crypto.MD5(this.usuarioNuevo.clave),
                token: this.localStorageService.getObject(environment.localStorage.acceso).token
            });

            // Muestro mensaje de okey y redirecciono a la lista de usuarios
            this.utilsService.showModal(
                resp.control.codigo
            )(
                resp.control.descripcion
            )(
                () => {
                    this.router.navigate(['/pages/tablas/usuarios']);
                    this.recursoService.setEdicionFinalizada(true);
                }
            )();
        }
        catch(ex) {
            this.utilsService.decodeErrorResponse(ex);
        }
    }

    
    compareWithSucursal(item1: Sucursal, item2: Sucursal) {
        return item1.idSucursal === item2.idSucursal;
    }

    compareWithPerfil(item1: Perfil, item2: Perfil) {
        return item1.idPerfil === item2.idPerfil;
    }

}
