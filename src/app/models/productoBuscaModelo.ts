export class ProductoBuscaModelo {
    idProducto: number;
    precio: number;
    cantidad: number;

    constructor(productoBuscaModelo?: {
        idProducto: number;
        precio: number;
        cantidad: number;
    }) {
        if (productoBuscaModelo) {
            this.idProducto = productoBuscaModelo.idProducto
            this.precio = productoBuscaModelo.precio
            this.cantidad = productoBuscaModelo.cantidad
        } else {
            this.idProducto = null
            this.precio = null
            this.cantidad = null
        }
    }

}