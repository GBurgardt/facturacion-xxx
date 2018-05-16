import { Component, OnInit, Input } from '@angular/core';
import { DataTablesService } from './dataTables.service';
import { UtilsService } from 'app/services/utilsService';

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
    @Input() confirmEdit;

    @Input() tituloTabla;

    @Input() baCardClase = 'with-scroll';

    filterQuery = "";
    rowsOnPage = 10;
    sortOrder = "asc";

    constructor(
        private utilsService: UtilsService
    ) { }

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

    // Checkea si pongo el 'tick' para finalizar la edicion. Osea, si está en edición.
    checkIfEditOn(item) {
        if (this.columns) {
            return this.columns.some(col=>{

                if (!col.subkey) {
                    return col.enEdicion && col.enEdicion === item[this.utilsService.getNameIdKeyOfResource(item)];
                } else if (col.subkey && !col.subsubkey) {
                    return col.enEdicion && col.enEdicion === (item[col.key])[this.utilsService.getNameIdKeyOfResource(item[col.key])];
                } 

            });
        };
    }

    test(col,item) {
        console.log(item);
        //console.log(item['producto'][this.utilsService.getNameIdKeyOfResource(item)]);
        //col.enEdicion && col.enEdicion === item[utilsService.getNameIdKeyOfResource(item)]
    }
}
