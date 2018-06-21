export class ModeloFactura {
    cuentaContable: string;
    descripcion: string;
    importeTotal: number;

    constructor(modeloFactura?: {
        cuentaContable: string;
        descripcion: string;
        importeTotal: number;
    }) {
        if (modeloFactura) {
            this.cuentaContable = modeloFactura.cuentaContable
            this.descripcion = modeloFactura.descripcion
            this.importeTotal = modeloFactura.importeTotal
        } else {
            this.cuentaContable = null
            this.descripcion = null
            this.importeTotal = null
        }
    }
}