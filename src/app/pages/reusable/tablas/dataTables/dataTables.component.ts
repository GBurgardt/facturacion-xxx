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

    // Funciones que se disparan cuando se da en edit o remove
    @Input() edit;
    @Input() remove;

    filterQuery = "";
    rowsOnPage = 10;
    sortOrder = "asc";

    constructor() { }

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

    /**
     * Este método checkea el tipo de dato de la key y la parsea de acuerdo a el. Por ejemplo, si es boolean retrona 'si' en 'true' y 'no' en 'false'
     * @param key 
     */
    parseKey(key) {
        const tipoDato = typeof key;

        if (tipoDato === 'boolean') {
            return key ? 'Si' : 'No';
        };

        return key;
    }

}
