import { Rubro } from "./rubro";
import { SubRubro } from "./subRubro";

export class FiltroListaPrecios {
    codProdDesde: string;
    codProdHasta: string;
    codProvedor: number;
    rubro: Rubro;
    subRubro: SubRubro;
    porcentajeCabecera: number;
    porcentajeInf: number;
    porcentajeSup: number;

    constructor(filtroListaPrecios?: {
        codProdDesde: string;
        codProdHasta: string;
        codProvedor: number;
        rubro: any;
        subRubro: any;
        porcentajeCabecera: number;
        porcentajeInf: number;
        porcentajeSup: number;
    }) {
        if (filtroListaPrecios) {
            this.codProdDesde = filtroListaPrecios.codProdDesde;
            this.codProdHasta = filtroListaPrecios.codProdHasta;
            this.codProvedor = filtroListaPrecios.codProvedor;
            this.rubro = new Rubro(filtroListaPrecios.rubro);
            this.subRubro = new SubRubro(filtroListaPrecios.subRubro);
            this.porcentajeCabecera = filtroListaPrecios.porcentajeCabecera;
            this.porcentajeInf = filtroListaPrecios.porcentajeInf;
            this.porcentajeSup = filtroListaPrecios.porcentajeSup;
        } else {
            this.codProdDesde = null;
            this.codProdHasta = null;
            this.codProvedor = null;
            this.rubro = new Rubro();
            this.subRubro = new SubRubro();
            this.porcentajeCabecera = null;
            this.porcentajeInf = null;
            this.porcentajeSup = null;
        }
    }
}