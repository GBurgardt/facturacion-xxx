//import * as _ from 'lodash';
import { Component, Input } from '@angular/core';
import { UtilsService } from 'app/services/utilsService';
import { IngresoFormService } from '../ingresoFormService';
import { ProductoPendiente } from '../../../../../models/productoPendiente';
import { Producto } from '../../../../../models/producto';
//import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';
import { DateLikePicker } from '../../../../../models/dateLikePicker';


@Component({
    selector: 'tabla-ingreso',
    templateUrl: './tablaIngreso.html',
    styleUrls: ['./tablaIngreso.scss']
})
    
export class TablaIngreso {
    // Datos de mierda que me da paja sacar por miedo a romper todo
    sortBy = 'nombre';
    filterQuery = "";
    rowsOnPage = 10;
    sortOrder = "asc";
    // Fin datos de mierda

    // Reusabilidad tabla
    @Input() enableAddItem = false;

    // Inputs
    @Input() columns;
    @Input() data;
    @Input() edit;
    @Input() remove;
    @Input() confirmEdit;

    /////////// BUSQUEDA ///////////
    textoBusqueda: string;
    productosBusqueda: {
        todos: Producto[];
        filtrados: BehaviorSubject<Producto[]>;
    } = {todos: [], filtrados: new BehaviorSubject([])}

    @Input() onClickProductoLista;

    
    constructor(
        private utilsService: UtilsService,
        private ingresoFormService: IngresoFormService
    ) {
        ingresoFormService.getAllProductos().subscribe(todos=>{
            this.productosBusqueda.todos = todos;
            this.productosBusqueda.filtrados.next(todos);
        });
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

    /**
     * Este método checkea el tipo de dato de la key y la parsea de acuerdo a el. Por ejemplo, si es boolean retrona 'si' en 'true' y 'no' en 'false'
     * @param key
     */
    parseKey(key) {
        const tipoDato:any = typeof key;

        if (tipoDato === 'boolean') {
            return key ? 'Si' : 'No';
        } else if (tipoDato === 'object'){
            // Me fijo el nombre de la clase del objeto
            if (key.constructor.name === 'DateLikePicker') {
                return `${key.year}/${key.month<10 ? '0' : ''}${key.month}/${key.day<10 ? '0' : ''}${key.day}`
            }
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

    /**
     * Evento change del input de codProducto
     */
    onChangeInputItemAdd = (textoBuscado) => {
        this.productosBusqueda.filtrados.next(
            this.productosBusqueda.todos.filter(
                producto => producto.codProducto.toString().includes(textoBuscado) || 
                            producto.descripcion.toString().toLowerCase().includes(textoBuscado)
            )
        );
    }
    
    /**
     * El blur es cuando se hace un leave del input (caundo se apreta click afuera por ejemplo).
     * Acá lo que hago es poner un array vacio como próx valor de los filtrados, cosa que la lista desaparezca porque no hay nada
     */
    onBlurInputItemAdd = () => {
        setTimeout(()=>this.productosBusqueda.filtrados.next([]), 100);
    }

    /**
     * Retorna el offset del input add
     */
    getOffsetOfAddInput = () => {
        return this.utilsService.getOffset(document.getElementById('addInput')); 
    }

    onChangeNgModelDateLikePicker = (nuevoValor) => (item) => (key) => {
        this.data = this.data.map((prod: ProductoPendiente)=>{
            let cloneProd = prod;
            if (cloneProd.idProductos === item.idProductos) {
                cloneProd[key] = new DateLikePicker(null,nuevoValor);
                console.log(cloneProd[key]);
            };
            return cloneProd
        });

        console.log(this.data);
    }

}
