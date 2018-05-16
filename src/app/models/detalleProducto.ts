import { Producto } from "./producto";

export class DetalleProducto {
    idDetalleProducto: number;
    cotaInf: number;
    cotaSup: number;
    precio: number;
    producto: Producto;

    constructor (detalleProducto?: {
        cotaInf: number;
        cotaSup: number;
        precio: number;
        idProducto: any;
    }) {
        if (detalleProducto) {
            this.idDetalleProducto = detalleProducto.idProducto.idProductos;
            this.cotaInf = detalleProducto.cotaInf;
            this.cotaSup = detalleProducto.cotaSup;
            this.precio = detalleProducto.precio;
            this.producto = new Producto(detalleProducto.idProducto);
        } else {
            this.idDetalleProducto = null;
            this.cotaInf = null;
            this.cotaSup = null;
            this.precio = null;
            this.producto = new Producto();
        }
    }

}