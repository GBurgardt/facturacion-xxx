export class SisTipoOperacion {
    idSisTipoOperacion: number;
    descripcion: string;
    modulo: string;
    canje: boolean;

    constructor(sisTipoOperacion?: {
        idSisTipoOperacion: number;
        descripcion: string;
        modulo: string;
        canje: boolean;
    }) {
        if (sisTipoOperacion) {
            this.idSisTipoOperacion = sisTipoOperacion.idSisTipoOperacion;
            this.descripcion = sisTipoOperacion.descripcion;
            this.modulo = sisTipoOperacion.modulo;
            this.canje = sisTipoOperacion.canje;
        } else {
            this.idSisTipoOperacion = null;
            this.descripcion = null;
            this.modulo = null;
            this.canje = null;
        }
    }

}