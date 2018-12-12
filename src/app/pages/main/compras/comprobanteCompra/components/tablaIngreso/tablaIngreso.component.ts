
import { Component, Input } from '@angular/core';
import { UtilsService } from '../../../../../../services/utilsService';
import { ProductoPendiente } from '../../../../../../models/productoPendiente';
import { BehaviorSubject } from 'rxjs';
import { RecursoService } from '../../../../../../services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';

import { PopupListaService } from '../../../../../reusable/otros/popup-lista/popup-lista-service';
import sisModulos from 'constantes/sisModulos';
import sisTipoModelos from 'constantes/sisTipoModelos';
import { ProductoReducido } from '../../../../../../models/productoReducido';


@Component({
    selector: 'tabla-ingreso',
    templateUrl: './tablaIngreso.html',
    styleUrls: ['./tablaIngreso.scss']
})

export class TablaIngreso {
    showTooltip = false;
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

    // Lo uso para habilitar/deshabilitar input de ingerso new prod
    @Input() comprobante;


    /////////// BUSQUEDA ///////////
    textoBusqueda: string;
    productosBusqueda: {
        todos: ProductoReducido[];
        filtrados: BehaviorSubject<ProductoReducido[]>;
    } = {todos: [], filtrados: new BehaviorSubject([])}

    productoSeleccionado: ProductoReducido = new ProductoReducido();
    // Inhdice del producto enfocado del popup
    productoEnfocadoIndex: number = -1;

    @Input() onClickProductoLista;

    @Input() customsBlur = null;

    prodFocus = false;

    constructor(
        public utilsService: UtilsService,
        private recursoService: RecursoService,
        private popupListaService: PopupListaService
    ) {
        // Cargo todos los productos pendientes posibles
        // recursoService.getRecursoList(resourcesREST.buscaPendientes)({
        //     'idSisTipoModelo': sisTipoModelos.neto,
        //     'modulo': sisModulos.compra,
        //     'tipo': 'reducida'
        // }).subscribe(prodsPendPosibles => {
        //     debugger;
        //     this.productosBusqueda.todos = prodsPendPosibles;
        //     this.productosBusqueda.filtrados.next(prodsPendPosibles);
        // });

        recursoService.getRecursoList(resourcesREST.productosReducidos)({
            'tipo': 'reducida'
        }).subscribe(prods => {
            // debugger;
            this.productosBusqueda.todos = prods;
            this.productosBusqueda.filtrados.next(prods);
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

        // debugger;

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



    /**
     * Evento change del input de codProducto
     */
    onChangeInputItemAdd = (textoBuscado) => {
        if (textoBuscado) {
            this.productosBusqueda.filtrados.next(
                this.productosBusqueda.todos.filter(
                    prodPend => prodPend.codProducto.toString().includes(
                        textoBuscado.toString().toLowerCase()
                    ) ||
                    prodPend.descripcion.toString().toLowerCase().includes(
                        textoBuscado.toString().toLowerCase()
                    )
                    // prodPend => prodPend.producto.codProducto.toString().includes(
                    //     textoBuscado.toString().toLowerCase()
                    // ) ||
                    // prodPend.producto.descripcion.toString().toLowerCase().includes(
                    //     textoBuscado.toString().toLowerCase()
                    // )
                )
            );
        }
    }

    /**
     * El blur es cuando se hace un leave del input (caundo se apreta click afuera por ejemplo).
     * Acá lo que hago es poner un array vacio como próx valor de los filtrados, cosa que la lista desaparezca porque no hay nada
     */
    onBlurInputItemAdd = () => {
        setTimeout(()=>this.productosBusqueda.filtrados.next([]), 100);
        // También reseteo el indice de busqueda
        this.productoEnfocadoIndex = -1;

        this.prodFocus = false;
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
        this.productoEnfocadoIndex = 
            this.popupListaService.keyPressInputForPopup(upOrDown)(this.productosBusqueda.filtrados.value)(this.productoEnfocadoIndex)
            
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

    /**
     * Retorna la clase del input que se va a poner en edicio y enfocar primero, cuando se apreta en editar
     */
    getClassInputEditable = (item) => (col) => {
        if (item){
            const idItem =  item.cuentaContable ? item.cuentaContable :
                            item.idFormaPagoDet ? item.idFormaPagoDet :

                            item.producto && item.producto.idProductos ? `${item.producto.idProductos}-${item.numero}` : '000'

            // if(item.producto && item.producto.idProductos ) debugger;

            // 'form-control edit-input input-edit-' + item.producto.idProductos
            return `form-control edit-input${col.editarFocus ? ` editar-focus-${idItem}` : '' }`
        }
    }

    // Checkea si pongo el 'tick' para finalizar la edicion.
    checkIfShowTick(item) {
        if (this.columns) {
            return this.columns.some(col=>{

                return col.enEdicion && (
                    (item.cuentaContable && col.enEdicion === item.cuentaContable) ||
                    (item.idFormaPagoDet && col.enEdicion === item.idFormaPagoDet)
                )

            });
        };
    }

    // Cheackea si esta en edicion
    checkIfEditOn = (item) => (col) => col.enEdicion && (
        // (item.producto && item.producto.idProductos && col.enEdicion === item.producto.idProductos) ||
        (item.producto && item.producto.idProductos && col.enEdicion === `${item.producto.idProductos}-${item.numero}`) ||
        (item.cuentaContable && col.enEdicion === item.cuentaContable) ||
        (item.idFormaPagoDet && col.enEdicion === item.idFormaPagoDet)
    )


    getPositionTooltip = () => {
        const fatherPosition = this.getOffsetOfAddInput();

        return {
            top: (fatherPosition.top - 2) + 'px',
            left: (fatherPosition.left + 115) + 'px'
        }
    }


    /**
     * Retorna la function blur de una columna dada (si esta tiene custom blur)
     */
    getFunctionBlurOfColumn = (col) => {
        if (col && col.customBlur) {
            return this.customsBlur[col.customBlur];
        }
    }


    // force2decimals = (event) => event.target.value = parseFloat(event.target.value).toFixed(2);

    force2decimals = (item) => (col) => item && col && col.decimal ?
        item[col.key] = parseFloat(item[col.key]).toFixed(2) : item[col.key]

}


/**
 * (
                    this.productoEnfocadoIndex >=0 && this.productoEnfocadoIndex < prodsLista.length-1 ||
                    this.productoEnfocadoIndex === -1 && upOrDown === 'down' ||
                    this.productoEnfocadoIndex === (prodsLista.length - 2) && upOrDown === 'up'
                )
 */
