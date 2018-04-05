import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DefaultModal } from '../pages/reusable/modals/default-modal/default-modal.component';

@Injectable()
export class LoginService {

    constructor(
        private modalService: NgbModal
    ) { }

    /**
     * Método que muestra un modal con el error de logueo
     */
    showModalError(): void {
        const activeModal = this.modalService.open(DefaultModal, { size: 'sm' });
        activeModal.componentInstance.modalHeader = 'Error';
        activeModal.componentInstance.modalContent = 'Usuario o contraseña incorrecto';
    }
}