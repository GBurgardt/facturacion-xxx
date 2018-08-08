import * as _ from 'lodash';
import { Component, Input } from '@angular/core';

import { UtilsService } from 'app/services/utilsService';
import { Observable } from 'rxjs/Observable';
import { Padron } from '../../../../models/padron';
import { RecursoService } from 'app/services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';

import { SisTipoOperacion } from 'app/models/sisTipoOperacion';
import { TipoComprobante } from 'app/models/tipoComprobante';
import { Moneda } from '../../../../models/moneda';
import { ProductoPendiente } from 'app/models/productoPendiente';
import { BehaviorSubject } from 'rxjs';
import { Cotizacion } from '../../../../models/cotizacion';
import { ModeloFactura } from '../../../../models/modeloFactura';
import { Comprobante } from 'app/models/comprobante';
import { ComprobanteRelacionado } from 'app/models/comprobanteRelacionado';
import { Factura } from '../../../../models/factura';
import { Deposito } from 'app/models/deposito';
import { PopupListaService } from 'app/pages/reusable/otros/popup-lista/popup-lista-service';
import { ComprobanteCompraService } from './comprobanteCompraService';

@Component({
    selector: 'comprobante-compra',
    templateUrl: './comprobanteCompra.html',
    styleUrls: ['./comprobanteCompra.scss']
})

/**
 * Form reutilizable
 */
export class ComprobanteCompra {
    @Input() titulo = '';
    

    /////////////////////////////////////////////
    /////////// Modelos Comprobante /////////////
    /////////////////////////////////////////////
    proveedorSeleccionado: Padron = new Padron();
    comprobante: Comprobante = new Comprobante();
    comprobanteRelacionado: ComprobanteRelacionado = new ComprobanteRelacionado()
    factura: Factura = new Factura();
    cotizacionDatos: {
        cotizacion: Cotizacion,
        total: number
    } = { cotizacion: new Cotizacion(), total: 0};

    depositoSelec: Deposito;

    // Inhdice del producto enfocado del popup
    proveedorEnfocadoIndex: number = -1;

    // Suma de todos los subtotales
    sumatoriaSubtotales: number = 0;

