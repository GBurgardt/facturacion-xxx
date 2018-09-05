import { Component } from '@angular/core';
import { UtilsService } from '../../../../services/utilsService';
import { Observable } from 'rxjs/Observable';
import { RecursoService } from '../../../../services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';
import { PopupListaService } from '../../../reusable/otros/popup-lista/popup-lista-service';
import { Producto } from 'app/models/producto';
import { BehaviorSubject } from '../../../../../../node_modules/rxjs';
import { ConsultaGeneralService } from './consultaGeneralService';
import { Rubro } from 'app/models/rubro';

@Component({
    selector: 'consulta-general',
    styleUrls: ['./consultaGeneral.scss'],
    templateUrl: './consultaGeneral.html'
})

export class ConsultaGeneral {
    // Data de la tabla
    stockData = Observable.of([]);

    // Filtros
    filtros: {
        fechaHasta: any,
        codProducto: any,
        codProducto2: any,
        productoSelect: any,
        productoSelect2: any,
        rubro: any,
        subrubro: any
    } = {
        fechaHasta: null,
        codProducto: null,
        codProducto2: null,
        productoSelect: null,
        productoSelect2: null,
        rubro: null,
        subrubro: null
    }

    // Desplegables
    rubros = Observable.of([]);
    subRubros = Observable.of([]);

    // Indices
    productoEnfocadoIndex = -1;
    productoEnfocadoIndex2 = -1;

    // Busquedas
    productos: { todos: Producto[]; filtrados: BehaviorSubject<Producto[]> } = { todos: [], filtrados: new BehaviorSubject([]) }
    productos2: { todos: Producto[]; filtrados: BehaviorSubject<Producto[]> } = { todos: [], filtrados: new BehaviorSubject([]) }

    constructor(
        private recursoService: RecursoService,
        private utilsService: UtilsService,
        private popupListaService: PopupListaService,
        private consultaGeneralService: ConsultaGeneralService
    ) {
        this.recursoService.getRecursoList(resourcesREST.productos)().subscribe(productos => {
            this.productos.todos = productos;
            this.productos.filtrados.next(productos);
            this.productos2.todos = productos;
            this.productos2.filtrados.next(productos);
        });

        this.rubros = this.recursoService.getRecursoList(resourcesREST.rubros)()
        // this.subRubros = this.recursoService.getRecursoList(resourcesREST.subRubros)()
    }

    /**
     * Autocompletar fechaHasta
     */
    onBlurFechaHasta = (e) => (!this.filtros.fechaHasta || typeof this.filtros.fechaHasta !== 'string') ?
        null : this.filtros.fechaHasta = this.utilsService.stringToDateLikePicker(this.filtros.fechaHasta);

    onClickConsultar = () => {
        this.stockData = this.consultaGeneralService.consultarStock(this.filtros);
    }

    ///// EVENTOS BUSQUEDA PRODUCTO 1 /////

    keyPressInputTextoProd = (e: any) => (upOrDown) => {
        e.preventDefault();
        // Hace todo el laburo de la lista popup y retorna el nuevo indice seleccionado
        this.popupListaService.keyPressInputForPopup(upOrDown)(this.productos.filtrados)(this.productoEnfocadoIndex)
            .subscribe(newIndex => this.productoEnfocadoIndex = newIndex)
            .unsubscribe()
    }

    /**
     * Evento on enter en el input de buscar cliente
     */
    onEnterInputProd = (e: any) => {
        e.preventDefault();

        // Busco el producto
        const prodsLista = this.productos.filtrados.value;
        const prodSelect: any = prodsLista && prodsLista.length ? prodsLista[this.productoEnfocadoIndex] : null;
        // Lo selecciono
        prodSelect ? this.onSelectProducto(prodSelect) : null;
        // Reseteo el index
        this.productoEnfocadoIndex = -1;
        // Vacio filtrados y focus lote input
        this.productos.filtrados.next([]);
        document.getElementById('inputLoteNro') ? document.getElementById('inputLoteNro').focus() : null
    }

