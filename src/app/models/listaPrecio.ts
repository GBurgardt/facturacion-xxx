import { DetalleProducto } from "./detalleProducto";
import { Moneda } from "./moneda";
import { DateLikePicker } from "./dateLikePicker";

export class ListaPrecio {
    idListaPrecio: number;
    codigoLista: number;
    fechaAlta: DateLikePicker;
    vigenciaDesde: DateLikePicker;
    vigenciaHasta: DateLikePicker;
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
            // var b = listaPrecio.fechaAlta.split(/\D+/);
            // console.log(listaPrecio.fechaAlta);
            // console.log(new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6])));
            this.idListaPrecio = listaPrecio.idListaPrecio;
            this.codigoLista = listaPrecio.codigoLista;

            
            this.fechaAlta = new DateLikePicker(new Date(listaPrecio.fechaAlta));
            this.vigenciaDesde = new DateLikePicker(new Date(listaPrecio.vigenciaDesde));
            this.vigenciaHasta = new DateLikePicker(new Date(listaPrecio.vigenciaHasta));

            this.activa = listaPrecio.activa;
            this.idPadronCliente = listaPrecio.idPadronCliente;
            this.idPadronRepresentante = listaPrecio.idPadronRepresentante;
            this.porc1 = listaPrecio.porc1;
            this.condiciones = listaPrecio.condiciones;
            this.idMoneda = new Moneda(listaPrecio.idMoneda);
            this.listaPrecioDetCollection = listaPrecio.listaPrecioDetCollection.map(detalle => new DetalleProducto(detalle));
        } else {
            this.idListaPrecio = null;
            this.codigoLista = null;
            this.fechaAlta = null;
            this.vigenciaDesde = null;
            this.vigenciaHasta = null;
            this.activa = null;
            this.idPadronCliente = null;
            this.idPadronRepresentante = null;
            this.porc1 = null;
            this.condiciones = null;
            this.idMoneda = new Moneda();
            this.listaPrecioDetCollection = [];
        }
    }

}
