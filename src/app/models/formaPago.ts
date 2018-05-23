import { TipoFormaPago } from "app/models/tipoFormaPago";
import { ListaPrecio } from "./listaPrecio";

export class FormaPago {
    idFormaPago: number;
    descripcion: string;
    editar: boolean;
    tipo: TipoFormaPago;
    listaPrecio: ListaPrecio;

    constructor (formaPago?: {
        idFormaPago: number;
        descripcion: string;
        editar: boolean;
        tipo: any;
        listaPrecio: any;
    }) {
        if (formaPago) {
            this.idFormaPago = formaPago.idFormaPago;
            this.descripcion = formaPago.descripcion;
            this.editar = formaPago.editar;
            this.tipo = new TipoFormaPago(formaPago.tipo);
            this.listaPrecio = new ListaPrecio(formaPago.listaPrecio);
        } else {
            this.idFormaPago = null;
            this.descripcion = null;
            this.editar = null;
            this.tipo = new TipoFormaPago();
            this.listaPrecio = new ListaPrecio();
        }
    }

}