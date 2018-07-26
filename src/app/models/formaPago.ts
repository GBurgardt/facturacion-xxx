import { TipoFormaPago } from "app/models/tipoFormaPago";
import { ListaPrecio } from "./listaPrecio";
import { DetalleFormaPago } from "app/models/detalleFormaPago";

export class FormaPago {
    idFormaPago: number;
    descripcion: string;
    editar: boolean;
    tipo: TipoFormaPago;
    listaPrecio: ListaPrecio;
    detalles: DetalleFormaPago[];

    constructor (formaPago?: {
        idFormaPago: number;
        descripcion: string;
        editar: boolean;
        tipo: any;
        listaPrecio: any;
        formaPagoDet: any[]
    }) {
        if (formaPago) {
            this.idFormaPago = formaPago.idFormaPago;
            this.descripcion = formaPago.descripcion;
            this.editar = formaPago.editar;
            this.tipo = new TipoFormaPago(formaPago.tipo);
            this.listaPrecio = new ListaPrecio(formaPago.listaPrecio);
            this.detalles = formaPago.formaPagoDet.map(det => new DetalleFormaPago(det))
        } else {
            this.idFormaPago = null;
            this.descripcion = null;
            this.editar = null;
            this.tipo = new TipoFormaPago();
            this.listaPrecio = new ListaPrecio();
            this.detalles = [];
        }
    }

}