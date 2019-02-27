import { Perfil } from "./perfil";
import { ListaPrecio } from "./listaPrecio";
import { PtoVenta } from "./ptoVenta";

export class Usuario {
    idUsuario: number;
    email: string;
    nombre: string;
    clave: string;
    telefono: string;
    perfil: Perfil;
    listaPrecios: ListaPrecio[];
    ptoVentas: PtoVenta[];

    constructor (usuario?: {
        id: number,
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
        },
        listaPrecios: any[],
        ptoVentas: any[]
    }) {
        if (usuario) {
            this.idUsuario = usuario.id;
            this.email = usuario.email;
            this.nombre = usuario.nombre;
            this.clave = usuario.clave;
            this.telefono = usuario.telefono;
            this.perfil = new Perfil(usuario.perfil);
            this.listaPrecios = usuario.listaPrecios.map(l => new ListaPrecio(l))
            this.ptoVentas = usuario.ptoVentas.map(l => new PtoVenta(l))
        } else {
            this.idUsuario = null;
            this.email = null;
            this.nombre = null;
            this.clave = null;
            this.telefono = null;
            this.perfil = new Perfil();
            this.listaPrecios = [];
            this.ptoVentas = [];
        }
    }

    /**
     * Los admin no pueden editar lp
     */
    addOrRemoveLista = (lp: ListaPrecio) => this.listaPrecios &&
        this.perfil.descripcion !== 'Admin' &&
        this.listaPrecios.some(cteLet => cteLet.idListaPrecio === lp.idListaPrecio) ?
            this.listaPrecios = this.listaPrecios.filter(cteLet => cteLet.idListaPrecio !== lp.idListaPrecio) :
            this.listaPrecios = this.listaPrecios.concat(lp)

    existLista = (letra: ListaPrecio) => this.listaPrecios &&
        this.listaPrecios.some(cteLet => cteLet.idListaPrecio === letra.idListaPrecio)

}