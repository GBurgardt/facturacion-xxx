export class ListaPrecio {
    idListaPrecio: number;
    codigoDep: number;
    descripcion: string;
    domicilio: string;
    codigoPostal: string;

    constructor(listaPrecio?: {
        idDeposito: number;
        codigoDep: number;
        descripcion: string;
        domicilio: string;
        codigoPostal: string;
    }) {
        if (listaPrecio) {
            this.idListaPrecio = listaPrecio.idDeposito
            this.codigoDep = listaPrecio.codigoDep
            this.descripcion = listaPrecio.descripcion
            this.domicilio = listaPrecio.domicilio
            this.codigoPostal = listaPrecio.codigoPostal
        } else {
            this.idListaPrecio = null
            this.codigoDep = null
            this.descripcion = null
            this.domicilio = null
            this.codigoPostal = null
        }
    }
}
