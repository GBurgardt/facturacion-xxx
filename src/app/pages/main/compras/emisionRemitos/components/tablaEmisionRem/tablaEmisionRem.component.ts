
import { Component, Input } from '@angular/core';
import { UtilsService } from 'app/services/utilsService';

import { BehaviorSubject } from 'rxjs';

import { resourcesREST } from 'constantes/resoursesREST';

import { PopupListaService } from 'app/pages/reusable/otros/popup-lista/popup-lista-service';
import { ProductoPendiente } from '../../../../../../models/productoPendiente';
import { RecursoService } from 'app/services/recursoService';


@Component({
    selector: 'tabla-emision-rem',
    templateUrl: './tablaEmisionRem.html',
    styleUrls: ['./tablaEmisionRem.scss']
})
    
export class TablaEmisionRem {
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

    productoSeleccionado: ProductoPendiente = new ProductoPendiente();
    // Inhdice del producto enfocado del popup
    productoEnfocadoIndex: number = -1;

    @Input() onClickProductoLista;

    constructor(
        private utilsService: UtilsService,
        private recursoService: RecursoService,
        private popupListaService: PopupListaService
    ) {
        // Cargo todos los productos pendientes posibles
        recursoService.getRecursoList(resourcesREST.buscaPendientes)().subscribe(prodsPendPosibles => {
            this.productosBusqueda.todos = prodsPendPosibles;
            this.productosBusqueda.filtrados.next(prodsPendPosibles);
        });

        // Obtengo depositos
        // recursoService.getRecursoList(resourcesREST.depositos)().subscribe(
        //     depositos => this.depositos = depositos
        // )
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
        // También reseteo el indice de busqueda
        this.productoEnfocadoIndex = -1;
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

        // Confirmo edicion despues de hacer blur en el último campo
        (subkey === 'fechaVto') ? this.confirmEdit(item) : null;
    }


    /**
     * Evento de cuando se apreta felcha arriba o feclah abajo en input de busca producto
     */
    keyPressInputTexto = (e: any) => (upOrDown) => {
        e.preventDefault();
        // Hace todo el laburo de la lista popup y retorna el nuevo indice seleccionado
        this.popupListaService.keyPressInputForPopup(upOrDown)(this.productosBusqueda.filtrados)(this.productoEnfocadoIndex)
            .subscribe(newIndex => this.productoEnfocadoIndex = newIndex)
            .unsubscribe()
    }

    /**
     * Evento on enter en el input de buscar productos
     */
    onEnterInputBuscProd = (e: any) => {
        e.preventDefault();
        this.productosBusqueda.filtrados.subscribe(prodsLista => {
            // Busco el producto
            const prodSelect = prodsLista && prodsLista.length ? prodsLista[this.productoEnfocadoIndex] : null;
            // Lo selecciono
            prodSelect ? this.onClickProductoListaLocal(prodSelect) : null;
            // Reseteo el indice del prod buscado
            this.productoEnfocadoIndex = -1;
        })
    }

    /**
     * Funcionalidad extra en onclickproductolsita
     */
    onClickProductoListaLocal = (prodSelect) => {
        this.textoBusqueda = '';
        this.onClickProductoLista(prodSelect)
    }

}


/**
 * (
                    this.productoEnfocadoIndex >=0 && this.productoEnfocadoIndex < prodsLista.length-1 ||
                    this.productoEnfocadoIndex === -1 && upOrDown === 'down' ||
                    this.productoEnfocadoIndex === (prodsLista.length - 2) && upOrDown === 'up'
                )
 */