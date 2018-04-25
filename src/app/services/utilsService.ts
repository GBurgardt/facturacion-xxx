import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DefaultModal } from '../pages/reusable/modals/default-modal/default-modal.component';
import { AuthService } from './authService';
import { AppState } from 'app/app.service';
import { ConfirmationModal } from 'app/pages/reusable/modals/confirmation-modal/confirmation-modal.component';

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
}