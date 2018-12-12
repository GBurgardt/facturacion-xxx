import * as _ from 'lodash';
import * as moment from 'moment';
import { Component,  HostListener, AfterViewInit } from '@angular/core';

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
import { Comprobante } from 'app/models/comprobante';
import { ComprobanteRelacionado } from 'app/models/comprobanteRelacionado';
import { Deposito } from 'app/models/deposito';
import { PopupListaService } from 'app/pages/reusable/otros/popup-lista/popup-lista-service';
import { ComprobanteCompraService } from './comprobanteCompraService';
import { FormaPago } from 'app/models/formaPago';

import { DetalleFormaPago } from 'app/models/detalleFormaPago';
import { NgbProgressbarConfig } from '@ng-bootstrap/ng-bootstrap';
import { DateLikePicker } from '../../../../models/dateLikePicker';
import gruposParametros from 'constantes/gruposParametros';
import { ProductoReducido } from '../../../../models/productoReducido';
import { TablaCompra } from '../../../../models/tablaCompra';
import { Numerador } from 'app/models/numerador';
import sisModulos from 'constantes/sisModulos';
import { ComprobanteEncabezado } from 'app/models/comprobanteEncabezado';

@Component({
    selector: 'comprobante-compra',
    templateUrl: './comprobanteCompra.html',
    styleUrls: ['./comprobanteCompra.scss'],
    providers: [NgbProgressbarConfig]
})

/**
 * Form reutilizable
 */
export class ComprobanteCompra implements AfterViewInit {
    // Checkea cambios antes de salir
    @HostListener('window:beforeunload')
    canDeactivate() {
        return this.comprobanteCompraService.checkPendingChanges(this.comprobante)(this.factura)(this.proveedorSeleccionado)(this.comprobanteRelacionado);
    }

    /////////////////////////////////////////////
    /////////// Modelos Comprobante /////////////
    /////////////////////////////////////////////
    proveedorSeleccionado: Padron = new Padron();
    comprobante: Comprobante = new Comprobante();
    comprobanteRelacionado: ComprobanteRelacionado = new ComprobanteRelacionado()
    // factura: Factura = new Factura();
    factura: Comprobante = new Comprobante();
    cotizacionDatos: {
        cotizacion: Cotizacion,
        total: number
    } = { cotizacion: new Cotizacion(), total: 0 };

    depositoSelec: Deposito;
    tipoOpSelect: SisTipoOperacion;

    // Inhdice del producto enfocado del popup
    proveedorEnfocadoIndex: number = -1;

    // Suma de todos los subtotales
    sumatoriaSubtotales: number = 0;

    formasPagoSeleccionadas: FormaPago[] = [];

    /////////////////////////////////////////////
    //////////// Listas desplegables ////////////
    /////////////////////////////////////////////
    tiposComprobantes: Observable<TipoComprobante[]>;
    tiposOperacion: Observable<SisTipoOperacion[]>;
    monedas: Observable<Moneda[]>;
    depositos: Observable<Deposito[]>;
    tiposComprobantesFactura: Observable<TipoComprobante[]>;

    tiposComprobantesRel: Observable<TipoComprobante[]>;

    // Lista de proveedores completa (necesaria para filtrar) y filtrada
    proveedores: {
        todos: Padron[];
        filtrados: BehaviorSubject<Padron[]>;
    } = {todos: [], filtrados: new BehaviorSubject([])}

    letras: string[] = [];

    // Si es 0, no se muestra el 'cargando'.
    valueGuardandoCompro = 0;

    /**
     * Blurs customs
     */
    customsBlurProduct = {
        // calculateImporte: (item: ProductoPendiente) => item.importe = item.pendiente * item.precio
        calculateImporte: (item: ProductoPendiente) => item.importe = item.pendiente * Number(item.producto.costoReposicion)
    }

    /////////////////////////////////////////////
    ////////////////// Tablas ///////////////////
    /////////////////////////////////////////////
    dataTablaFormasPago: Observable<FormaPago[]>;
    tablas: TablaCompra = new TablaCompra()

