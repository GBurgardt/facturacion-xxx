import { Empresa } from "./empresa";

export class Rubro {
    idRubro: number;
    empresa: Empresa;
    descripcion: string;

    constructor (rubro?: {
        idRubro: number;
        empresa: any;
        descripcion: string;
    }) {
        if (rubro) {
            this.idRubro = rubro.idRubro;
            this.empresa = new Empresa(rubro.empresa);
            this.descripcion = rubro.descripcion;
        } else {
            this.idRubro = null;
            this.empresa = null;
            this.descripcion = null;
        }
    }

}