import { Rubro } from "./rubro";

export class SubRubro {
    idSubRubro: number;
    descripcion: string;
    rubro: Rubro;

    constructor (subRubro?: {
        idSubRubro: number;
        descripcion: string;
        rubro: any;
    }) {
        if (subRubro) {
            this.idSubRubro = subRubro.idSubRubro;
            this.descripcion = subRubro.descripcion;
            this.rubro = new Rubro(subRubro.rubro);
        } else {
            this.idSubRubro = null;
            this.descripcion = null;
            this.rubro = null;
        }
    }

}