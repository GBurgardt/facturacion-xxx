export class Moneda {
    idMoneda: number;
    descripcion: string;

    constructor (moneda?: {
        idMoneda: number;
        descripcion: string;
    }) {
        if (moneda) {
            this.idMoneda = moneda.idMoneda
            this.descripcion = moneda.descripcion
        } else {
            this.idMoneda = null
            this.descripcion = null
        }
    }

}