    ////////////////////////////////////////////
    //////////////// PopupLista ////////////////
    ////////////////////////////////////////////

    popupLista: any = {
        onClickListProv: (prove: Padron) => {
            this.proveedorSeleccionado = new Padron({...prove});
            // this.comprobanteCompraService.getLetrasProveedor(this.proveedorSeleccionado).subscribe(letras => this.letras = letras);

            // Intento obtener las formas de pago
            if(this.comprobante.fechaComprobante) {
                this.dataTablaFormasPago = this.comprobanteCompraService.getFormasPago(this.comprobante.fechaComprobante);
            }

            // Focus siguiente elemento
            document.getElementById('tipoOperacionSelect') ? document.getElementById('tipoOperacionSelect').focus() : null;

        },
        getOffsetOfInputProveedor: () => this.utilsService.getOffset(document.getElementById('inputProveedor'))
    }

    /**
     * Toda la carga de data se hace en el mismo orden en el que está declarado arriba
     */
    constructor(
        private recursoService: RecursoService,
        public comprobanteCompraService: ComprobanteCompraService,
        public utilsService: UtilsService,
        private popupListaService: PopupListaService,
        configProgressBar: NgbProgressbarConfig
    ) {

        ////////// Configuraciones ///////////
        // customize default values of progress bars used by this component tree
        configProgressBar.max = 100;
        configProgressBar.striped = true;
        configProgressBar.animated = true;
        configProgressBar.type = 'success';


        ////////// Listas desplegables  //////////
        this.tiposOperacion = this.recursoService.getRecursoList(resourcesREST.sisTipoOperacion)({
            'sisModulo': 1
        });

        this.monedas = this.recursoService.getRecursoList(resourcesREST.sisMonedas)();
        this.depositos = this.recursoService.getRecursoList(resourcesREST.depositos)();

        this.tiposComprobantesFactura = this.recursoService.getRecursoList(resourcesREST.cteTipo)({
            'sisComprobante': 2
        });


        ////////// Proveedores  //////////
        this.recursoService.getRecursoList(resourcesREST.padron)({
            grupo: gruposParametros.proveedor
        }).subscribe(proveedores => {
            this.proveedores.todos = proveedores;
            this.proveedores.filtrados.next(proveedores);
        });

        ////////// Tablas //////////
        this.tablas.columnas.columnasProductos = comprobanteCompraService.getColumnsProductos();
        this.tablas.columnas.columnasTrazabilidad = comprobanteCompraService.getColumnsTrazabilidad();
        this.tablas.columnas.columnasFactura = comprobanteCompraService.getColumnsFactura();
        this.tablas.columnas.columnasDetallesFp = comprobanteCompraService.getColumnsDetallesFp();

        ////////// Otros //////////
        this.comprobanteCompraService.getCotizacionDatos().subscribe(cotizDatos => this.cotizacionDatos.cotizacion = cotizDatos);
    }

    ngAfterViewInit() {
        // Focus en input proveedor
        document.getElementById('inputProveedor') ? document.getElementById('inputProveedor').focus() : null
    }

    ///////////////////////////////// Eventos OnClick /////////////////////////////////

    onClickRemove = (prodSelect: ProductoPendiente) => {
        _.remove(this.tablas.datos.productosPend, (prod: ProductoPendiente) => {
            // return prod.producto.idProductos === prodSelect.producto.idProductos;
            return prod.producto.idProductos === prodSelect.producto.idProductos && prod.numero === prodSelect.numero;
        });

        // Actualizo totales y eso
        this.actualizarDatosProductos()
    };

