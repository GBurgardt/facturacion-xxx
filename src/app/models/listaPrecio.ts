import { DetalleProducto } from "./detalleProducto";
import { Moneda } from "./moneda";

export class ListaPrecio {
    idListaPrecio: number;
    codigoLista: number;
    fechaAlta: string;
    vigenciaDesde: string;
    vigenciaHasta: string;
    activa: boolean;
    idPadronCliente: number;
    idPadronRepresentante: number;
    porc1: number;
    condiciones: string;
    idMoneda: Moneda;
    listaPrecioDetCollection: DetalleProducto[];

    constructor(listaPrecio?: {
        idListaPrecio: number;
        codigoLista: number;
        fechaAlta: string;
        vigenciaDesde: string;
        vigenciaHasta: string;
        activa: boolean;
        idPadronCliente: number;
        idPadronRepresentante: number;
        porc1: number;
        condiciones: string;
        idMoneda: any;
        listaPrecioDetCollection: any[];
    }) {
        if (listaPrecio) {
            this.idListaPrecio = listaPrecio.idListaPrecio
            this.codigoLista = listaPrecio.codigoLista
            this.fechaAlta = listaPrecio.fechaAlta
            this.vigenciaDesde = listaPrecio.vigenciaDesde
            this.vigenciaHasta = listaPrecio.vigenciaHasta
            this.activa = listaPrecio.activa
            this.idPadronCliente = listaPrecio.idPadronCliente
            this.idPadronRepresentante = listaPrecio.idPadronRepresentante
            this.porc1 = listaPrecio.porc1
            this.condiciones = listaPrecio.condiciones
            this.idMoneda = new Moneda(listaPrecio.idMoneda);
            this.listaPrecioDetCollection = listaPrecio.listaPrecioDetCollection.map(detalle => new DetalleProducto(detalle));
        } else {
            this.idListaPrecio = null
            this.codigoLista = null
            this.fechaAlta = null
            this.vigenciaDesde = null
            this.vigenciaHasta = null
            this.activa = null
            this.idPadronCliente = null
            this.idPadronRepresentante = null
            this.porc1 = null
            this.condiciones = null
            this.idMoneda = new Moneda();
            this.listaPrecioDetCollection = [];
        }
    }

}
