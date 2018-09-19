
export class CodigoAfip {
    compDescri: string;
    compDescri2: string;
    compCurso: string;
    compDgi: number

    constructor(codigoAfip?: {
        compDescri: string;
        compDescri2: string;
        compCurso: string;
        compDgi: number
    }) {
        if (codigoAfip) {
            this.compDescri = codigoAfip.compDescri;
            this.compDescri2 = codigoAfip.compDescri2;
            this.compCurso = codigoAfip.compCurso;
            this.compDgi = codigoAfip.compDgi
        } else {
            this.compDescri = null;
            this.compDescri2 = null;
            this.compCurso = null;
            this.compDgi = null
        }
    }

}