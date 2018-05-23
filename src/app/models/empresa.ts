export class Empresa {
    idEmpresa: number;
    nombre: string;
    descripcion: string;
    domicilio: string;
    cuit: string;
    iibb: string;

    constructor (empresa?: {
        idEmpresa: number,
        nombre: string,
        descripcion: string,
        domicilio: string,
        cuit: string,
        iibb: string
    }) {
        if (empresa) {
            this.idEmpresa = empresa.idEmpresa;
            this.nombre = empresa.nombre;
            this.descripcion = empresa.descripcion;
            this.domicilio = empresa.domicilio;
            this.cuit = empresa.cuit;
            this.iibb = empresa.iibb;
        } else {
            this.idEmpresa = null;
            this.nombre = null;
            this.descripcion = null;
            this.domicilio = null;
            this.cuit = null;
            this.iibb = null;
        }
    }

}