    /**
     * Evento change del input del proovedor
     */
    onChangeInputProd = (valor) => {
        this.productos.filtrados.next(
            this.consultaGeneralService.filtrarProductos(this.productos.todos, valor)
        );
        // Reseteo el indice
        this.productoEnfocadoIndex = -1;
    }

    onBlurInputProd = (evento) => {

        if (!evento.target.value || evento.target.value.toString().length <= 0) return;

        // Busco si existe
        const prodExist = this.productos.todos.find(
            p => p.codProducto.toString() === evento.target.value.toString()
        )

        // Si existe actualizo el existente
        if (prodExist && prodExist.idProductos) {
            this.onSelectProducto(prodExist);
        } else {
            this.filtros.codProducto = null;
            this.filtros.productoSelect = null;
            // this.info.nombreProd = null;
        }
        // Vacio filtrados
        this.productos.filtrados.next([]);
        // Hago focus en input producto
        document.getElementById('inputLoteNro') ? document.getElementById('inputLoteNro').focus() : null

    }

    onSelectProducto = (prod: Producto) => {
        this.filtros.codProducto = prod.codProducto.toString();
        this.filtros.productoSelect = prod;
        // this.info.nombreProd = prod.descripcion;
    }


    ///// EVENTOS BUSQUEDA PRODUCTO 2 /////

    keyPressInputTextoProd2 = (e: any) => (upOrDown) => {
        e.preventDefault();
        // Hace todo el laburo de la lista popup y retorna el nuevo indice seleccionado
        this.popupListaService.keyPressInputForPopup(upOrDown)(this.productos2.filtrados)(this.productoEnfocadoIndex2)
            .subscribe(newIndex => this.productoEnfocadoIndex2 = newIndex)
            .unsubscribe()
    }

    /**
     * Evento on enter en el input de buscar cliente
     */
    onEnterInputProd2 = (e: any) => {
        e.preventDefault();
        this.productos2.filtrados.subscribe(prodsLista => {
            // Busco el producto
            const prodSelect: any = prodsLista && prodsLista.length ? prodsLista[this.productoEnfocadoIndex] : null;
            // Lo selecciono
            prodSelect ? this.onSelectProducto2(prodSelect) : null;
            // Reseteo el index
            this.productoEnfocadoIndex2 = -1;
            // Vacio filtrados y focus lote input
            this.productos2.filtrados.next([]);

            document.getElementById('inputLoteNro') ? document.getElementById('inputLoteNro').focus() : null
        })
    }

    /**
     * Evento change del input del proovedor
     */
    onChangeInputProd2 = (valor) => {
        this.productos2.filtrados.next(
            this.consultaGeneralService.filtrarProductos(this.productos2.todos, valor)
        );
        // Reseteo el indice
        this.productoEnfocadoIndex2 = -1;
    }

    onBlurInputProd2 = (evento) => {

        if (!evento.target.value || evento.target.value.toString().length <= 0) return;

        // Busco si existe
        const prodExist = this.productos2.todos.find(
            p => p.codProducto.toString() === evento.target.value.toString()
        )

        // Si existe actualizo el existente
        if (prodExist && prodExist.idProductos) {
            this.onSelectProducto2(prodExist);
        } else {
            this.filtros.codProducto2 = null;
            this.filtros.productoSelect2 = null;
            // this.info.nombreProd2 = null;
        }
        // Vacio filtrados
        this.productos2.filtrados.next([]);
        // Hago focus en input producto
        document.getElementById('inputLoteNro') ? document.getElementById('inputLoteNro').focus() : null

    }

    onSelectProducto2 = (prod: Producto) => {
        this.filtros.codProducto2 = prod.codProducto.toString();
        this.filtros.productoSelect2 = prod;
        // this.info.nombreProd2 = prod.descripcion;
    }

    //////////////////////////////////////////////////////////////////////
    
    /**
     * Cuanbdo cambia Rubro, actualizo SubRubros
     */
    onChangeRubro = (rubroSelect: Rubro) => {
        if (rubroSelect) {
            this.subRubros = this.recursoService.getRecursoList(resourcesREST.subRubros)({
                'idRubro': rubroSelect.idRubro
            })
        }

    }

}