    onClickEdit = (tipoColumnas) => (itemSelect: any) => {

        this.tablas.columnas[tipoColumnas] = this.tablas.columnas[tipoColumnas].map(tabla => {
            let newTabla = tabla;
            if (newTabla.enEdicion !== undefined) {

                // tipoColumnas === 'columnasProductos' ? newTabla.enEdicion = itemSelect.producto.idProductos :
                tipoColumnas === 'columnasProductos' ? newTabla.enEdicion = `${itemSelect.producto.idProductos}-${itemSelect.numero}` :
                tipoColumnas === 'columnasTrazabilidad' ? newTabla.enEdicion = `${itemSelect.producto.idProductos}-${itemSelect.numero}` :
                tipoColumnas === 'columnasFactura' ? newTabla.enEdicion = itemSelect.cuentaContable :
                tipoColumnas === 'columnasDetallesFp' ? newTabla.enEdicion = itemSelect.idFormaPagoDet : null
            }
            return newTabla;
        });

        // Hago focus en el select de imputacion
        setTimeout(() => {

            const idItem =  itemSelect.cuentaContable ? itemSelect.cuentaContable :
                            itemSelect.idFormaPagoDet ? itemSelect.idFormaPagoDet :
                            // itemSelect.producto && itemSelect.producto.idProductos ? itemSelect.producto.idProductos : '000';
                            itemSelect.producto && itemSelect.producto.idProductos ? `${itemSelect.producto.idProductos}-${itemSelect.numero}` : '000';

            const inputFocusClass = 'editar-focus-'+idItem;

            const elementFocus: any = document.getElementsByClassName(inputFocusClass);
            elementFocus && elementFocus[0] ? elementFocus[0].focus() : null
        });
    };

    onClickConfirmEdit = (tipoColumnas) => (itemSelect: any) => {


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
            this.sumatoriaSubtotales = 
                _.sumBy(
                    this.tablas.datos.modelosFactura,
                    (fact) => Number(fact.importeTotal) ? Number(fact.importeTotal) : 0
                )

        }

        // Actualizo el importe si y solo si esta editando productos, y si el importe viene modificado
        if (tipoColumnas === 'columnasProductos') {
            // Si el importe es 0, es la primer edicion por lo que calculo el importe
            if (itemSelect.importe === 0) {
                // itemSelect.importe = itemSelect.pendiente * itemSelect.precio
                itemSelect.importe = itemSelect.pendiente * Number(itemSelect.producto.costoReposicion)
            } else {
                // Si el importe es igual al importe previo, entonces el importe NO se editó, por lo que seguramte se editó la cantidad o el precio y debo recalcular el importe
                if (itemSelect.importe === itemSelect.auxPreviusImporte) {
                    itemSelect.importe = itemSelect.pendiente * Number(itemSelect.producto.costoReposicion)
                }
            }
            // Guardo el importe para usarlo en la proxima edicion
            itemSelect.auxPreviusImporte = itemSelect.importe

            // Refresco detalles forma pago casos particulares [SOLO si la grilla es la de articulos]
            this.refreshMontoDetallesFormaPago();
        }

