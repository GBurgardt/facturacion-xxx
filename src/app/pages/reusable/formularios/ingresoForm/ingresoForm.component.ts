import * as _ from 'lodash';
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
import { Parametro } from '../../../../models/parametro';
import { Cotizacion } from '../../../../models/cotizacion';
import { ModeloFactura } from '../../../../models/modeloFactura';

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

    /////////////////////////////////////////////
    /////////// Modelos Comprobante /////////////
    /////////////////////////////////////////////
    proveedorSeleccionado: Padron = new Padron();

    comprobante: {
        tipo: TipoComprobante,
        preNumero: number,
        numero: number,
        letra: string,
        moneda: Moneda,
        fechaCompra: DateLikePicker,
        fechaVto: DateLikePicker,
        observaciones: string
    } = { tipo: new TipoComprobante(), preNumero: null, numero: null, letra: null, moneda: new Moneda(), fechaCompra: null, fechaVto: null, observaciones: null };

    comprobanteRelacionado: {
        tipo: TipoComprobante,
        preNumero: number,
        numero: number,
        todosLosPendientes: boolean
    } = {tipo: new TipoComprobante(), preNumero: null, numero: null, todosLosPendientes: null};

    cotizacionDatos: {
        cotizacion: Cotizacion,
        total: number
    } = { cotizacion: new Cotizacion(), total: 0};

    factura: {
        tipo: TipoComprobante,
        preNumero: number,
        numero: number,
        fechaContable: DateLikePicker,
        fechaVto: DateLikePicker
    } = { tipo: new TipoComprobante(), preNumero: null, numero: null, fechaContable: null, fechaVto: null }

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

    letras: string[] = [];

    /////////////////////////////////////////////
    ////////////////// Tablas ///////////////////
    /////////////////////////////////////////////
    tablas: {
        columnas: {
            columnasProductos: any[];
            columnasTrazabilidad: any[];
            columnasFactura: any[];
        },
        datos: {
            productosPend: ProductoPendiente[];
            modelosFactura: ModeloFactura[];
        },
        funciones: {
            onClickRemove: any;
            onClickEdit: any;
            onClickConfirmEdit: any;
        }
    } = { 
        columnas: { 
            columnasProductos: [],
            columnasTrazabilidad: [],
            columnasFactura: []
        }, 
        datos: { 
            productosPend: [],
            modelosFactura: []
        },
        funciones: {
            onClickRemove: (prodSelect) => {
                _.remove(this.tablas.datos.productosPend, (prod: ProductoPendiente) => {
                    return prod.idProductos === prodSelect.idProducto;
                });
            },
            onClickEdit: (tipoColumnas) => (prodSelect: ProductoPendiente) => { 
                this.tablas.columnas[tipoColumnas] = this.tablas.columnas[tipoColumnas].map(tabla => {
                    let newTabla = tabla;
                    if (newTabla.enEdicion !== undefined) {
                        newTabla.enEdicion = prodSelect.idProductos
                    }
                    return newTabla;
                });

            },
            onClickConfirmEdit: (tipoColumnas) => (prodSelect: ProductoPendiente) => { 
               // Todos los atributos 'enEdicion' distintos de undefined y también distintos de null o false, los seteo en false
               this.tablas.columnas[tipoColumnas] = this.tablas.columnas[tipoColumnas].map(tabla => {
                   let newTabla = tabla;
                   if (newTabla.enEdicion !== undefined && newTabla.enEdicion) {
                       newTabla.enEdicion = false;
                   }
                   return newTabla;
               })
           }
        }
    };
    

    /////////////////////////////////////////////
    //////////////// PopupLista /////////////////
    /////////////////////////////////////////////

    popupLista: any = {
        onClickListProv: (prove: Padron) => {
            this.proveedorSeleccionado = prove;
        },
        getOffsetOfInputProveedor: () => this.utilsService.getOffset(document.getElementById('proveedorSeleccionado'))
    }

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
        this.letras = this.ingresoFormService.getArrayLetras();

        ////////// Proveedores  //////////
        this.recursoService.getRecursoList(resourcesREST.proveedores)().subscribe(proveedores => {
            this.proveedores.todos = proveedores;
            this.proveedores.filtrados.next(proveedores);
        });

        ////////// Tablas //////////
        this.tablas.columnas.columnasProductos = ingresoFormService.getColumnsProductos();
        this.tablas.columnas.columnasTrazabilidad = ingresoFormService.getColumnsTrazabilidad();
        this.tablas.columnas.columnasFactura = ingresoFormService.getColumnsFactura();

        ////////// Otros //////////
        this.ingresoFormService.getCotizacionDatos().subscribe(cotizDatos => this.cotizacionDatos.cotizacion = cotizDatos);
    }

    ///////////////////////////////// Eventos OnClick /////////////////////////////////

    /**
     * Busca los productos pendientes de acuerdo al comprobante relacionado
     */
    onClickBuscarPendientes = () => {
        this.ingresoFormService.buscarPendientes(this.proveedorSeleccionado)(this.comprobanteRelacionado).subscribe(prodsPend=>
            this.tablas.datos.productosPend = _.uniqWith(
                this.tablas.datos.productosPend.concat(prodsPend),
                (a:ProductoPendiente,b:ProductoPendiente) => a.producto.codProducto === b.producto.codProducto
            )
        );
        this.ingresoFormService.buscarPendientes(this.proveedorSeleccionado)(this.comprobanteRelacionado).subscribe(prodsPend=>console.log(prodsPend));
    }

    /**
     * Agrega el producto seleccionado a la lista de productosPendientes
     */
    onClickProductoLista = (producto: Producto) => {
        const productoBuscado = new ProductoPendiente(producto);

        this.tablas.datos.productosPend = _.unionBy(
            this.tablas.datos.productosPend, 
            [productoBuscado], 
            'idProductos'
        );
    }

    /**
     * 
     */
    onClickConfirmar = () => {
        
    }

    ///////////////////////////////// Eventos (Distintos de onclick) /////////////////////////////////
    
    /**
     * Evento change del input del proovedor
     */
    onChangeInputProveedor = (codigo) => {
        this.proveedores.filtrados.next(
            this.ingresoFormService.filtrarProveedores(this.proveedores.todos, codigo)
        );
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
     * El blur es cuando se hace un leave del input (caundo se apreta click afuera por ejemplo).
     * Acá lo que hago es poner un array vacio como próx valor de los filtrados, cosa que la lista desaparezca porque no hay nada
     */
    onBlurInputProv = (e) => {
        // Agrego el settimeout para que se ejecute antes el evento click de la lista, sino se ejecuta antes este y nunca se ejecuta el click de la lista
        setTimeout(()=>this.proveedores.filtrados.next([]), 100)
    }


    /**
     * Evento click de la pesñta factura. Recarga los modelos de la factura
     */
    onClickFacturaTab = () => {
        // Checkeo si existe algun producto sin precio o sin cantidad asignado
        const existeProdSinPrecioOCantidad = this.tablas.datos.productosPend.some(
            prodPend => !prodPend.precio || !prodPend.pendiente
        );

        // Si existe, entonces NO hago la consulta y aviso al usuario tal sitaucion
        if (existeProdSinPrecioOCantidad) {
            this.utilsService.showModal('Aviso')('Algunos productos no tienen precio o cantidad definida')()();
        } else {
            // Caso contrario puedo proseguir y hacer la consulta libremente
            this.ingresoFormService.buscaModelos(this.tablas.datos.productosPend).subscribe(modelProds => {
                this.tablas.datos.modelosFactura = modelProds
            });
        }
    }
}
