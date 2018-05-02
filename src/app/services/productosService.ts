import { Injectable } from '@angular/core';
import { AuthService } from 'app/services/authService';
import { LocalStorageService } from './localStorageService';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/Observable';
import { resourcesREST } from 'constantes/resoursesREST';


import { Producto } from '../models/producto';

@Injectable()
export class ProductosService {

    constructor(
        private authService: AuthService,
        private localStorageService: LocalStorageService
    ) { }


    getList = () => {
        const lista: Observable<Producto[]> = this.authService.getResourceList(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        )(
            resourcesREST.productos.nombre
        )().map(list => {
            return list.arraydatos.map(resource => {
                return new Producto(resource);
            })
        });

        return lista;
    }

    setRecurso = (recurso: Producto) => {
        return this.authService.registrarRecurso(
            recurso
        )({
            token: this.localStorageService.getObject(environment.localStorage.acceso).token
        })(
            resourcesREST.productos.nombre
        )
    }

    getIvaList = () => {
        return Observable.create();
    }

    // getSubRubroById = (idSubRubro: number) => {
    //     return this.getSubRubrosList().map((list: SubRubro[]) =>
    //         list.find(recurso => recurso.idSubRubro === idSubRubro)
    //     );
    // }

    
    // editarSubRubro = (recurso: SubRubro) => {
    //     return this.authService.editarSubRubro(
    //         recurso, 
    //         this.localStorageService.getObject(environment.localStorage.acceso).token
    //     );
    // }
    

    // removeSubRubro = (recurso: SubRubro) => {
    //     return this.authService.removeSubRubro(
    //         recurso,
    //         this.localStorageService.getObject(environment.localStorage.acceso).token
    //     );
    // }

}