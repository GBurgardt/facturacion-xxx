import { Component, Input } from '@angular/core';

import { UtilsService } from 'app/services/utilsService';
import { Observable } from 'rxjs/Observable';
import { Producto } from 'app/models/producto';
import { Padron } from '../../../../models/padron';
import { RecursoService } from 'app/services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';
import { IngresoFormService } from 'app/pages/reusable/formularios/ingresoForm/ingresoFormService';
import { SisTipoOperacion } from 'app/models/sisTipoOperacion';
import { TipoComprobante } from 'app/models/tipoComprobante';
import { Moneda } from '../../../../models/moneda';
import { ProductoPendiente } from 'app/models/productoPendiente';
import { DateLikePicker } from '../../../../models/dateLikePicker';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'ingreso-form',
    templateUrl: './ingresoForm.html',
    styleUrls: ['./ingresoForm.scss']
})

/**
 * Form reutilizable
 */
export class IngresoForm {
    @Input() titulo = 'test';
    @Input() recurso;

    /////////////////////////////////////////////
    /////////// Modelos Comprobante /////////////
    /////////////////////////////////////////////
    proveedorSeleccionado: Padron = new Padron();

    comprobante: {
        tipo: TipoComprobante,
        numero: number,
        moneda: Moneda,
        fechaCompra: DateLikePicker,
        fechaVto: DateLikePicker
    } = {tipo: new TipoComprobante(), numero: null, moneda: new Moneda(), fechaCompra: null, fechaVto: null};

    comprobanteRelacionado: {
        tipo: TipoComprobante,
        numero: number,
        todosLosPendientes: boolean
    } = {tipo: new TipoComprobante(), numero: null, todosLosPendientes: null};

    totalDatos: {
        cotizaDolar: number,
        fecha: DateLikePicker,
        totalComprobante: number
    } = {
        cotizaDolar: null,
        fecha: null,
        totalComprobante: null
    };

    /////////////////////////////////////////////
    //////////// Listas desplegables ////////////
    /////////////////////////////////////////////
    tiposComprobantes: Observable<TipoComprobante[]>;
    tiposOperacion: Observable<SisTipoOperacion[]>;
    monedas: Observable<Moneda[]>;

    // Lista de proveedores completa (necesaria para filtrar) y filtrada
    proveedores: {
        todos: Padron[];
        filtrados: BehaviorSubject<Padron[]>;
    } = {todos: [], filtrados: new BehaviorSubject([])}

    /////////////////////////////////////////////
    ////////////////// Tablas ///////////////////
    /////////////////////////////////////////////
    tablas: {
        columnas: {
            columnasProductos: any[];
        },
        datos: {
            datosProductos: ProductoPendiente[];
        },
        funciones: {
            onClickRemove: any;
            onClickEdit: any;
            onClickConfirmEdit: any;
        }
    } = { 
        columnas: { 
            columnasProductos: [] 
        }, 
        datos: { 
            datosProductos: [] 
        },
        funciones: {
            onClickRemove: (prodSelect) => this.tablas.datos.datosProductos = this.tablas.datos.datosProductos.filter(prod => prod.codProducto === prodSelect.codProducto),
            onClickEdit: (prodSelect: ProductoPendiente) => { 
                this.tablas.columnas.columnasProductos = this.tablas.columnas.columnasProductos.map(tabla => {
                    let newTabla = tabla;
                    if (newTabla.enEdicion !== undefined) {
                        newTabla.enEdicion = prodSelect.codProducto
                    }
                    return newTabla;
                });

                console.log(this.tablas.columnas.columnasProductos);
            },
            onClickConfirmEdit: (prodSelect: ProductoPendiente) => { 
               // Todos los atributos 'enEdicion' distintos de undefined y también distintos de null o false, los seteo en false
               this.tablas.columnas.columnasProductos = this.tablas.columnas.columnasProductos.map(tabla => {
                   let newTabla = tabla;
                   if (newTabla.enEdicion !== undefined && newTabla.enEdicion) {
                       newTabla.enEdicion = false;
                   }
                   return newTabla;
               })
           }
        }
    };
    


    /**
     * Toda la carga de data se hace en el mismo orden en el que está declarado arriba
     */
    constructor(
        private recursoService: RecursoService,
        private ingresoFormService: IngresoFormService,
        private utilsService: UtilsService
    ) {
        ////////// Listas desplegables  //////////
        this.tiposComprobantes = this.recursoService.getRecursoList(resourcesREST.cteTipo)();
        this.tiposOperacion = this.recursoService.getRecursoList(resourcesREST.sisTipoOperacion)();
        this.monedas = this.recursoService.getRecursoList(resourcesREST.sisMonedas)();

        ////////// Proveedores  //////////
        this.recursoService.getRecursoList(resourcesREST.proveedores)().subscribe(proveedores => {
            this.proveedores.todos = proveedores;
            this.proveedores.filtrados.next(proveedores);
        });

        ////////// Tablas //////////
        this.tablas.columnas.columnasProductos = ingresoFormService.getColumnsProductos();
    }

    /**
     * Evento change del input del proovedor
     */
    onChangeInputProveedor = (codigo) => {
        this.proveedores.filtrados.next(
            this.ingresoFormService.filtrarProveedores(this.proveedores.todos, codigo)
        );
    }

    /**
     * Click en la lista de proveedores (se pasa como callback de popup-lista)
     */
    onClickListProv = (prove: Padron) => {
        this.proveedorSeleccionado = prove;
    }

    /**
     * On enter en inputprov
     */
    onEnterInputProv = (e) => {
        try {
            const codProv = e.target.value;
            const provSeleccionado = this.proveedores.todos.find((prove) => prove.padronCodigo.toString() === codProv);
            if (provSeleccionado) {
                this.proveedorSeleccionado = provSeleccionado;
            } else {
                this.utilsService.showModal('Codigo incorrecto')('El codigo no existe')()();
            }
        }
        catch(ex) {
            this.utilsService.showModal('Codigo incorrecto')('El codigo no existe')()();
        }
    }

    /**
     * Busca los productos pendientes de acuerdo al comprobante relacionado
     */
    onClickBuscarPendientes = () => {
        this.ingresoFormService.buscarPendientes(this.proveedorSeleccionado)(this.comprobanteRelacionado).subscribe(prodsPend=>
            this.tablas.datos.datosProductos = prodsPend
        )
    }

    /**
     * El blur es cuando se hace un leave del input (caundo se apreta click afuera por ejemplo).
     * Acá lo que hago es poner un array vacio como próx valor de los filtrados, cosa que la lista desaparezca porque no hay nada
     */
    onBlurInputProv = (e) => {
        // Agrego el settimeout para que se ejecute antes el evento click de la lista, sino se ejecuta antes este y nunca se ejecuta el click de la lista
        setTimeout(()=>this.proveedores.filtrados.next([]), 100)
    }

    /**
     * Agrega el producto seleccionado a la lista de productosPendientes
     */
    onClickProductoLista = (producto: Producto) => {
        const productoBuscado = new ProductoPendiente(null, producto);
        this.tablas.datos.datosProductos.push(productoBuscado);
    }

    /**
     * Retorna el offset del input del proveedor
     */
    getOffsetOfInputProveedor = () => {
        return this.utilsService.getOffset(document.getElementById('proveedorSeleccionado')); 
    }

}
