export class SisTipoOperacion {
    idSisTipoOperacion: number;
    descripcion: string;
    modulo: string

    constructor(sisTipoOperacion?: {
        idSisTipoOperacion: number;
        descripcion: string;
        modulo: string
    }) {
        if (sisTipoOperacion) {
            this.idSisTipoOperacion = sisTipoOperacion.idSisTipoOperacion;
            this.descripcion = sisTipoOperacion.descripcion;
            this.modulo = sisTipoOperacion.modulo
        } else {
            this.idSisTipoOperacion = null;
            this.descripcion = null;
            this.modulo = null
        }
    }

}