    /////////////////////////////////////////////
    //////////// Listas desplegables ////////////
    /////////////////////////////////////////////
    tiposComprobantes: Observable<TipoComprobante[]>;
    tiposOperacion: Observable<SisTipoOperacion[]>;
    monedas: Observable<Moneda[]>;
    depositos: Observable<Deposito[]>;

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
            onClickRemove: (prodSelect: ProductoPendiente) => {
                _.remove(this.tablas.datos.productosPend, (prod: ProductoPendiente) => {
                    return prod.producto.idProductos === prodSelect.producto.idProductos;
                });
            },
            onClickEdit: (tipoColumnas) => (itemSelect: any) => { 
                // this.tablas.columnas[tipoColumnas] = this.tablas.columnas[tipoColumnas].map(tabla => {
                //     let newTabla = tabla;
                //     if (newTabla.enEdicion !== undefined) {
                //         newTabla.enEdicion = prodSelect.producto.idProductos
                //     }
                //     return newTabla;
                // });

                // // Hago focus en el select de imputacion
                // setTimeout(()=>{
                //     const selectImpu: any = document.getElementsByClassName('select-impu-'+prodSelect.producto.idProductos);
                //     if(selectImpu && selectImpu[0]) {
                //         selectImpu[0].focus();
                //     } else {
                //         const inputFocus: any = document.getElementsByClassName('input-edit-'+prodSelect.producto.idProductos);
                //         inputFocus && inputFocus[0] ? inputFocus[0].focus() : null
                //     }
                // });


                this.tablas.columnas[tipoColumnas] = this.tablas.columnas[tipoColumnas].map(tabla => {
                    let newTabla = tabla;
                    if (newTabla.enEdicion !== undefined) {
                        
                        tipoColumnas === 'columnasProductos' ? newTabla.enEdicion = itemSelect.producto.idProductos :
                        tipoColumnas === 'columnasTrazabilidad' ? newTabla.enEdicion = itemSelect.producto.idProductos :
                        tipoColumnas === 'columnasFactura' ? newTabla.enEdicion = itemSelect.cuentaContable : null
                    }
                    return newTabla;
                });
        
                // Hago focus en el select de imputacion
                setTimeout(() => {
        
                    const idItem =  itemSelect.cuentaContable ? itemSelect.cuentaContable : 
                                    itemSelect.producto && itemSelect.producto.idProductos ? itemSelect.producto.idProductos : '000';
        
                    const inputFocusClass = 'editar-focus-'+idItem;
        
                    const elementFocus: any = document.getElementsByClassName(inputFocusClass);
                    elementFocus && elementFocus[0] ? elementFocus[0].focus() : null
                });
            },
            onClickConfirmEdit: (tipoColumnas) => (itemSelect: any) => { 
                // Actualizo datos dle producto (si NO son las facturas lo que se edita)
                if (tipoColumnas !== 'columnasFactura')
                    this.actualizarDatosProductos();

                // Todos los atributos 'enEdicion' distintos de undefined y también distintos de null o false, los seteo en false
                this.tablas.columnas[tipoColumnas] = this.tablas.columnas[tipoColumnas].map(tabla => {
                    let newTabla = tabla;
                    if (newTabla.enEdicion !== undefined && newTabla.enEdicion) {
                        // Seteo en false asi sale de edicion
                        newTabla.enEdicion = false;
                    }
                    return newTabla;
                })

                // Hago la sumatoria de los subtotales de la factura
                if (tipoColumnas === 'columnasFactura') {
                    
                    // Actualizo el Total Comprobante sumando todos los precios nuevamente (no le sumo directamente el precio editado porque no es un precio nuevo, sino que ya está y debería sumarle la diferencia editada nomás)
                    this.sumatoriaSubtotales = Math.round(
                        _.sumBy(
                            this.tablas.datos.modelosFactura,
                            (fact) => Number(fact.importeTotal) ? Number(fact.importeTotal) : 0
                        )
                    );

                }

           }
        }
    };
    

    /////////////////////////////////////////////
    //////////////// PopupLista /////////////////
    /////////////////////////////////////////////

    popupLista: any = {
        onClickListProv: (prove: Padron) => {
            this.proveedorSeleccionado = new Padron({...prove});
            this.comprobanteCompraService.getLetrasProveedor(this.proveedorSeleccionado).subscribe(letras => this.letras = letras);
        },
        getOffsetOfInputProveedor: () => this.utilsService.getOffset(document.getElementById('inputProveedor'))
    }

    /**
     * Toda la carga de data se hace en el mismo orden en el que está declarado arriba
     */
    constructor(
        private recursoService: RecursoService,
        private comprobanteCompraService: ComprobanteCompraService,
        private utilsService: UtilsService,
        private popupListaService: PopupListaService
    ) {
        ////////// Listas desplegables  //////////
        // Trae los tipoComprobante solamente del modulo 1 (Modulo Compra)
        this.tiposComprobantes = this.recursoService.getRecursoList(resourcesREST.cteTipo)({
            'sisModulo': 1
        });
        this.tiposOperacion = this.recursoService.getRecursoList(resourcesREST.sisTipoOperacion)();
        this.monedas = this.recursoService.getRecursoList(resourcesREST.sisMonedas)();
        this.depositos = this.recursoService.getRecursoList(resourcesREST.depositos)();


        ////////// Proveedores  //////////
        this.recursoService.getRecursoList(resourcesREST.proveedores)().subscribe(proveedores => {
            this.proveedores.todos = proveedores;
            this.proveedores.filtrados.next(proveedores);
        });

        ////////// Tablas //////////
        this.tablas.columnas.columnasProductos = comprobanteCompraService.getColumnsProductos();
        this.tablas.columnas.columnasTrazabilidad = comprobanteCompraService.getColumnsTrazabilidad();
        this.tablas.columnas.columnasFactura = comprobanteCompraService.getColumnsFactura();

        ////////// Otros //////////
        this.comprobanteCompraService.getCotizacionDatos().subscribe(cotizDatos => this.cotizacionDatos.cotizacion = cotizDatos);
    }

    ///////////////////////////////// Eventos OnClick /////////////////////////////////

    /**
     * Busca los productos pendientes de acuerdo al comprobante relacionado
     */
    onClickBuscarPendientes = () => 
        this.comprobanteCompraService.buscarPendientes(this.proveedorSeleccionado)(this.comprobanteRelacionado)
            .subscribe(
                prodsPend => {
                    // Agrego los productos
                    this.tablas.datos.productosPend = _.uniqWith(
                        this.tablas.datos.productosPend.concat(prodsPend),
                        (a:ProductoPendiente,b:ProductoPendiente) => a.producto.codProducto === b.producto.codProducto
                    );

                    // Actualizo datos de los productos
                    this.actualizarDatosProductos();
                },
                error => this.utilsService.decodeErrorResponse(error)
            );
    

    /**
     * Agrega el producto seleccionado a la lista de productosPendientes
     */
    onClickProductoLista = (prodSelec: ProductoPendiente) => {
        const existeProd = this.tablas.datos.productosPend.find(prod=>prod.producto.idProductos === prodSelec.producto.idProductos)

        if (!existeProd) {
            this.tablas.datos.productosPend.push(prodSelec);
            this.actualizarDatosProductos();
        }

        // Despues de agregar el producto prosedo a ponerlo en edición
        this.tablas.funciones.onClickEdit('columnasProductos')(prodSelec);

    }

    /**
     * Valida y graba el comprobante
     */
    onClickConfirmar = () => 
        this.comprobanteCompraService.confirmarYGrabarComprobante(this.comprobante)
            (this.comprobanteRelacionado)
            (this.proveedorSeleccionado)
            (this.tablas.datos.productosPend)
            (this.tablas.datos.modelosFactura)
            (this.cotizacionDatos)
            (this.depositoSelec)
            .subscribe((respuesta: any) => {
                this.utilsService.showModal(respuesta.control.codigo)(respuesta.control.descripcion)()();

                // Blanqueo los campos
                const auxFecha = this.comprobante.fechaComprobante;
                this.comprobante = new Comprobante();
                this.comprobante.fechaComprobante = auxFecha;
                this.comprobanteRelacionado = new ComprobanteRelacionado();
                this.proveedorSeleccionado = new Padron();
                this.tablas.datos.productosPend = [];
                this.tablas.datos.modelosFactura = [];
                this.cotizacionDatos = { cotizacion: new Cotizacion(), total: 0 };
                this.depositoSelec = new Deposito()
                

                // Focus en input proveedor (TODO SET TIME OUT)
                document.getElementById('inputProveedor') ? document.getElementById('inputProveedor').focus() : null
            })
    
            onClickCancelar = () =>{
                // Blanqueo los campos
                const auxFecha = this.comprobante.fechaComprobante;
                this.comprobante = new Comprobante();
                this.comprobante.fechaComprobante = auxFecha;
                this.comprobanteRelacionado = new ComprobanteRelacionado();
                this.proveedorSeleccionado = new Padron();
                this.tablas.datos.productosPend = [];
                this.tablas.datos.modelosFactura = [];
                this.cotizacionDatos = { cotizacion: new Cotizacion(), total: 0 };
                this.depositoSelec = new Deposito()
            }   

    ///////////////////////////////// Eventos (Distintos de onclick) /////////////////////////////////
    
    /**
     * Actualiza el total en cotizacion y los modelosFactura
     */
    actualizarDatosProductos = () => {
        // Actualizo el Total Comprobante sumando todos los precios nuevamente (no le sumo directamente el precio editado porque no es un precio nuevo, sino que ya está y debería sumarle la diferencia editada nomás)
        this.cotizacionDatos.total = Math.round(
            _.sumBy(
                this.tablas.datos.productosPend,
                (prod) => Number(prod.precio) ? Number(prod.precio) * Number(prod.pendiente) : 0
            )
        );

        this.comprobanteCompraService.buscaModelos(this.tablas.datos.productosPend).subscribe(modelProds => {
            this.tablas.datos.modelosFactura = modelProds
        })
    }

    /**
     * Evento change del input del proovedor
     */
    onChangeInputProveedor = (codigo) => {
        this.proveedores.filtrados.next(
            this.comprobanteCompraService.filtrarProveedores(this.proveedores.todos, codigo)
        );
        // Reseteo el indice
        this.proveedorEnfocadoIndex = -1;
    }
    
    
    /**
     * El blur es cuando se hace un leave del input (caundo se apreta click afuera por ejemplo).
     * Acá lo que hago es poner un array vacio como próx valor de los filtrados, cosa que la lista desaparezca porque no hay nada
     * También retorno el proveedor seleccionado en el input
     */
    onBlurInputProv = (e) => {
        // Vacio filtrados
        this.proveedores.filtrados.next([]);

        // Actualizo proveedor seleccionado
        try {
            this.proveedorSeleccionado = this.comprobanteCompraService.seleccionarProveedor(this.proveedores.todos)(this.proveedorSeleccionado);
            this.comprobanteCompraService.getLetrasProveedor(this.proveedorSeleccionado).subscribe(letras => this.letras = letras);
        }
        catch(err) {
            // Muestro error
            if (err && err.nombre && err.descripcion) {
                this.utilsService.showModal(err.nombre)(err.descripcion)()();
            }
            // Vacio proveedor seleccionado
            this.proveedorSeleccionado = new Padron();
        }
    }


    /**
     * Setea la fecha de compra calculandola dado un string en formato 'ddmm', parseando a 'dd/mm/aaaa'
     */
    onCalculateFecha = (e) => (keyFecha) => (objetoContenedor) => {
        if (!this[objetoContenedor][keyFecha] || typeof this[objetoContenedor][keyFecha] !== 'string') return;
        
        this[objetoContenedor][keyFecha] = this.utilsService.stringToDateLikePicker(this[objetoContenedor][keyFecha]);

        // Hago focus en el prox input
        (keyFecha==='fechaComprobante') || (keyFecha==='fechaContable') ? 
            document.getElementById(`fechaVto${this.utilsService.upperFirstLetter(objetoContenedor)}`).focus() : null;

    }

    /**
     * Evento blur de pto venta y numero en comprobante
     * tipo: puntoVenta o numero
     * keyTipoe: comprobante, comprobanteRelacionado
     */
    onBlurNumeroAutocomp = (e) => (tipo: string) => (keyTipo: string) => 
        this[keyTipo][tipo] = this.comprobanteCompraService.autocompNroComp(tipo)(this[keyTipo]);
    

    /**
     * Actualizo el deposito seleccionado que me viene de tablaIngreso
     */
    onSelectDeposito = (depSelect: Deposito) => {
        this.depositoSelec = depSelect;
    }

    /**
     * Evento de cuando se apreta felcha arriba o feclah abajo en input de busca proveedor
     */
    keyPressInputTexto = (e: any) => (upOrDown) => {
        e.preventDefault();
        // Hace todo el laburo de la lista popup y retorna el nuevo indice seleccionado
        this.popupListaService.keyPressInputForPopup(upOrDown)(this.proveedores.filtrados)(this.proveedorEnfocadoIndex)
            .subscribe(newIndex => this.proveedorEnfocadoIndex = newIndex)
            .unsubscribe()
    }

    /**
     * Evento on enter en el input de buscar proveedor
     */
    onEnterInputProv = (e: any) => {
        e.preventDefault();
        this.proveedores.filtrados.subscribe(provsLista => {
            // Busco el producto
            const provSelect = provsLista && provsLista.length ? provsLista[this.proveedorEnfocadoIndex] : null;
            // Lo selecciono
            provSelect ? this.popupLista.onClickListProv(provSelect) : null;
            // Reseteo el index
            this.proveedorEnfocadoIndex = -1;
        })
    }
}
