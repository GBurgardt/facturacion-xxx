import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RecursoService } from '../../../../services/recursoService';
import { PopupListaService } from '../popup-lista/popup-lista-service';
import { BehaviorSubject, Observable } from 'rxjs';
import { ListPopupService } from './components/listPopup/listPopupService';

@Component({
    selector: 'list-finder',
    styleUrls: ['./listFinder.scss'],
    templateUrl: './listFinder.html'
})
export class ListFinder {

    @Input() title = '';
    @Input() items = Observable.of([])
    @Input() keysToShow = [];

    @Output() onSelectItem = new EventEmitter<any>();


    search = '';

    itemsPlain = {
        all: [],
        filtered: new BehaviorSubject([])
    }

    focusIndex = -1;

    constructor(
        private listPopupService: ListPopupService
    ) {

    }

    ngOnChanges() {
        this.items.subscribe(observedItems => {
            this.itemsPlain.all = observedItems;
            this.itemsPlain.filtered.next(observedItems);
            debugger;
        })
    }

    /**
     * Change event input (when inputeas algo)
     */
    onChangeSearch = (value) => {
        // Filtro por busqueda
        this.itemsPlain.filtered.next(
            this.listPopupService.filterItems(
                this.itemsPlain.all
            )(
                value
            )(
                this.keysToShow
            )
        );

        // Reseteo el indice
        this.focusIndex = -1;
    }

    /**
     * When press UP or DOWN
     */
    keyPressInput = (e: any) => (upOrDown) => {

        e.preventDefault();
        // Hace todo el laburo de la lista popup y retorna el nuevo indice seleccionado
        this.focusIndex = this.listPopupService.keyPressInputForPopup(
            upOrDown
        )(
            this.itemsPlain.filtered.value.length
        )(
            this.focusIndex
        )(
            this.keysToShow
        );
    }

    _onSelectItemList = (item) => {
        this.onSelectItem.emit(item);
        // Vacio filtrados y focus lote input
        this.itemsPlain.filtered.next([]);
    }

    /**
     * Evento on enter en el input de buscar cliente
     */
    // onEnterInputProd = (e: any) => {
    //     e.preventDefault();

    //     // Busco el producto
    //     const prodsLista = this.items.filtrados;
    //     const prodSelect: any = prodsLista && prodsLista.length ? prodsLista[this.focusIndex] : null;
    //     // Lo selecciono
    //     prodSelect ? this.onSelectProducto(prodSelect) : null;
    //     // Reseteo el index
    //     this.focusIndex = -1;
    //     // Vacio filtrados y focus lote input
    //     this.items.filtrados = [];
    //     document.getElementById('inputLoteNro') ? document.getElementById('inputLoteNro').focus() : null
    // }




    // onBlurInputProd = (evento) => {
    //     if (!evento.target.value || evento.target.value.toString().length <= 0) return;

    //     // Busco si existe
    //     const prodExist = this.items.todos.find(
    //         p => p.codProducto.toString() === evento.target.value.toString()
    //     )

    //     // Si existe actualizo el existente
    //     if (prodExist && prodExist.idProductos) {
    //         this.onSelectProducto(prodExist);
    //     } else {
    //         this.filtros.codProducto = null;
    //         this.filtros.productoSelect = null;
    //         // this.info.nombreProd = null;
    //     }
    //     // Vacio filtrados
    //     this.items.filtrados = [];
    //     // Hago focus en input producto
    //     document.getElementById('inputLoteNro') ? document.getElementById('inputLoteNro').focus() : null

    // }


}
