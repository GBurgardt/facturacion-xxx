export class MenuSucursal {
    idMenu: string;
    idPadre: string;
    nombre: string;
    icono: string;
    orden: number;

    constructor (menuSucursal?: {
        idMenu: string,
        idPadre: string,
        nombre: string,
        icono: string,
        orden: number
    }) {
        if (menuSucursal) {
            this.idMenu = menuSucursal.idMenu;
            this.idPadre = menuSucursal.idPadre;
            this.nombre = menuSucursal.nombre;
            this.icono = menuSucursal.icono;
            this.orden = menuSucursal.orden;
        } else {
            this.idMenu = null;
            this.idPadre = null;
            this.nombre = null;
            this.icono = null;
            this.orden = null;
        }
    }

}