export class ModeloFactura {
    cuentaContable: string;
    descripcion: string;
    importeTotal: number;
    porcentaje: number;
    idSisTipoModelo: number;
    // idProducto: number;

    constructor(modeloFactura?: {
        cuentaContable: string;
        descripcion: string;
        importeTotal: number;
        porcentaje: number;
        idSisTipoModelo: number;
        // idProducto?: number;
    }) {
        if (modeloFactura) {
            this.cuentaContable = modeloFactura.cuentaContable
            this.descripcion = modeloFactura.descripcion
            this.importeTotal = modeloFactura.importeTotal
            this.porcentaje = modeloFactura.porcentaje
            this.idSisTipoModelo = modeloFactura.idSisTipoModelo

            // this.idProducto = modeloFactura.idProducto
        } else {
            this.cuentaContable = null
            this.descripcion = null
            this.importeTotal = null
            this.porcentaje = null
            this.idSisTipoModelo = null

            // this.idProducto = null
        }
    }
}