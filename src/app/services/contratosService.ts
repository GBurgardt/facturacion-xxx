import { Injectable } from "@angular/core";
import { AuthService } from "./authService";
import { environment } from "environments/environment";
import { Observable } from "rxjs";
import { LocalStorageService } from "./localStorageService";
import { UtilsService } from "./utilsService";
import { BoundCallbackObservable } from "rxjs/observable/BoundCallbackObservable";
import { FilesService } from "./filesService";



@Injectable()
export class ContratosService {
    
    constructor(
        private authService: AuthService,
        private localStorageService: LocalStorageService,
        private utilsService: UtilsService,
        private filesService: FilesService
    ) { }

    /**
    * Graba el contrato
    */
    grabarContrato = (file, recurso, callbackRouter) => {
        let reader = new FileReader();

        reader.onload = (
            p => (e) => {

                // Acá haces la request AJAX

                // Por ejemplo, yo hago esta:
                this.authService.grabarContrato(
                    e.target.result,
                    recurso,
                    this.localStorageService.getObject(environment.localStorage.acceso).token
                )
                .catch(err => {
                    this.utilsService.showErrorWithBody(err);

                    return Observable.of({
                        arraydatos: []
                    });
                })
                .subscribe(resp => {
                    this.utilsService.showModal(
                        resp.control.codigo
                    )(
                        resp.control.descripcion
                    )(
                        () => {
                            callbackRouter()
                        }
                    )();
                })
            }
        )(file);

        reader.readAsArrayBuffer(file);
    }

    /**
    * Edita el contrato
    */
    editarContrato = (file, recurso, callbackRouter) => {
        var reader = new FileReader();

        const completarEdicion = (result) => {
            this.authService.editarContrato(
                result,
                recurso,
                this.localStorageService.getObject(environment.localStorage.acceso).token
            )
            .catch(err => {
                this.utilsService.showErrorWithBody(err);

                return Observable.of({
                    arraydatos: []
                });
            })
            .subscribe(resp => {
                this.utilsService.showModal(
                    resp.control.codigo
                )(
                    resp.control.descripcion
                )(
                    () => {
                        callbackRouter()
                    }
                )();
            })
        }

        if (file) {
            reader.onload = (
                p => (e) => {
                    completarEdicion(e.target.result)
                }
            )(file);
    
            reader.readAsArrayBuffer(file);
        } else {
            completarEdicion(null)
        }

    }


    generarContrato = (file) => {
        var reader = new FileReader();

        reader.onload = (
            p => (e) => {
                this.filesService.generateDoc(e.target.result, {
                    test: 'testVar'
                })
            }
        )(file);

        reader.readAsArrayBuffer(file);
    }


    downloadContrato = (idContrato) => {
        return this.authService.downloadContrato(
            this.localStorageService.getObject(environment.localStorage.acceso).token,
            idContrato
        )
    }
}