import { SisComprobante } from "./sisComprobante";
import { Numerador } from "./numerador";

export class TipoComprobante {
    idCteTipo: number;
    codigoComp: number;
    descCorta: string;
    descripcion: string;
    cursoLegal: boolean;
    codigoAfip: number;
    surenu: string;
    observaciones: string;
    comprobante: SisComprobante;
    numerador: any[];

    constructor (tipoComprobante?: {
        idCteTipo: number;
        codigoComp: number;
        descCorta: string;
        descripcion: string;
        cursoLegal: boolean;
        codigoAfip: number;
        surenu: string;
        observaciones: string;
        comprobante: any;
        numerador: any[];
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
            this.comprobante = new SisComprobante(tipoComprobante.comprobante);
            this.numerador = tipoComprobante.numerador.map(n => new Numerador(n));
        } else {
            this.idCteTipo = null;
            this.codigoComp = null;
            this.descCorta = null;
            this.descripcion = null;
            this.cursoLegal = null;
            this.codigoAfip = null;
            this.surenu = null;
            this.observaciones = null;
            this.comprobante = new SisComprobante();
            this.numerador = null;
        }
    }

}