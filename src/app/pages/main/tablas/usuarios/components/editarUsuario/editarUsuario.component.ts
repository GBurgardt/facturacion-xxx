import { Component, Input, HostListener } from '@angular/core';

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
import { ListaPrecio } from 'app/models/listaPrecio';

@Component({
    selector: 'editar-usuario',
    styleUrls: ['./editarUsuario.scss'],
    templateUrl: './editarUsuario.html',
})
export class EditarUsuario {
    // Usuario que se va a editar
    recurso: Usuario = new Usuario();
    recursoOriginal: Usuario = new Usuario();

    // Sucursales de la empresa
    sucursales: Observable<Sucursal[]>;

    // Perfiles disponible para tal sucursal
    perfiles: Observable<Perfil[]>;

    listasPrecios: Observable<ListaPrecio[]>;

    constructor(
        public utilsService: UtilsService,
        private router: Router,
        private route: ActivatedRoute,
        private recursoService: RecursoService,
        private localStorageService: LocalStorageService
    ) {
        // Obtengo las sucursales disponibles de la empresa
        this.sucursales = recursoService.getRecursoList(resourcesREST.sucursales)();

        this.listasPrecios = this.recursoService.getRecursoList(resourcesREST.listaPrecios)();
        
        // Busco el id del usuario a editar en la ruta
        this.route.params.subscribe(params => {
            
            // Obtengo el usuario que se va a editar
            this.recursoService.getRecursoList(resourcesREST.usuarios)()
                .map((recursoList: Usuario[]) =>
                    recursoList.find(usuario => usuario.idUsuario === parseInt(params.idUsuario))
                )
                .subscribe(usuario =>{
                    this.recurso = usuario;
                    this.recursoOriginal = usuario;
        
                    // Obtengo los perfiles disponibles de la sucursal del usuario
                    this.perfiles = this.recursoService.getRecursoList(
                        resourcesREST.perfiles
                    )({
                        sucursal: this.recurso.perfil.sucursal.idSucursal
                    });
                });   
        });
        
    }

    
    ngOnInit() {
        this.recursoService.setEdicionFinalizada(false);
    }

    // Si NO finalizó la edición, y SI editó el recurso..
    @HostListener('window:beforeunload')
    canDeactivate = () => 
        this.recursoService.getEdicionFinalizada() ||
        this.recursoService.checkIfEquals(this.recurso, this.recursoOriginal);

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

}
