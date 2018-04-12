import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DefaultModal } from '../pages/reusable/modals/default-modal/default-modal.component';
import { AuthService } from './authService';
import { AppState } from 'app/app.service';

@Injectable()
export class UtilsService {

    constructor(
        private modalService: NgbModal,
        private authService: AuthService,
        private appState: AppState
    ) { }

    /**
     * Método que muestra un modal con el error de logueo
     */
    showModal = (titulo) => (descripcion) => {
        const activeModal = this.modalService.open(DefaultModal, { size: 'sm' });
        activeModal.componentInstance.modalHeader = titulo;
        activeModal.componentInstance.modalContent = descripcion;
    }
}