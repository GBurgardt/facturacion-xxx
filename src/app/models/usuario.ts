import { Perfil } from "./perfil";

export class Usuario {
    email: string;
    nombre: string;
    clave: string;
    telefono: string;
    perfil: Perfil;

    constructor (usuario?: {
        email: string, 
        nombre:string, 
        clave:string,
        telefono: string,
        perfil: {
            idPerfil: number,
            descripcion: string,
            sucursal: {
                idSucursal: number,
                nombre: string,
                domicilio: string,
                codigoPostal: string,
                menuSucursal: any,
                empresa: any
            }   
        }
    }) {
        if (usuario) {
            this.email = usuario.email;
            this.nombre = usuario.nombre;
            this.clave = usuario.clave;
            this.telefono = usuario.telefono;
            this.perfil = new Perfil(usuario.perfil);
        } else {
            this.email = null;
            this.nombre = null;
            this.clave = null;
            this.telefono = null;
            this.perfil = new Perfil();
        }
    }

}