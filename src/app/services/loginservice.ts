import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DefaultModal } from '../pages/reusable/modals/default-modal/default-modal.component';
import { AuthService } from './authService';
import { BaMenuService } from 'app/theme';
import { Routes } from '@angular/router';
import { LocalStorageService } from 'app/services/localStorageService';

@Injectable()
export class LoginService {

    constructor(
        private modalService: NgbModal,
        private authService: AuthService,
        private baMenuService: BaMenuService,
        private localStorageService: LocalStorageService
    ) { }


    /**
     * Se loguea al backend y retorna la respuesta
     */
    login = (usuario) => (clave) => this.authService.login(usuario, clave);

    /**
     * Guarda data importante del logueo y genera los menus, entre otras cosas
     */
    completeLogin = (respLogin) => {
        // Guardo datos importantes del login (TODO: Cambiar por LocalStorage)
        this.localStorageService.setObject('usuarioActivo', respLogin.datos.cuenta);
        this.localStorageService.setObject('accesoActivo', respLogin.datos.acceso);
        this.localStorageService.setObject('perfilActivo', respLogin.datos.perfil);
        // Guardo los menus PARSEADOS en el localStorage
        this.localStorageService.setObject('menuActivo', <Routes>this.generatePagesMenu(respLogin.datos.perfil.sucursal.menuSucursal));
    }

    /**
     * Parsea los datos del menu que viene del backend al formato requerido por el metodo updateMenuByRoutes
     */
    generatePagesMenu = (menuSucursal) => {
        // Le doy el formato requerido a los menus
        const menuFormateado = menuSucursal.map(menuPadre => {
            if (menuPadre.menuResponse.idPadre === '/') {
                return {
                    path: menuPadre.menuResponse.idMenu,
                    data: {
                        menu: {
                            title: menuPadre.menuResponse.nombre,
                            icon: menuPadre.menuResponse.icono,
                            selected: false,
                            expanded: false,
                            order: menuPadre.menuResponse.orden * 100
                        }
                    },
                    children: menuSucursal.map(menuChildren => {
                        if (menuChildren.menuResponse.idPadre === menuPadre.menuResponse.idMenu) {
                            return {
                                path: menuChildren.menuResponse.idMenu,
                                data: {
                                    menu: {
                                        title: menuChildren.menuResponse.nombre,
                                    }
                                }
                            }
                        }
                    }).filter(menu => menu != undefined)
                }
            }
        }).filter(menu => menu != undefined); 

        return menuFormateado;
    }
}