import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DefaultModal } from '../pages/reusable/modals/default-modal/default-modal.component';
import { AuthService } from './authService';
import { AppState } from 'app/app.service';
import { ConfirmationModal } from 'app/pages/reusable/modals/confirmation-modal/confirmation-modal.component';
import { isString } from 'util';
import dynamicClass from 'app/services/dynamicClassService';
import { resourcesREST } from 'constantes/resoursesREST';

@Injectable()
export class UtilsService {

    constructor(
        private modalService: NgbModal,
        private authService: AuthService,
        private appState: AppState
    ) { }

    /** TODO: Refactorizar este modal y poner bien el titulo y la descrip
     * Método que muestra un modal con el error de logueo
     */
    showModal = (titulo) => (descripcion) => (onClick?) => (datos?) => {
        // Creo el modal
        let activeModal;
        // Me fijo el tipo de modal a mostrar
        if (datos && datos.tipoModal === 'confirmation') {
            // Si o no modal
            activeModal = this.modalService.open(ConfirmationModal, { size: 'sm' });
            activeModal.componentInstance.modalHeader = titulo;
            activeModal.componentInstance.modalContent = descripcion;
        } else {
            // Default
            activeModal = this.modalService.open(DefaultModal, { size: 'sm' });
            activeModal.componentInstance.modalHeader = titulo;
            activeModal.componentInstance.modalContent = descripcion;
        }
        if (onClick) {
            activeModal.result.then(result => {
                // Si hizo click en 'Si', entonces ejecuto la acción.
                if (result) {
                    onClick();
                }
            });
        }
    }

    /**
     * Retorna si un email es valido
     */
    validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }


    /**
     * Decodifica la respuesta de error y muestra el error
     * @param ex 
     */
    decodeErrorResponse(ex) {
        console.log(ex);
        let errorBody;

        if (isString(ex['_body'])) {
            errorBody = JSON.parse(ex['_body']);
        } else {
            errorBody = ex['_body'];
        }

        

        // Mostrar mensaje de error
        this.showModal(errorBody.control.codigo)(errorBody.control.descripcion)()();
    }

    /**
     * Retorna una promise error con el formato de la respuesta del servicio REST
     */
    getPromiseErrorResponse = (titulo) => (descripcion) => {
        return Promise.reject({
            '_body': {
                control: {
                    codigo: titulo,
                    descripcion: descripcion
                }
            }
        });
    }

    /**
     * Dado un objeto de una clase es incompleto, retorna true si algùn campo es null
     * @param objeto El objeto
     * @param extraConditions Condiciones extras. Por ejemplo: objeto.perfil.idPerfil === null
     */
    checkIfIncomplete = (objeto: any) => (extraConditions?: boolean) => {
        // Obtengo la clase del objeto recibido
        // const ClassOne = dynamicClass(objeto.constructor.name);
        // const test = new ClassOne();
        // const idRecurso = Object.keys(test)[0]

        // Obtengo la primer key de la clase del objeto recibido
        const idRecurso = Object.keys(objeto)[0];
        
        // Recorro las keys y checkeo que NO sean null (excepto el id)
        return Object.keys(objeto).some((key) => {
            if (key !== idRecurso && key !== 'observaciones') {
                return objeto[key] === '' || objeto[key] === null
            }
        }) || extraConditions;
    }

    /**
     * A partir de un recurso, retorna la referencia 'rest' (esto es, el endpoitn al que apuntar del services)
     */
    getNameRestOfResource = (recurso) => {
        // Obtengo la clase del objeto recibido
        const ClaseRecurso = dynamicClass(recurso.constructor.name);

        // Obtengo la referencia REST de tal clase
        return Object.keys(resourcesREST).find(key => resourcesREST[key].Clase === ClaseRecurso);
    }


}