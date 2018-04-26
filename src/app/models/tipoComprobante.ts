export class TipoComprobante {
    idCteTipo: number;
    codigoComp: number;
    descCorta: string;
    descripcion: string;
    cursoLegal: boolean;
    codigoAfip: number;
    surenu: string;
    observaciones: string;

    constructor (tipoComprobante?: {
        idCteTipo: number;
        codigoComp: number;
        descCorta: string;
        descripcion: string;
        cursoLegal: boolean;
        codigoAfip: number;
        surenu: string;
        observaciones: string;
    }) {
        if (tipoComprobante) {
            this.idCteTipo = tipoComprobante.idCteTipo;
            this.codigoComp = tipoComprobante.codigoComp;
            this.descCorta = tipoComprobante.descCorta;
            this.descripcion = tipoComprobante.descripcion;
            this.cursoLegal = tipoComprobante.cursoLegal;
            this.codigoAfip = tipoComprobante.codigoAfip;
            this.surenu = tipoComprobante.surenu;
            this.observaciones = tipoComprobante.observaciones;
        } else {
            this.idCteTipo = null;
            this.codigoComp = null;
            this.descCorta = null;
            this.descripcion = null;
            this.cursoLegal = null;
            this.codigoAfip = null;
            this.surenu = null;
            this.observaciones = null;
        }
    }

}