        // Actualizo datos dle producto (si NO son las facturas lo que se edita)
        if (tipoColumnas !== 'columnasFactura' && tipoColumnas !== 'columnasDetallesFp') {
            this.actualizarDatosProductos();
        }
    }

    /**
     * Busca los productos pendientes de acuerdo al comprobante relacionado
     */
    onClickBuscarPendientes = () =>
        this.comprobanteCompraService.buscarPendientes(this.proveedorSeleccionado)(this.comprobanteRelacionado)
            .subscribe(
                prodsPend => {
                    // Agrego los productos
                    // this.tablas.datos.productosPend = _.uniqWith(
                    //     this.tablas.datos.productosPend.concat(prodsPend),
                    //     (a:ProductoPendiente,b:ProductoPendiente) =>    a.producto.idProductos === b.producto.idProductos &&
                    //                                                     a.numero === b.numero
                    // );

                    // Borro los prods agregados anteriormente y los remplazo por estos que vienen acá
                    this.tablas.datos.productosPend = prodsPend;

                    // Actualizo datos de los productos
                    this.actualizarDatosProductos();
                },
                error => this.utilsService.decodeErrorResponse(error)
            );


    /**
     * Agrega el producto seleccionado a la lista de productosPendientes
     */
    onClickProductoLista = (prodSelec: ProductoReducido) => {
        // Busco el producto seleccionado
        this.comprobanteCompraService.buscarProducto(prodSelec.idProductos).subscribe(prodEnc => {
            // debugger;
            // Le seteo el nroComprobante
            const auxProdSelect = Object.assign({}, prodEnc);
            // auxProdSelect.numero = Number(this.comprobante.numerador.numero.ptoVenta + this.comprobante.numerador.numero.numero).toString();
            auxProdSelect.numero = this.utilsService.numeroObjectToString(this.comprobante.numerador.numero)
            
            // Checkeo que no exista
            const existeProd = this.tablas.datos.productosPend.find(
                prod => prod.producto.idProductos === auxProdSelect.producto.idProductos &&
                        prod.numero === auxProdSelect.numero
            )
    
            if (!existeProd) {
                this.tablas.datos.productosPend.push(auxProdSelect);
                this.actualizarDatosProductos();
            }
    
            // Despues de agregar el producto procedo a ponerlo en edición
            this.onClickEdit('columnasProductos')(auxProdSelect);
        })
    }


    onClickCancelar = () => this.utilsService.showModal(
        'Aviso'
    )(
        '¿Cancelar comprobante?'
    )(
        () => {
            // Blanqueo los campos
            const auxFecha = this.comprobante.fechaComprobante;
            this.comprobante = new Comprobante();
            this.comprobante.fechaComprobante = auxFecha;
            this.comprobanteRelacionado = new ComprobanteRelacionado();
            this.proveedorSeleccionado = new Padron();
            this.tablas.datos.productosPend = [];
            this.tablas.datos.modelosFactura = [];
            // this.cotizacionDatos = { cotizacion: new Cotizacion(), total: 0 };
            this.depositoSelec = new Deposito()
            this.tablas.datos.detallesFormaPago = [];
        }
    )({
        tipoModal: 'confirmation'
    });

    fechaComprobanteInvalida = () => this.comprobante.numerador && 
        this.comprobante.numerador.fechaApertura &&
        this.comprobante.numerador.fechaCierre &&
        !moment(
            this.utilsService.dateLikePickerToDate(this.comprobante.fechaComprobante)
        ).isBetween(
            moment(this.comprobante.numerador.fechaApertura),
            moment(this.comprobante.numerador.fechaCierre)
        )

    /**
     * Valida y graba el comprobante
     */
    onClickConfirmar = () => this.utilsService.showModal(
        'Aviso'
    )(
        '¿Confirmar comprobante?'
    )(
        () => {
            if (
                this.fechaComprobanteInvalida()
            ) {
                // Si se sale del intervalo permitido, seteo la fecha como fechaApertura
                this.comprobante.fechaComprobante = new DateLikePicker(
                    new Date(this.comprobante.numerador.fechaApertura)
                );
                // Y le aviso
                this.utilsService.showModal('Error de fecha')(
                    `Fecha inválida para este punto de venta (Intervalo permitido: ${
                        moment(this.comprobante.numerador.fechaApertura).format('DD-MM-YYYY')
                    } al ${
                        moment(this.comprobante.numerador.fechaCierre).format('DD-MM-YYYY')
                    })`
                )()()
            } else {
                // Spinner bar
                this.valueGuardandoCompro = 50;
    
                // Actualizo las facturas antes de confirmar
                this.comprobanteCompraService.buscaModelos(this.tablas.datos.productosPend).subscribe(modelProds => {
                    this.tablas.datos.modelosFactura = modelProds;
        
                    this.sumatoriaSubtotales = 
                        _.sumBy(
                            this.tablas.datos.modelosFactura,
                            (fact) => Number(fact.importeTotal) ? Number(fact.importeTotal) : 0
                        );
    
                    this.comprobanteCompraService.confirmarYGrabarComprobante(this.comprobante)
                        (this.comprobanteRelacionado)
                        (this.proveedorSeleccionado)
                        (this.tablas.datos.productosPend)
                        (this.tablas.datos.modelosFactura)
                        (this.cotizacionDatos)
                        (this.depositoSelec)
                        (this.tablas.datos.detallesFormaPago)
                        (this.factura)
                        (this.tipoOpSelect)
                        .subscribe((respuesta: any) => {
                            // Saco spinner
                            this.valueGuardandoCompro = 0;
                            
                            // Modal para imprimir
                            const compCreado = new ComprobanteEncabezado();
                            compCreado.idFactCab = respuesta.datos.idFactCab;
                            compCreado.numero = Number(
                                `${this.comprobante.numerador.numero.ptoVenta}${this.comprobante.numerador.numero.numero.toString().padStart(8, '0')}`
                            );

                            this.utilsService.showImprimirModal(
                                respuesta.control.codigo
                            )(
                                respuesta.control.descripcion
                            )(
                                () => this.recursoService.downloadComp(compCreado)
                            )(
                                compCreado
                            );

                            // this.utilsService.showModal(respuesta.control.codigo)(respuesta.control.descripcion)()();
                            
                            // Blanqueo los campos
                            const auxFecha = this.comprobante.fechaComprobante;
                            this.comprobante = new Comprobante();
                            this.comprobante.fechaComprobante = auxFecha;
                            this.comprobanteRelacionado = new ComprobanteRelacionado();
                            this.proveedorSeleccionado = new Padron();
                            this.tablas.datos.productosPend = [];
                            this.tablas.datos.modelosFactura = [];
                            // this.cotizacionDatos = { cotizacion: new Cotizacion(), total: 0 };
                            this.cotizacionDatos.total = 0;
                            this.sumatoriaSubtotales = 0;
                            this.depositoSelec = new Deposito()
                            this.tablas.datos.detallesFormaPago = [];
                            this.dataTablaFormasPago = Observable.of([]);
        
                            // Limpio formas pago
                            this.dataTablaFormasPago = null;
                            this.formasPagoSeleccionadas = [];
    
                            this.tipoOpSelect = new SisTipoOperacion();
                            
        
                            // Focus en input proveedor (TODO SET TIME OUT)
                            document.getElementById('inputProveedor') ? document.getElementById('inputProveedor').focus() : null
        
        
                        })
                })
            }


        
        }

    )({
        tipoModal: 'confirmation'
    });



    ///////////////////////////////// Eventos (Distintos de onclick) /////////////////////////////////

    /**
     * Actualiza el total en cotizacion y los modelosFactura
     */
    actualizarDatosProductos = () => {
        
        this.cotizacionDatos.total = 
            _.sumBy(
                this.tablas.datos.productosPend,
                (prod) => Number(prod.importe) ? Number(prod.importe) : 0
            )


        // Busco las facturas de los productos
        if (this.tablas.datos.productosPend && this.tablas.datos.productosPend.length > 0) {
            this.comprobanteCompraService.buscaModelos(this.tablas.datos.productosPend).subscribe(modelProds => {

                this.tablas.datos.modelosFactura = modelProds;

                this.sumatoriaSubtotales = 
                    _.sumBy(
                        this.tablas.datos.modelosFactura,
                        (fact) => Number(fact.importeTotal) ? Number(fact.importeTotal) : 0
                    )
            })
        } else {
            this.tablas.datos.modelosFactura = [];
            this.sumatoriaSubtotales = 0;
        }


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
            // this.comprobanteCompraService.getLetrasProveedor(this.proveedorSeleccionado).subscribe(letras => this.letras = letras);

            // Intento obtener las formas de pago
            if(this.comprobante.fechaComprobante) {
                this.dataTablaFormasPago = this.comprobanteCompraService.getFormasPago(this.comprobante.fechaComprobante);
            }
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
        // Si selecciona en el datePicker (el evento es una fecha de datelikepiker)
        if (e && e.day && e.month) {
            const fechaLikePicker = new DateLikePicker(null, e);
            // Obtengo las formas de pago
            if(fechaLikePicker) {
                this.dataTablaFormasPago = this.comprobanteCompraService.getFormasPago(fechaLikePicker);
            }

            if (keyFecha === 'fechaComprobante') {
                this[objetoContenedor][keyFecha] = fechaLikePicker;
            }
        } 

        if (!this[objetoContenedor][keyFecha] || (
            typeof this[objetoContenedor][keyFecha] !== 'string' && (
                !this[objetoContenedor][keyFecha].day &&
                !this[objetoContenedor][keyFecha].month
            )
        )) return;

        // La guardo
        this[objetoContenedor][keyFecha] = this.utilsService.stringToDateLikePicker(this[objetoContenedor][keyFecha]);

        // Si es fecha de comprobante, antes que nada hay que validar que la fecha no se salga del intervalo
        if (
            keyFecha==='fechaComprobante' && 
            this.fechaComprobanteInvalida()
        ) {
            // Si se sale del intervalo permitido, seteo la fecha como fechaApertura
            this.comprobante.fechaComprobante = new DateLikePicker(
                new Date(this.comprobante.numerador.fechaApertura)
            );
            // Y le aviso
            this.utilsService.showModal('Error de fecha')(
                `Fecha inválida para este punto de venta (Intervalo permitido: ${
                    moment(this.comprobante.numerador.fechaApertura).format('DD-MM-YYYY')
                } al ${
                    moment(this.comprobante.numerador.fechaCierre).format('DD-MM-YYYY')
                })`
            )()()
            return;
        } else {
            // Obtengo las formas de pago
            if(this.comprobante.fechaComprobante) {
                this.dataTablaFormasPago = this.comprobanteCompraService.getFormasPago(this.comprobante.fechaComprobante);
            }
    
            // Hago focus en el prox input
            (keyFecha==='fechaComprobante') || (keyFecha==='fechaContable') ?
                document.getElementById(`fechaVto${this.utilsService.upperFirstLetter(objetoContenedor)}`).focus() : null;
        }
        

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
        this.proveedorEnfocadoIndex = 
            this.popupListaService.keyPressInputForPopup(upOrDown)(this.proveedores.filtrados.value)(this.proveedorEnfocadoIndex)
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

            // Intento obtener las formas de pago
            if(this.comprobante.fechaComprobante) {
                this.dataTablaFormasPago = this.comprobanteCompraService.getFormasPago(this.comprobante.fechaComprobante);
            }
        })
    }



    /**
     * Agrega o elimina una forma pago de las seleccionadas. Tambien muestra detalle de la lista correspondiente
     */
    handleFormaPagoSelec = (fp: FormaPago) => (tipoOperacion: string) => {
        // Agrego o elimino
        if (tipoOperacion === 'add') {
            // Primero los borro (si quedaorn de anbtes)
            this.formasPagoSeleccionadas = this.formasPagoSeleccionadas.filter(fpSelec => fpSelec.idFormaPago !== fp.idFormaPago);
            // Ahora los agrego
            this.formasPagoSeleccionadas.push(fp)
        } else {
            this.formasPagoSeleccionadas = this.formasPagoSeleccionadas.filter(fpSelec => fpSelec.idFormaPago !== fp.idFormaPago);
        }

        // Ahora mappeo los detalles de las formas de pago seleccionadas para mostrarlos en la grilla de el medio
        this.tablas.datos.detallesFormaPago = this.formasPagoSeleccionadas
            .map(
                fp => Object.assign([], fp.detalles)
                    .map(det => {
                        const auxDet: DetalleFormaPago = Object.assign({}, det);
                        auxDet.formaPagoDescrip = fp.descripcion;

                        return auxDet;
                    })
            )
            .reduce((a, b) => [...a].concat([...b]), []) // Aca aplasto el array bidimensional a uno de una dimensión


        // Caso especial: La forma de pago seleccionada es contado, por lo que detalles va a ser length === 1. Entonces le sugieron que el monto a pagar sea el mismo que el resto a pagar
        this.refreshMontoDetallesFormaPago()

    }

    /**
     * Refresca el monto. Es un caso particular
     */
    refreshMontoDetallesFormaPago = () => {
        
        if (
            this.tablas.datos.detallesFormaPago && 
            this.tablas.datos.detallesFormaPago.length === 1
        ) {
            // Esto es un horror, pero me da paja mejorarlo
            setTimeout(() => {
                const auxDetalleMutado = Object.assign({}, this.tablas.datos.detallesFormaPago[0]);
                
                auxDetalleMutado.monto = (this.cotizacionDatos.total + this.sumatoriaSubtotales);
                const nuevosDetalles = [auxDetalleMutado];
                this.tablas.datos.detallesFormaPago = nuevosDetalles;
                // debugger;
            }, 1000);
        }
    }

    

    /**
     * Evento cuando cambio cteTipo en comprobante
     */
    onChangeCteTipo = (cteTipoSelect: TipoComprobante) => {
        this.tiposComprobantesRel = this.recursoService.getRecursoList(resourcesREST.cteTipo)({
            'sisModulo': sisModulos.compra,
            'idCteTipo': cteTipoSelect.idCteTipo
        });

        // this.comprobante.numerador.fechaApertura = null;
        // this.comprobante.numerador.fechaCierre = null;

        this.comprobante.numerador = new Numerador();

        if (this.comprobante.tipo && this.comprobante.tipo.numerador && this.comprobante.tipo.numerador.length > 0) {
            this.comprobante.numerador = this.comprobante.tipo.numerador[0];
        }
    }


    // HARD Codign Exxxxtreme
    compareFnMonedas = (m1: Moneda, m2: Moneda) =>
        m1 && m2 ? m1.idMoneda === m2.idMoneda : m1 === m2
        // m1 ? m1.idMoneda === 1 : false


    /**
     * Busca facturas
     */
    fetchFacturas = () => {
        // Busco las facturas de los productos
        this.comprobanteCompraService.buscaModelos(this.tablas.datos.productosPend).subscribe(modelProds => {
            this.tablas.datos.modelosFactura = modelProds;

            this.sumatoriaSubtotales = 
                _.sumBy(
                    this.tablas.datos.modelosFactura,
                    (fact) => Number(fact.importeTotal) ? Number(fact.importeTotal) : 0
                )
        })
    }

    /**
     * Cuyando cambia el tipo operacion se actualizan los tipos comprobantes
     */
    onChangeTipoOperacion = (tipoOpSelect: SisTipoOperacion) => {
        this.tiposComprobantes = this.recursoService.getRecursoList(resourcesREST.cteTipo)({
            // 'sisModulo':  1,
            'sisTipoOperacion': tipoOpSelect.idSisTipoOperacion
        });
    }

    /**
     * Checkea si el resto a pagar es valido
     */
    isRestoPagarValid = () => this.calcRestoPagar() === '0.00'

    /**
     * Calcula el resto pagar
     */
    calcRestoPagar = () => {
        const sumMontos = _.sumBy(
            this.tablas.datos.detallesFormaPago,
            (fPago) => Number(fPago.monto) ? Number(fPago.monto) : 0
        )

        // Los paréntesis son ilustrativos, ya sabemos que la suma es asociativa y conmutativa
        const restoPagar = Number(
            (this.cotizacionDatos.total + this.sumatoriaSubtotales) - sumMontos
        ).toFixed(2);

        return (restoPagar === '-0.00') ? '0.00' : restoPagar
    }

    onBlurNumeroCteRelacionado = (evento) => {
        this.onBlurNumeroAutocomp(evento)('numero')('comprobanteRelacionado')

        // Focus en input para agregar producto
        document.getElementById('addInput') ? document.getElementById('addInput').focus() : null
    }


    onBlurOrEnterFechaVtoComp = ($event) => {
        this.onCalculateFecha($event)('fechaVto')('comprobante');

        // Hago foco en el primer checbkox de la sformas de pago (el timeout es necesario para que espere a que se haga la consulta)
        // en gral esta consulta dura poquito (entre 10 y 40 milisegundos). Por eso con 150 milisegundos de espera es mas que suficiente
        setTimeout(() => {
            // Hago focus al siguiente elemento (la lista de forma pagos, primer elemento)
            const primerCheckBoxFp: any = document.getElementById('fp-check-0');
            if (primerCheckBoxFp) {
                // primerCheckBoxFp.checked = true;
                primerCheckBoxFp.focus();
            }   
        }, 150)
    }

    /**
     * En seleccionado por defectp giardp ptoventa y numerador
     */
    onChangePtoVentaNro = (selectNumerador: Numerador) => {
        // this.comprobante.fechaComprobante = new DateLikePicker(
        //     new Date(selectNumerador.fechaApertura)
        // );
    }
    
}