import { Injectable } from '@angular/core';
import { AuthService } from 'app/services/authService';
import { LocalStorageService } from './localStorageService';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/Observable';
import { resourcesREST } from 'constantes/resoursesREST';
import { Rubro } from '../models/rubro';

@Injectable()
export class RubrosService {

    constructor(
        private authService: AuthService,
        private localStorageService: LocalStorageService
    ) { }


    getRubrosList = () => {
        const listaRubros: Observable<Rubro[]> = this.authService.getResource(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        )(
            resourcesREST.rubros
        ).map(listRubros => {
            return listRubros.arraydatos.map(rubro => {
                return new Rubro(rubro);
            })
        });

        return listaRubros;
    }

    getRubroById = (idRubro: number) => {
        return this.getRubrosList().map((rubrosList: Rubro[]) =>
            rubrosList.find(rubro => rubro.idRubro === idRubro)
        );
    }

    
    editarRubro = (rubroEditado: Rubro) => {
        // return this.authService.editarRubro(
        //     tipoComprobanteEditado, 
        //     this.localStorageService.getObject(environment.localStorage.acceso).token
        // );
    }

    registrarRubro = (rubro: Rubro) => {
        return this.authService.registrarRubro(
            rubro, 
            this.localStorageService.getObject(environment.localStorage.acceso).token
        );
    }

}