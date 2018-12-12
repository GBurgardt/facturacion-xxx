import { TipoFormaPago } from "app/models/tipoFormaPago";
import { ListaPrecio } from "./listaPrecio";
import { DetalleFormaPago } from "app/models/detalleFormaPago";

export class FormaPago {
    idFormaPago: number;
    descripcion: string;
    editar: boolean;
    tipo: TipoFormaPago;
    // listaPrecio: ListaPrecio;
    detalles: DetalleFormaPago[];

    listasPrecios: ListaPrecio[];

    constructor (formaPago?: {
        idFormaPago: number;
        descripcion: string;
        editar: boolean;
        tipo: any;
        // listaPrecio: any;
        formaPagoDet: any[]

        listasPrecios: any[]
    }) {
        if (formaPago) {
            this.idFormaPago = formaPago.idFormaPago;
            this.descripcion = formaPago.descripcion;
            this.editar = formaPago.editar;
            this.tipo = new TipoFormaPago(formaPago.tipo);
            // this.listaPrecio = new ListaPrecio(formaPago.listaPrecio);
            this.detalles = formaPago.formaPagoDet.map(det => new DetalleFormaPago(det))
            this.listasPrecios = formaPago.listasPrecios ? formaPago.listasPrecios.map(lp => new ListaPrecio(lp)) : []
        } else {
            this.idFormaPago = null;
            this.descripcion = null;
            this.editar = null;
            this.tipo = new TipoFormaPago();
            // this.listaPrecio = new ListaPrecio();
            this.detalles = [];
            this.listasPrecios = [];
        }
    }

    addOrRemoveLista = (lp: ListaPrecio) => this.listasPrecios &&
        this.listasPrecios.some(cteLet => cteLet.idListaPrecio === lp.idListaPrecio) ?
            this.listasPrecios = this.listasPrecios.filter(cteLet => cteLet.idListaPrecio !== lp.idListaPrecio) :
            this.listasPrecios = this.listasPrecios.concat(lp)

    existLista = (letra: ListaPrecio) => this.listasPrecios &&
        this.listasPrecios.some(cteLet => cteLet.idListaPrecio === letra.idListaPrecio)

}