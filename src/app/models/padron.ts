import { CondIva } from "app/models/condIva";

export class Padron {
    padronCodigo: number;
    padronApelli: string;
    padronNombre: string;
    codigoPostal: number;
    cuit: number;
    condIva: CondIva;

    constructor(padron?: {
        padronCodigo: number;
        padronApelli: string;
        padronNombre: string;
        codigoPostal: number;
        cuit: number;
        condIva: CondIva;
    }) {
        if (padron) {
            this.padronCodigo = padron.padronCodigo;
            this.padronApelli = padron.padronApelli;
            this.padronNombre = padron.padronNombre;
            this.codigoPostal = padron.codigoPostal;
            this.cuit = padron.cuit;
            this.condIva = new CondIva(padron.condIva);
        } else {
            // this.padronCodigo = null;
            // this.padronApelli = null;
            // this.padronNombre = null;
            // this.codigoPostal = null;
            // this.cuit = null;
            // this.condIva = new CondIva(null);
            this.padronCodigo = null;
            this.padronApelli = undefined;
            this.padronNombre = undefined;
            this.codigoPostal = undefined;
            this.cuit = undefined;
            // this.condIva = new CondIva(null);
            this.condIva = null;
        }
    }

}