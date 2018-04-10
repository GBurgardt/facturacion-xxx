import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DefaultModal } from '../pages/reusable/modals/default-modal/default-modal.component';
import { AuthService } from './authService';
import { AppState } from 'app/app.service';

@Injectable()
export class LoginService {

    constructor(
        private modalService: NgbModal,
        private authService: AuthService,
        private appState: AppState
    ) { }


    /**
     * Se loguea al backend y retorna la respuesta
     */
    login = (usuario) => (clave) => this.authService.login(usuario, clave);

    /**
     * Guarda data importante del logueo
     */
    saveLoginData = (respLogin) => {
        this.appState.set('usuarioActivo', respLogin.datos.cuenta);
        this.appState.set('empresaActiva', respLogin.datos.empresa);
        this.appState.set('tokenActivo', respLogin.datos.token);
    }

    /**
     * Método que muestra un modal con el error de logueo
     */
    showModalError = () => {
        const activeModal = this.modalService.open(DefaultModal, { size: 'sm' });
        activeModal.componentInstance.modalHeader = 'Error';
        activeModal.componentInstance.modalContent = 'Usuario o contraseña incorrecto';
    }
}