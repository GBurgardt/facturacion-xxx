import { Component } from '@angular/core';
import { RecursoService } from '../../../../services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';

import { BehaviorSubject } from 'rxjs';
import { Lotes } from '../lotes.component';
import { UtilsService } from 'app/services/utilsService';
import { Padron } from 'app/models/padron';
import { Producto } from '../../../../models/producto';
import { PopupListaService } from 'app/pages/reusable/otros/popup-lista/popup-lista-service';
import { ConsultaLotesService } from 'app/pages/main/lotes/consultaLotes/consultaLotesService';

@Component({
    selector: 'consulta-lotes',
    styleUrls: ['./consultaLotes.scss'],
    templateUrl: './consultaLotes.html'
})
export class ConsultaLotes {
    resourcesREST = resourcesREST;

    // Data de la tabla
    lotes: BehaviorSubject<Lotes[]> = new BehaviorSubject([]);

    // Busquedas
    proveedores: { todos: Padron[]; filtrados: BehaviorSubject<Padron[]> } = { todos: [], filtrados: new BehaviorSubject([]) }
    productos: { todos: Producto[]; filtrados: BehaviorSubject<Producto[]> } = { todos: [], filtrados: new BehaviorSubject([]) }
    
    
    // Filtros
    filtros: {
        idPadron: string,
        nroLote: string,
        codProducto: string,
        fechaVtoHasta: any
    } = {
        idPadron: null,
        nroLote: null,
        codProducto: null,
        fechaVtoHasta: null
    };

    // Info seleccionados
    info: {
        nombreProv: string,
        nombreProd: string
    } = {
        nombreProv: null,
        nombreProd: null
    }

    // Indices
    proveedorEnfocadoIndex: number = -1;
    productoEnfocadoIndex: number = -1;

    constructor(
        private utilsService: UtilsService,
        private popupListaService: PopupListaService,
        private recursoService: RecursoService,
        private consultaLotesService: ConsultaLotesService
    ) {
        this.recursoService.getRecursoList(resourcesREST.proveedores)().subscribe(proveedores => {
            this.proveedores.todos = proveedores;
            this.proveedores.filtrados.next(proveedores);
        });
        this.recursoService.getRecursoList(resourcesREST.productos)().subscribe(productos => {
            this.productos.todos = productos;
            this.productos.filtrados.next(productos);
        });
    }

  

    blurFechaVencHasta = (e) => (!this.filtros.fechaVtoHasta || typeof this.filtros.fechaVtoHasta !== 'string') ?
        null : this.filtros.fechaVtoHasta = this.utilsService.stringToDateLikePicker(this.filtros.fechaVtoHasta);     
    

    onSelectProveedor = (prov: Padron) => {
        this.filtros.idPadron = prov.padronCodigo.toString();
        this.info.nombreProv = prov.padronApelli;
    }

    onSelectProducto = (prod: Producto) => {
        this.filtros.codProducto = prod.codProducto.toString();
        this.info.nombreProd = prod.descripcion;
    }


    ///// EVENTOS BUSQUEDA PROVEEDOR /////
    /**
     * Evento de cuando se apreta felcha arriba o feclah abajo en input de busca cliente
     */
    keyPressInputTextoProv = (e: any) => (upOrDown) => {
        e.preventDefault();
        // Hace todo el laburo de la lista popup y retorna el nuevo indice seleccionado
        this.popupListaService.keyPressInputForPopup(upOrDown)(this.proveedores.filtrados)(this.proveedorEnfocadoIndex)
            .subscribe(newIndex => this.proveedorEnfocadoIndex = newIndex)
            .unsubscribe()
    }

    /**
     * Evento on enter en el input de buscar cliente
     */
    onEnterInputProv = (e: any) => {
        e.preventDefault();
        this.proveedores.filtrados.subscribe(provsLista => {
            // Busco el producto
            const provSelect = provsLista && provsLista.length ? provsLista[this.proveedorEnfocadoIndex] : null;
            // Lo selecciono
            provSelect ? this.onSelectProveedor(provSelect) : null;
            // Reseteo el index
            this.proveedorEnfocadoIndex = -1;
            // Vacio filtrados y focus produc
            this.proveedores.filtrados.next([]);
            document.getElementById('inputProducto') ? document.getElementById('inputProducto').focus() : null
        })
    }

    /**
     * Evento change del input del proovedor
     */
    onChangeInputProv = (codigo) => {
        this.proveedores.filtrados.next(
            this.consultaLotesService.filtrarProveedores(this.proveedores.todos, codigo)
        );
        // Reseteo el indice
        this.proveedorEnfocadoIndex = -1;
    }
    
    onBlurInputProv = (evento) => {
        if (!evento.target.value || evento.target.value.toString().length <= 0) return;            

        // Busco si existe
        const provExist = this.proveedores.todos.find(
            p => p.padronCodigo.toString() === evento.target.value.toString()
        )

        // Si existe actualizo el existente
        if (provExist && provExist.padronCodigo) {
            this.onSelectProveedor(provExist);
        }

        // Vacio filtrados
        this.proveedores.filtrados.next([]);
        // Hago focus en input producto
        document.getElementById('inputProducto') ? document.getElementById('inputProducto').focus() : null

    }


    ///// EVENTOS BUSQUEDA PRODUCTO /////

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
        this.productos.filtrados.subscribe(prodsLista => {
            // Busco el producto
            const prodSelect: any = prodsLista && prodsLista.length ? prodsLista[this.productoEnfocadoIndex] : null;
            // Lo selecciono
            prodSelect ? this.onSelectProducto(prodSelect) : null;
            // Reseteo el index
            this.productoEnfocadoIndex = -1;
            // Vacio filtrados y focus lote input
            this.productos.filtrados.next([]);
            document.getElementById('inputLoteNro') ? document.getElementById('inputLoteNro').focus() : null
        })
    }

    /**
     * Evento change del input del proovedor
     */
    onChangeInputProd = (valor) => {
        this.productos.filtrados.next(
            this.consultaLotesService.filtrarProductos(this.productos.todos, valor)
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
        }
        // Vacio filtrados
        this.productos.filtrados.next([]);
        // Hago focus en input producto
        document.getElementById('inputLoteNro') ? document.getElementById('inputLoteNro').focus() : null

    }



    /**
     * Evento click consultar
     */
    onClickConsultar = () => {

        this.consultaLotesService.consultarLotes(this.filtros).subscribe(lotes => {
            // debugger;
            this.lotes.next(lotes)
        })
    }
}
