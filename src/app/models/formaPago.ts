import { TipoFormaPago } from "app/models/tipoFormaPago";

export class FormaPago {
    idFormaPago: number;
    descripcion: string;
    editar: boolean;
    tipo: TipoFormaPago;

    constructor (formaPago?: {
        idFormaPago: number;
        descripcion: string;
        editar: boolean;
        tipo: any;
    }) {
        if (formaPago) {
            this.idFormaPago = formaPago.idFormaPago;
            this.descripcion = formaPago.descripcion;
            this.editar = formaPago.editar;
            this.tipo = new TipoFormaPago(formaPago.tipo);
        } else {
            this.idFormaPago = null;
            this.descripcion = null;
            this.editar = null;
            this.tipo = null;
        }
    }

}