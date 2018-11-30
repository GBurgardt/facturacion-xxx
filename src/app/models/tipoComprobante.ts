import { SisComprobante } from "./sisComprobante";
import { Numerador } from "./numerador";
import { CodigoAfip } from "./codigoAfip";
import { SisLetra } from "./sisLetra";

export class TipoComprobante {
    idCteTipo: number;
    codigoComp: number;
    descCorta: string;
    descripcion: string;
    cursoLegal: boolean;
    // codigoAfip: number;
    codigoAfip: CodigoAfip;
    surenu: string;
    observaciones: string;
    comprobante: SisComprobante;
    numerador: any[];
    requiereFormaPago: boolean;
    letras: SisLetra[] = [];

    constructor (tipoComprobante?: {
        idCteTipo: number;
        codigoComp: number;
        descCorta: string;
        descripcion: string;
        cursoLegal: boolean;
        // codigoAfip: number;
        codigoAfip: any;
        surenu: string;
        observaciones: string;
        comprobante: any;
        numerador: Numerador[];
        requiereFormaPago: boolean;
        letras: any[];
    }) {
        if (tipoComprobante) {
            this.idCteTipo = tipoComprobante.idCteTipo;
            this.codigoComp = tipoComprobante.codigoComp;
            this.descCorta = tipoComprobante.descCorta;
            this.descripcion = tipoComprobante.descripcion;
            this.cursoLegal = tipoComprobante.cursoLegal;
            // this.codigoAfip = tipoComprobante.codigoAfip;
            this.codigoAfip = new CodigoAfip(tipoComprobante.codigoAfip)
            this.surenu = tipoComprobante.surenu;
            this.observaciones = tipoComprobante.observaciones;
            this.comprobante = new SisComprobante(tipoComprobante.comprobante);
            this.numerador = tipoComprobante.numerador.map(n => new Numerador(n));
            this.requiereFormaPago = tipoComprobante.requiereFormaPago;
            this.letras = tipoComprobante.letras.map(n => new SisLetra(n));
        } else {
            this.idCteTipo = null;
            this.codigoComp = null;
            this.descCorta = null;
            this.descripcion = null;
            this.cursoLegal = null;
            // this.codigoAfip = new CodigoAfip();
            this.codigoAfip = null;
            this.surenu = null;
            this.observaciones = null;
            // this.comprobante = new SisComprobante();
            this.comprobante = null;
            this.numerador = null;
            this.requiereFormaPago = null;
            this.letras = [];
        }
    }

    addOrRemoveLetra = (letra: SisLetra) => this.letras &&
        this.letras.some(cteLet => cteLet.idSisLetra === letra.idSisLetra) ?
            this.letras = this.letras.filter(cteLet => cteLet.idSisLetra !== letra.idSisLetra) :
            this.letras = this.letras.concat(letra)

    existLetra = (letra: SisLetra) => this.letras &&
        this.letras.some(cteLet => cteLet.idSisLetra === letra.idSisLetra)
    

}
