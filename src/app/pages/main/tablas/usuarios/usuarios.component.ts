import { Component } from '@angular/core';
import { DataTablesService } from '../../../reusable/tables/dataTables/dataTables.service';

@Component({
    selector: 'maps',
    // template: `<router-outlet></router-outlet>`
    styleUrls: ['./usuarios.scss'],
    templateUrl: './usuarios.html'
})
export class Usuarios {

    // Data de la tabla
    dataComprobantes;

    // Columnas de la tabla
    tableColumns;

    constructor(
        private service: DataTablesService
    ) {
        // Guardo las columnas de la tabla
        this.tableColumns = [
            {
                nombre: 'nombre',
                ancho: '20%'
            },
            {
                nombre: 'telefono',
                ancho: '20%'
            }
        ]

        // Guardo los datos
        this.dataComprobantes = this.service.getData();
    }

    ngOnInit() {
    }

}
