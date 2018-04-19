import { Component, OnInit, Input } from '@angular/core';
import { DataTablesService } from './dataTables.service';

@Component({
    selector: 'data-tables',
    templateUrl: './dataTables.html',
    styleUrls: ['./dataTables.scss']
})

/**
 * Tabla reutilizable
 */
export class DataTables {
    /**
     * Inputs de entrada para hacer la tabla reutilizable
     * columns: array de jsons({nombre: 'telefono', ancho: 20%}) con las columnas de la tabla
     * data: array de jsons con toda la data de la tabla
     * sortBy: Orden por defecto
     */
    @Input() columns;
    @Input() data;
    @Input() sortBy: string;

    filterQuery = "";
    rowsOnPage = 10;
    sortOrder = "asc";

    constructor() { }

    ngOnInit() {
        console.log('columns');
        console.log(this.columns);
    }

    toInt(num: string) {
        return +num;
    }

    sortByWordLength = (a: any) => {
        return a.city.length;
    }

    /**
     * Obtiene el style a partir de una columna
     * @param col 
     */
    getStyleFromCol(col) {
        let styles = {
            'width': col.ancho
        };
        return styles;
    }

}
