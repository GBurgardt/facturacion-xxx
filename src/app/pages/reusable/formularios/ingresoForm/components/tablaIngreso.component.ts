import * as _ from 'lodash';
import { Component, Input } from '@angular/core';
import { UtilsService } from 'app/services/utilsService';
import { IngresoFormService } from '../ingresoFormService';
import { ProductoPendiente } from '../../../../../models/productoPendiente';
import { Producto } from '../../../../../models/producto';
//import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';
import { DateLikePicker } from '../../../../../models/dateLikePicker';
import { RecursoService } from '../../../../../services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';
import { ModeloDetalle } from '../../../../../models/modeloDetalle';
import { Deposito } from '../../../../../models/deposito';


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
        todos: ProductoPendiente[];
        filtrados: BehaviorSubject<ProductoPendiente[]>;
    } = {todos: [], filtrados: new BehaviorSubject([])}

    @Input() onClickProductoLista;

    ///////// OTROS ///////////
    depositos: Deposito[] = [];
    // Evento select en depositos, acutaliza el deposito seleccionado en ingresoForm.component
    @Input() onSelectDeposito;
    @Input() auxDepositoSelect: Deposito;

    constructor(
        private utilsService: UtilsService,
        private recursoService: RecursoService
    ) {
        // Cargo todos los productos pendientes posibles
        recursoService.getRecursoList(resourcesREST.buscarPendientes)().subscribe(prodsPendPosibles => {
            this.productosBusqueda.todos = prodsPendPosibles;
            this.productosBusqueda.filtrados.next(prodsPendPosibles);
        });

        // Obtengo depositos
        recursoService.getRecursoList(resourcesREST.depositos)().subscribe(
            depositos => this.depositos = depositos
        )
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
            'width': col.ancho,
            'border-top': 'none'
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
            key ? console.log(key) : null;
            key && key.constructor  ? console.log(key.constructor.name) : null;
            if (
                key && 
                (
                    key.constructor.name === 'DateLikePicker' ||
                    key.year && key.month && key.day
                )
            ) {
                return `${key.day<10 ? '0' : ''}${key.day}/${key.month<10 ? '0' : ''}${key.month}/${key.year}`
            }
        };
        
        return key;
    }

    // Checkea si pongo el 'tick' para finalizar la edicion. Osea, si está en edición.
    checkIfEditOn(item) {
        if (this.columns) {
            return this.columns.some(col=>{
                // Lo hago específico porque esta talba es específica, casi que no la reutilizo
                return col.enEdicion && col.enEdicion === item.producto.idProductos
                // if (!col.subkey) {
                //     return col.enEdicion && col.enEdicion === item[this.utilsService.getNameIdKeyOfResource(item)];
                // } else if (col.subkey && !col.subsubkey) {
                //     return col.enEdicion && col.enEdicion === (item[col.key])[this.utilsService.getNameIdKeyOfResource(item[col.key])];
                // } 

            });
        };
    }

    /**
     * Evento change del input de codProducto
     */
    onChangeInputItemAdd = (textoBuscado) => {
        this.productosBusqueda.filtrados.next(
            this.productosBusqueda.todos.filter(
                prodPend => prodPend.producto.codProducto.toString().includes(textoBuscado) || 
                            prodPend.producto.descripcion.toString().toLowerCase().includes(textoBuscado)
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


    /**
     * Setea la fecha de compra calculandola dado un string en formato 'ddmm', parseando a 'dd/mm/aaaa'
     */
    onCalculateFecha = (e) => (key) => (subkey) => (item) => {
        if (!item[key][subkey] || typeof item[key][subkey] !== 'string') return;
        
        item[key][subkey] = this.utilsService.stringToDateLikePicker(item[key][subkey]);

        // Hago focus en el prox input
        (subkey==='fechaElab') ? document.getElementById("fecha-fechaVto").focus() : null;
    }

}