import * as _ from 'lodash';
import * as moment from 'moment';
import { Component } from '@angular/core';

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

import { Deposito } from 'app/models/deposito';
import { PopupListaService } from 'app/pages/reusable/otros/popup-lista/popup-lista-service';
import { EmisionRemitosService } from './emisionRemitosService';
import { FormaPago } from '../../../../models/formaPago';
import { CondIva } from '../../../../models/condIva';
import { CteFechas } from '../../../../models/cteFechas';
import { DateLikePicker } from '../../../../models/dateLikePicker';
import { SisCanje } from '../../../../models/sisCanje';
import { ComprobanteRelacionado } from '../../../../models/comprobanteRelacionado';
import { Lote } from '../../../../models/lote';
import { DetalleFormaPago } from 'app/models/detalleFormaPago';
import { GlobalState } from 'app/global.state';
import { Numerador } from 'app/models/numerador';
import { Numero } from '../../../../models/numero';
import { Factura } from '../../../../models/factura';
import { ModeloFactura } from 'app/models/modeloFactura';
import gruposParametros from 'constantes/gruposParametros';
import { ProductoReducido } from '../../../../models/productoReducido';
import { Cliente } from '../../../../models/cliente';
import { SisSitIVA } from '../../../../models/sisSitIva';
import { Router } from '../../../../../../node_modules/@angular/router';
import { Vendedor } from '../../../../models/vendedor';
import sisModulos from 'constantes/sisModulos';


@Component({
    selector: 'emision-remitos',
    templateUrl: './emisionRemitos.html',
    styleUrls: ['./emisionRemitos.scss']
})

/**
 * Form reutilizable
 */
export class EmisionRemitos {
    

    /////////////////////////////////////////////
    /////////// Objetos Seleccionados ///////////
    /////////////////////////////////////////////
    cliente: Padron = new Padron();
    comprobante: Comprobante = new Comprobante();
    comprobanteRelacionado: ComprobanteRelacionado = new ComprobanteRelacionado()
    deposito: Deposito;
    tipoOperacion: SisTipoOperacion;
    sisCanje: SisCanje = new SisCanje();
    formasPagoSeleccionadas: FormaPago[] = [];
    numeroCteSelec: Numero = new Numero();
    // factura: Factura = new Factura();
    factura: Comprobante = new Comprobante();
    dataVendedor: {
        vendedor: Vendedor,
        incluir: boolean
    } = {
        vendedor: new Vendedor(),
        incluir: false
    };

    /////////////////////////////////////////////
    //////////// Listas desplegables ////////////
    /////////////////////////////////////////////
    sisSitIvas: Observable<CondIva[]>;
    tiposComprobantes: Observable<TipoComprobante[]>;
    tiposOperacion: Observable<SisTipoOperacion[]>;
    monedas: Observable<Moneda[]>;
    depositos: Observable<Deposito[]>;
    // productos: Observable<ProductoPendiente[]>;
    productos: BehaviorSubject<ProductoReducido[]> = new BehaviorSubject([]);
    sisCanjes: Observable<SisCanje[]>;
    clientes: { todos: Padron[]; filtrados: BehaviorSubject<Padron[]> } = { todos: [], filtrados: new BehaviorSubject([]) }
    letras: string[] = [];
    
    numerosCte: Numero[] = [];

    tiposComprobantesRel: Observable<TipoComprobante[]>;
    tiposComprobantesFactura: Observable<TipoComprobante[]>;

    /////////////////////////////////////////////
    ////////////////// Otros ////////////////////
    /////////////////////////////////////////////
    // Inhdice del producto enfocado del popup
    clienteEnfocadoIndex: number = -1;
    
    detalleListaFpsSeleccionadas: string = '';

    cotizacionDatos: {
        cotizacion: Cotizacion,
        total: number
    } = { cotizacion: new Cotizacion(), total: 0};

    // Intervalo de fecha del cte seleccionado (y el pto venta seteado)
    cteFechasIntervalo: CteFechas = new CteFechas();

    disabledClienteCustom: boolean = false;

    // Suma de todos los subtotales
    sumatoriaSubtotales: number = 0;

    /////////////////////////////////////////////
    ////////////////// Tablas ///////////////////
    /////////////////////////////////////////////
    dataTablaFormasPago: Observable<FormaPago[]>;

    tablas: {
        columnas: {
            columnasProductos: any[];
            columnasTrazabilidad: any[];
            columnasCanje: any[];
            columnasDetallesFp: any[];
            columnasFactura: any[];
        },
        datos: {
            productosPend: ProductoPendiente[];
            subtotalesProductos: {
                idProducto: number,
                subtotal: number,
                subtotalIva: number
            }[];
            productosCanje: ProductoPendiente[];
            lotesTraza: Lote[];
            detallesFormaPago: DetalleFormaPago[];
            modelosFactura: ModeloFactura[];
        }
    } = { 
        columnas: { 
            columnasProductos: [],
            columnasTrazabilidad: [],
            columnasCanje: [],
            columnasDetallesFp: [],
            columnasFactura: []
        }, 
        datos: { 
            productosPend: [],
            subtotalesProductos: [],
            productosCanje: [],
            lotesTraza: [],
            detallesFormaPago: [],
            modelosFactura: [],
        }
    };
    

    /**
     * Toda la carga de data se hace en el mismo orden en el que está declarado arriba
     */
    constructor(
        private recursoService: RecursoService,
        private emisionRemitosService: EmisionRemitosService,
        private utilsService: UtilsService,
        private popupListaService: PopupListaService,
        private _state: GlobalState,
        private router: Router
    ) {

        ////////// Listas desplegables //////////
        this.sisSitIvas = this.recursoService.getRecursoList(resourcesREST.sisSitIva)();

        this.tiposOperacion = this.recursoService.getRecursoList(resourcesREST.sisTipoOperacion)({
            sisModulo: 2
        });
        this.monedas = this.recursoService.getRecursoList(resourcesREST.sisMonedas)();
        this.depositos = this.recursoService.getRecursoList(resourcesREST.depositos)();

        this.sisCanjes = this.recursoService.getRecursoList(resourcesREST.sisCanjes)();

        ////////// Clientes  //////////
        this.recursoService.getRecursoList(resourcesREST.padron)({
            grupo: gruposParametros.cliente
        }).subscribe(clientes => {
            this.clientes.todos = clientes;
            this.clientes.filtrados.next(clientes);
        });

        ////////// Tablas //////////
        this.tablas.columnas.columnasProductos = emisionRemitosService.getColumnsProductos();
        this.tablas.columnas.columnasTrazabilidad = emisionRemitosService.getColumnsTrazabilidad();
        this.tablas.columnas.columnasCanje = emisionRemitosService.getColumnsCanje();
        this.tablas.columnas.columnasDetallesFp = emisionRemitosService.getColumnsDetallesFp();
        this.tablas.columnas.columnasFactura = emisionRemitosService.getColumnsFactura();

        ////////// Otros //////////
        this.emisionRemitosService.getCotizacionDatos().subscribe(cotizDatos => this.cotizacionDatos.cotizacion = cotizDatos);

        this.tiposComprobantesFactura = this.recursoService.getRecursoList(resourcesREST.cteTipo)({
            'sisComprobante': 3
        });
    }

    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////// Eventos Click /////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////

    onClickRemove = (prodSelect: ProductoPendiente) => {
        _.remove(this.tablas.datos.productosPend, (prod: ProductoPendiente) => {
            return prod.producto.idProductos === prodSelect.producto.idProductos;
        });

        // Actualizo nuevamente la lista de trazables
        this.actualizarTrazableLotes(prodSelect);

        // Actualizo datos de producto (total neto)
        this.actualizarDatosProductos();

        // Actualizo la grilla de Factura
        this.fetchFacturas();

    }

    onClickEdit = (tipoColumnas) => (itemSelect: any) => { 
        this.tablas.columnas[tipoColumnas] = this.tablas.columnas[tipoColumnas].map(tabla => {
            let newTabla = tabla;
            if (newTabla.enEdicion !== undefined) {
                
                tipoColumnas === 'columnasProductos' ? newTabla.enEdicion = itemSelect.producto.idProductos :
                tipoColumnas === 'columnasTrazabilidad' ? newTabla.enEdicion = itemSelect.nroLote :
                tipoColumnas === 'columnasFactura' ? newTabla.enEdicion = itemSelect.cuentaContable :
                tipoColumnas === 'columnasDetallesFp' ? newTabla.enEdicion = itemSelect.idFormaPagoDet : null
            }
            return newTabla;
        });

        // Hago focus en el select de imputacion
        setTimeout(() => {

            const idItem =  itemSelect.nroLote ? itemSelect.nroLote : 
                            itemSelect.idFormaPagoDet ? itemSelect.idFormaPagoDet : 
                            itemSelect.producto && itemSelect.producto.idProductos ? itemSelect.producto.idProductos : '000';

            const inputFocusClass = 'editar-focus-'+idItem;

            const elementFocus: any = document.getElementsByClassName(inputFocusClass);
            elementFocus && elementFocus[0] ? elementFocus[0].focus() : null
        });

    }

    onClickConfirmEdit = (tipoColumnas) => (itemSelect: any) => { 
        // Me fijo si es valida la data ignresada
        const estado = this.emisionRemitosService.validarAntesDeConfirmar(tipoColumnas)(itemSelect);

        // Hago la sumatoria de los subtotales de la factura
        if (tipoColumnas === 'columnasFactura') {
            // Actualizo el Total Comprobante sumando todos los precios nuevamente (no le sumo directamente el precio editado porque no es un precio nuevo, sino que ya está y debería sumarle la diferencia editada nomás)
            this.sumatoriaSubtotales = 
                _.sumBy(
                    this.tablas.datos.modelosFactura,
                    (fact) => Number(fact.importeTotal) ? Number(fact.importeTotal) : 0
                )
        }

        if (estado === 'ok') {
            // Actualizo datos dle producto (si NO son las facturas lo que se edita)
            if (tipoColumnas !== 'columnasFactura') this.actualizarDatosProductos(itemSelect);
    
            // Todos los atributos 'enEdicion' distintos de undefined y también distintos de null o false, los seteo en false
            this.tablas.columnas[tipoColumnas] = this.tablas.columnas[tipoColumnas].map(tabla => {
                let newTabla = tabla;
                if (newTabla.enEdicion !== undefined && newTabla.enEdicion) {
                    // Seteo en false asi sale de edicion
                    newTabla.enEdicion = false;
                }
                return newTabla;
            })
    
            // // Actualizo subtotales
            // this.actualizarSubtotales(itemSelect);
        } else {
            // Si NO es valida, entonces muestro mensajito
            this.utilsService.showModal('Error')(estado)
        }


        
    }
    
    /**
     * Agrega el producto seleccionado a la lista de productosPendientes
     */
    onClickProductoLista = (prodSelec: ProductoReducido) => {

        this.emisionRemitosService.buscarProducto(prodSelec.idProductos)(
            this.formasPagoSeleccionadas && 
                this.formasPagoSeleccionadas[0] && 
                this.formasPagoSeleccionadas[0].listaPrecio ? this.formasPagoSeleccionadas[0].listaPrecio.idListaPrecio : null
        )
            .subscribe(prodEnc => {

                const existeProd = this.tablas.datos.productosPend.find(prod=>prod.producto.idProductos === prodEnc.producto.idProductos)
        
                if (!existeProd) {
                    this.tablas.datos.productosPend.push(prodEnc);
                    this.actualizarDatosProductos();
                }
        
                // Despues de agregar el producto prosedo a ponerlo en edición
                this.onClickEdit('columnasProductos')(prodEnc);
        
                // Actualizo grilla trazable lotes
                this.actualizarTrazableLotes();
            })


    }

    limpiarFormulario = (noBorrar?) => {
        // Blanqueo los campos
        const auxFecha = this.comprobante.fechaComprobante;
        this.comprobante = new Comprobante();
        this.comprobante.fechaComprobante = auxFecha;
        this.comprobanteRelacionado = new ComprobanteRelacionado();
        this.cliente = new Padron();
        this.tablas.datos.productosPend = [];
        this.tablas.datos.modelosFactura = [];
        // this.cotizacionDatos = { cotizacion: new Cotizacion(), total: 0 };
        this.deposito = null
        this.tablas.datos.detallesFormaPago = [];
        this.tipoOperacion = null;

        this.detalleListaFpsSeleccionadas = '';
        this.cliente.condIva = null

        if (!noBorrar || !noBorrar.includes('cotizacion')) {
            debugger;
            this.cotizacionDatos = { cotizacion: new Cotizacion(), total: 0};
        }
        this.sumatoriaSubtotales = 0;
    }

    onClickCancelar = () => 
        this.utilsService.showModal('Aviso')('¿Cancelar emision de remito?')(
            () => {
                this.limpiarFormulario();
            }
        )({
            tipoModal: 'confirmation',
        });

    /**
     * Valida y graba el comprobante
     */
    onClickConfirmar = () => 
        this.emisionRemitosService.existsProductsWithoutCantidad(this.tablas.datos.productosPend) ?
            this.utilsService.showModal('Problema')('Los productos deben tener una cantidad asignada')()()
            :
            this.utilsService.showModal('Confirmar')('¿Confirmar emision de remito?')(
                () => {

                    // Actualizo facturas antes de confirmar
                    this.emisionRemitosService.buscaModelos(
                        this.tablas.datos.productosPend
                    )(
                        this.tablas.datos.subtotalesProductos
                    ).subscribe(modelProds => {
                        this.tablas.datos.modelosFactura = modelProds;

                        this.sumatoriaSubtotales = 
                            _.sumBy(
                                this.tablas.datos.modelosFactura,
                                (fact) => Number(fact.importeTotal) ? Number(fact.importeTotal) : 0
                            );

                        this.emisionRemitosService.confirmarYEmitirRemito(this.comprobante)
                            (this.comprobanteRelacionado)
                            (this.cliente)
                            (this.tablas.datos.productosPend)
                            (this.cotizacionDatos)
                            (this.sisCanje)
                            (this.formasPagoSeleccionadas)
                            (this.factura)
                            (this.tablas.datos.modelosFactura)
                            (this.tablas.datos.detallesFormaPago)
                            (this.deposito)
                            (this.tablas.datos.lotesTraza)
                            (this.tipoOperacion)
                            (this.dataVendedor)
                            (this.tablas.datos.subtotalesProductos)
                            .subscribe((respuesta: any) => {
                                // this.utilsService.showModal(respuesta.control.codigo)(respuesta.control.descripcion)()();
                                this.utilsService.showImprimirModal(
                                    respuesta.control.codigo
                                )(
                                    respuesta.control.descripcion
                                )(
                                    () => null
                                );

                                // Blanqueo los campos
                                const auxFecha = this.comprobante.fechaComprobante;
                                this.comprobante = new Comprobante();
                                this.comprobante.fechaComprobante = auxFecha;
                                this.comprobanteRelacionado = new ComprobanteRelacionado();
                                // this.cliente = new Padron();
                                this.cliente = new Padron();

                                this.cliente.condIva = new CondIva(); setTimeout(() => { this.cliente.condIva = new CondIva() }, 1000); // TODO: Fix horrible, sacar

                                this.tablas.datos.productosPend = [];
                                this.tablas.datos.modelosFactura = [];
                                this.deposito = new Deposito()
                                this.tablas.datos.detallesFormaPago = [];
                                this.dataTablaFormasPago = Observable.of([]);
            
                                // Limpio formas pago
                                this.dataTablaFormasPago = null;
                                this.formasPagoSeleccionadas = [];

                                // Limpio vendedor
                                this.dataVendedor.vendedor = new Vendedor();
                                this.dataVendedor.incluir = false;
                                
                                // Focus en input proveedor (TODO SET TIME OUT)
                                document.getElementById('clienteSeleccionado') ? document.getElementById('clienteSeleccionado').focus() : null
                            })
                    })

                    
                }
            )({
                tipoModal: 'confirmation'
            });

    /**
     * Busca los productos pendientes de acuerdo al comprobante relacionado
     */
    onClickBuscarPendientes = () => 
        this.emisionRemitosService.buscarPendientes(this.cliente)(this.comprobanteRelacionado)

            .subscribe(prodsPend=>{
                // Agrego los productos
                this.tablas.datos.productosPend = _.uniqWith(
                    this.tablas.datos.productosPend.concat(prodsPend),
                    (a:ProductoPendiente,b:ProductoPendiente) => a.producto.codProducto === b.producto.codProducto
                );

                // Actualizo datos de los productos
                this.actualizarDatosProductos();
            });

    /**
     * Event on click en la lista del popup de cliente
     */
    onClickPopupCliente = (prove: Padron) => {
        // Limpio primero el formulario
        this.limpiarFormulario(['cotizacion']);
        // Despue sseteo el cliente seleccionado
        this.cliente = new Padron({...prove});
        this.emisionRemitosService.getLetrasCliente(this.cliente).subscribe(letras => this.letras = letras);

        // Deshabilito la posibilidad de hacer un cliente custom
        this.disabledClienteCustom = true;
    }
    
    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////// Eventos Blur ////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////
    
    /**
     * El blur es cuando se hace un leave del input (caundo se apreta click afuera por ejemplo).
     * Acá lo que hago es poner un array vacio como próx valor de los filtrados, cosa que la lista desaparezca porque no hay nada
     * También retorno el cliente seleccionado en el input
     * También checkeo si ya seleccionó cte y pto venta y fecha, y si es así entonces hago la consulta de formas de pago
     */
    onBlurInputCliente = (e) => {
        // Vacio filtrados
        this.clientes.filtrados.next([]);

        // Actualizo cliente seleccionado
        try {
            // Busco si existe (en el padron sybase)
            const clienteExistente = this.emisionRemitosService.seleccionarCliente(this.clientes.todos)(this.cliente);

            if (clienteExistente && clienteExistente.padronCodigo) {
                // Limpio primero el formulario
                this.limpiarFormulario(['cotizacion']);
                // Despue sseteo el cliente seleccionado
                this.cliente = clienteExistente;
    
                // Lo busco en la base de facturacion
                this.emisionRemitosService.checkIfClientExistInFacturacion(clienteExistente).then(vendedorAsociado => {

                    // Viene en un array pero siempre trae 1 (si lo encuetra, si no lo encuentra trae 0 o null)
                    if (vendedorAsociado) {
                        // Si lo encuentra todo ok, no le pido que lo cree. Solo me guardo el vendedor asociado
                        this.dataVendedor = {
                            vendedor: vendedorAsociado,
                            incluir: true
                        }
                    } else {
                        // Si NO lo encuentra, le pido que lo cree
                        this.utilsService.showModal('Aviso')('Cliente no existente. ¿Desea crearlo?')(()=>{
                            this.router.navigate(
                                ['/pages/tablas/clientes/nuevo'],
                                { 
                                    queryParams: { 
                                        codPadronCliente: clienteExistente.padronCodigo
                                    } 
                                }
                            );
                        })({tipoModal:'confirmation'}, () => {
                            this.dataVendedor = {
                                vendedor: new Vendedor(),
                                incluir: false
                            };
                        })
                    }
                    this.emisionRemitosService.getLetrasCliente(this.cliente).subscribe(letras => this.letras = letras);
        
                    // Si están seteados los datos necesarios aprovecho a actualizar la data de la tabla de forma de pago
                    this.comprobante && this.comprobante.fechaComprobante && this.comprobante.fechaComprobante.day ?
                        this.dataTablaFormasPago = this.emisionRemitosService.getFormasPago(this.cliente)(this.comprobante.fechaComprobante) :
                        null;
    
                    // Deshabilito los input del customcliente
                    this.disabledClienteCustom = true;
    
                    // Hago foco en dropdown tipo
                    document.getElementById('tipoOperacionDropdown').focus();
                });

            } else {
                // Caso contrario creo un nuevo cliente con el cod ingresado y habilito el custom client
                const nuevoCliente = new Padron();
                nuevoCliente.padronCodigo = this.cliente.padronCodigo;
                // Limpio primero el formulario
                this.limpiarFormulario(['cotizacion']);
                // Despue sseteo el cliente seleccionado
                this.cliente = nuevoCliente;
                this.disabledClienteCustom = false;
                // Y hago focus en #nombreCliente [El setTimeOut es necesario ya que el input previamente está deshabilitado, por lo que el navegador hace focus en el próx elemento habilitado (esto es por defecto). Por lo cual es necesario esperar una milésima de segundo en que el navegador haga ese foco, para luego hacer ESTE foco desde acá (ya con el input habilitado)]
                setTimeout(() => {
                    document.getElementById('nombreCliente').focus();
                })


            }
        }
        catch(err) {
            // Muestro error
            if (err && err.nombre && err.descripcion) {
                this.utilsService.showModal(err.nombre)(err.descripcion)()();
            }
            // Vacio cliente seleccionado
            this.cliente = new Padron();
        }
    }

    
    /**
     * Evento que se dispara cuando se selecciona una fecha
     */
    onModelChangeFechaComp(e, d) {
        
        // Actualizo fecha (sobretodo si el formato es 'ddmm')
        this.comprobante.fechaComprobante = this.utilsService.stringToDateLikePicker(this.comprobante.fechaComprobante);
        
        // Actualizo las formas de pago de la tabla (solo si está seteado el cliente)
        this.cliente && this.cliente.cuit ?
            this.dataTablaFormasPago = this.emisionRemitosService.getFormasPago(this.cliente)(this.comprobante.fechaComprobante) :
            null;

        // Reinicio detalles forma pago (ya que tiene que seleccionar de nuevo la forma de pago)
        this.tablas.datos.detallesFormaPago = [];

        // Tambien blanckeo los detalles de la lista seleccionada
        this.detalleListaFpsSeleccionadas = '';
        
        
        // setTimeout(() => {
            // // Hago focus al siguiente elemento (la lista de forma pagos, primer elemento)
            // const primerCheckBoxFp: any = document.getElementById('fp-check-0');
        //     if (primerCheckBoxFp) {
        //         primerCheckBoxFp.checked = true;
        //         primerCheckBoxFp.focus();
        //     }
        //     // 
        // }, 1000)

        // primerCheckBoxFp && primerCheckBoxFp[0] ? primerCheckBoxFp[0].focus() : null
    }   

    /**
     * Setea la fecha de compra calculandola dado un string en formato 'ddmm', parseando a 'dd/mm/aaaa'
     * También hago otras cosas
     */
    onBlurFechaComprobante = (e) => {

        // Actualizo fecha (sobretodo si el formato es 'ddmm')
        this.comprobante.fechaComprobante = this.utilsService.stringToDateLikePicker(this.comprobante.fechaComprobante);
        
        // Primero checkeo que el intervalo existe ya que puede que el tipoComrpoiabte con ese pto venta NO tenga intervalo
        // Por lo que el operador puede ingresar la fecha que se le cante, y yo pongo por defecto la del día
        if (this.comprobante.fechaComprobante) {
            // Si SI hay intervalo y la fecha SE SALE de el, entonces..
            if (
                (this.cteFechasIntervalo && this.cteFechasIntervalo.fechaApertura) &&
                moment(
                    this.utilsService.dateLikePickerToDate(this.comprobante.fechaComprobante)
                ).isBetween(
                    moment(this.cteFechasIntervalo.fechaApertura),
                    moment(this.cteFechasIntervalo.fechaCierre)
                )
            ) { 

                // Si se sale del intervalo permitido, seteo la fecha como fechaApertura
                this.comprobante && this.comprobante.fechaComprobante && this.cteFechasIntervalo && this.cteFechasIntervalo.fechaApertura ? 
                    // this.comprobante.fechaComprobante = new DateLikePicker(this.cteFechasIntervalo.fechaApertura) : 
                    this.comprobante.fechaComprobante = this.cteFechasIntervalo.fechaApertura : 
                    null;
                // Y le aviso
                this.utilsService.showModal('Error')('Fecha inválida para este punto de venta')()();
                // debugger;
               
            } else {
                 // Actualizo las formas de pago de la tabla (solo si está seteado el cliente)
                 if (this.cliente && this.cliente.cuit) {
                    this.dataTablaFormasPago = this.emisionRemitosService.getFormasPago(this.cliente)(this.comprobante.fechaComprobante);
                }
            }

            // Actualizo grilla trazable lotes
            this.actualizarTrazableLotes();

        }

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
     * Evento blur de pto venta y numero en comprobante
     * tipo: puntoVenta o numero
     * keyTipoe: comprobante, comprobanteRelacionado
     */
    onBlurNumeroAutocomp = (e) => (tipo: string) => (keyTipo: string) => 
        this[keyTipo][tipo] = this.emisionRemitosService.autocompNroComp(tipo)(this[keyTipo]);
    
    /**
     * Se dispara cuando se selecciona el pto de venta, actualizando las formas de pago
     */
    onChangePtoVentaNro = (e) => {
        // Consulto el service y traigo el intevalo de fecha de cteTipo
        // this.emisionRemitosService.getBuscaCteFecha(
        //     this.comprobante
        // ).catch((err, c) => {
        //     // Null en intervalo fechas..
        //     this.cteFechasIntervalo = null;
        //     // Pongo fecha seleccionada por dfecto en HOY
        //     this.comprobante.fechaComprobante = new DateLikePicker(new Date());
        //     // Actualizo las formas de pago para la fecha de hoy (solo si está seteado el cliente y la fecha)
        //     this.cliente && this.cliente.cuit && this.comprobante && this.comprobante.fechaComprobante ?
        //         this.dataTablaFormasPago = this.emisionRemitosService.getFormasPago(this.cliente)(this.comprobante.fechaComprobante) : 
        //         null;
        //     return Observable.from([]);
        // })
        // .subscribe((cteFechas: CteFechas[]) => {
        //     // Agarro el primer objeto (viene en un array pero es único)
        //     const intervaloFecha = cteFechas && cteFechas.length === 1 ? cteFechas[0] : new CteFechas();
        //     if (cteFechas.length > 0) {
        //         // Actualizo intervalo
        //         this.cteFechasIntervalo = intervaloFecha
        //         // Seteo fecha por defecto
        //         // this.comprobante.fechaComprobante = new DateLikePicker(intervaloFecha.fechaApertura);
        //         this.comprobante.fechaComprobante = intervaloFecha.fechaApertura;
        //     } else {
        //         // Null en intervalo fechas..
        //         this.cteFechasIntervalo = null;
        //         // Pongo fecha seleccionada por dfecto en HOY
        //         this.comprobante.fechaComprobante = new DateLikePicker(new Date());
        //     }
            // // Actualizo las formas de pago para la fechaApertura (solo si está seteado el cliente y la fecha)
            // this.cliente && this.cliente.cuit && this.comprobante && this.comprobante.fechaComprobante ?
            //     this.dataTablaFormasPago = this.emisionRemitosService.getFormasPago(this.cliente)(this.comprobante.fechaComprobante):
            //     null;
        // });


        // Hago el autocompletado de los nros
        // this.onBlurNumeroAutocomp(e)(tipo)(keyTipo)
    }


    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////// Otras Eventos ///////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////

    /**
     * Actualizo el deposito seleccionado que me viene de tablaIngreso
     */
    onSelectDeposito = (depSelect: Deposito) => {
        this.deposito = depSelect;
    }

    /**
     * Evento de cuando se apreta felcha arriba o feclah abajo en input de busca cliente
     */
    keyPressInputTexto = (e: any) => (upOrDown) => {
        e.preventDefault();
        // Hace todo el laburo de la lista popup y retorna el nuevo indice seleccionado
        this.popupListaService.keyPressInputForPopup(upOrDown)(this.clientes.filtrados)(this.clienteEnfocadoIndex)
            .subscribe(newIndex => this.clienteEnfocadoIndex = newIndex)
            .unsubscribe()
    }

    /**
     * Evento on enter en el input de buscar cliente
     */
    onEnterInputProv = (e: any) => {
        e.preventDefault();
        this.clientes.filtrados.subscribe(provsLista => {
            // Busco el producto
            const provSelect = provsLista && provsLista.length ? provsLista[this.clienteEnfocadoIndex] : null;
            // Lo selecciono
            provSelect ? this.onClickPopupCliente(provSelect) : null;
            // Reseteo el index
            this.clienteEnfocadoIndex = -1;
        })
    }

    
    /**
     * Evento change del input del proovedor
     */
    onChangeInputCliente = (codigo) => {
        this.clientes.filtrados.next(
            this.emisionRemitosService.filtrarClientes(this.clientes.todos, codigo)
        );
        // Reseteo el indice
        this.clienteEnfocadoIndex = -1;
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

        // Guardo la moneda de la lista de precio actual
        this.comprobante.moneda = this.formasPagoSeleccionadas && this.formasPagoSeleccionadas.length > 0 ? 
            this.formasPagoSeleccionadas[0].listaPrecio.idMoneda : null;

        // Detalle de lista correspondiente
        this.detalleListaFpsSeleccionadas = this.formasPagoSeleccionadas
            .map(fpSelec => fp.listaPrecio)
            .filter(
                (lista, index, self) => index === self.findIndex(l => l.idListaPrecio === lista.idListaPrecio)
            )
            .map(lista => `Lista ${lista.idListaPrecio} \nDesde: ${lista.vigenciaDesde.getFechaFormateada()}, Hasta: ${lista.vigenciaHasta.getFechaFormateada()}, ${lista.idMoneda.descripcion}`)
            .join('\n');


        // Ahora mappeo los detalles de las formas de pago seleccionadas para mostrarlos en la grilla de el medio
        this.tablas.datos.detallesFormaPago = this.formasPagoSeleccionadas
            .map(
                fp => Object.assign([], fp.detalles)
                    .map(det => {
                        const auxDet: DetalleFormaPago = Object.assign({}, det);
                        auxDet.formaPagoDescrip = fp.descripcion;

                        const t = this.comprobante.fechaComprobante;
                        const t2=  auxDet;
                        const t3 = moment(
                            this.utilsService.dateLikePickerToDate(
                                this.comprobante.fechaComprobante
                            )
                        )
                        // 
                        // Seteo fechaPago
                        auxDet.fechaPago = new DateLikePicker(
                            moment(
                                this.utilsService.dateLikePickerToDate(
                                    this.comprobante.fechaComprobante
                                )
                            ).add(auxDet.cantDias, 'days').toDate()
                        )
                        // 
                        return auxDet;
                    })
            )
            .reduce((a, b) => [...a].concat([...b]), []); // Aca aplasto el array bidimensional a uno de una dimensión


        this.recursoService.getRecursoList(resourcesREST.productosReducidos)({
            'tipo': 'reducida',
            'listaPrecio':  this.formasPagoSeleccionadas && 
                            this.formasPagoSeleccionadas[0] && 
                            this.formasPagoSeleccionadas[0].listaPrecio ? this.formasPagoSeleccionadas[0].listaPrecio.idListaPrecio : null
        }).subscribe(prods => {
            this.productos.next(prods);
        });
        
    }

    /**
     * Actualizo subtotales
     */
    actualizarSubtotales = (prod: ProductoPendiente) => {
        // Obtengo el nuevo subtotal
        return this.emisionRemitosService.getCalculoSubtotales(prod)
            .toPromise()
            .then(nuevoSubtotal => {
                // Checkeo si hay uno viejo
                const viejoSubtotal = this.tablas.datos.subtotalesProductos.find(s => prod.producto.idProductos === s.idProducto);
        
                // Si hay uno viejo, lo edito. Si NO hay uno viejo, pusheo directamente el nuevo
                if (viejoSubtotal) {
                    viejoSubtotal.subtotal = nuevoSubtotal.subtotal;
                    viejoSubtotal.subtotalIva = nuevoSubtotal.subtotalIva;
                } else {
                    this.tablas.datos.subtotalesProductos.push(nuevoSubtotal);
                }
            })
    }
    
    /**
     * Actualiza el total en cotizacion y otros
     */
    actualizarDatosProductos = (itemSelect?) => {

        // Si viene un item es porque viene de onClickConfirm
        if (itemSelect) {
            // Actualizo subtotal, y dsps las facturas
            this.actualizarSubtotales(itemSelect).then(resp => {
                this.buscoModelos();
                this.actualizarTotalNeto();
            })
        } else {
            this.buscoModelos()
            this.actualizarTotalNeto()
        }


    }

    actualizarTotalNeto = () => {
        // Es la suma de la columna subtotal (que ya tiene aplicado el descuento)
        this.cotizacionDatos.total = 
            _.sumBy(
                this.tablas.datos.productosPend,
                (prod) => {
                    // Busco el subtotal
                    const subtotalBuscado = this.tablas.datos.subtotalesProductos
                        .find(st => st.idProducto === prod.producto.idProductos);
                    
                    return subtotalBuscado && subtotalBuscado.subtotal ? subtotalBuscado.subtotal : 0;
                }
            )
        
    }

    buscoModelos = () => {
        if (this.tablas.datos.productosPend && this.tablas.datos.productosPend.length > 0) {
            this.emisionRemitosService.buscaModelos(
                this.tablas.datos.productosPend
            )(
                this.tablas.datos.subtotalesProductos
            ).subscribe(modelProds => {
                this.tablas.datos.modelosFactura = modelProds;

                this.sumatoriaSubtotales = 
                    _.sumBy(
                        this.tablas.datos.modelosFactura,
                        (fact) => Number(fact.importeTotal) ? Number(fact.importeTotal) : 0
                    );

            })
        } else {
            this.tablas.datos.modelosFactura = [];
            this.sumatoriaSubtotales = 0;
        }
    }


    /**
     * Actualiza la grilla de Trazable Lotes
     */
    actualizarTrazableLotes = (prodToDelete?) => {
        // Agrego los lotes de los productos trazables a la grilla de trazabilidad lotes
        if (this.tablas.datos.productosPend.length > 0) {
            this.emisionRemitosService.buscaLotes(
                this.tablas.datos.productosPend
            )(
                this.comprobante
            ).subscribe(
                // lotes => this.tablas.datos.lotesTraza = lotes
                lotes => {
                    const nuevosLotes = lotes.filter(
                        lotNew => !this.tablas.datos.lotesTraza.some(  
                            lotOld => lotOld.idLote === lotNew.idLote
                        )
                    );

                    this.tablas.datos.lotesTraza = this.tablas.datos.lotesTraza.concat(nuevosLotes);

                    // Si se borró algùn producto, borro sus lotes correspondientes
                    if (prodToDelete) {
                        this.tablas.datos.lotesTraza = this.tablas.datos.lotesTraza.filter(
                            lot => lot.idProducto === prodToDelete.producto.idProducto
                        )
                    }
                }
            )
        } else {
            this.tablas.datos.lotesTraza = [];
        }

    }


    /**
     * Cuando cambia el tipo comprobante lo que hago es agarrar todos los numeros (q inclyyen pto venta y numero) y mappearlos en un array
     */
    onChangeTipoComprobante = (cteTipoSelect) => {
        this.tiposComprobantesRel = this.recursoService.getRecursoList(resourcesREST.cteTipo)({
            'sisModulo': sisModulos.venta,
            'idCteTipo': cteTipoSelect.idCteTipo
        })
        this.tiposComprobantesRel.subscribe(a => console.log(a))

        this.comprobante.numerador.fechaApertura = null;
        this.comprobante.numerador.fechaCierre = null;

        if (this.comprobante.tipo && this.comprobante.tipo.numerador && this.comprobante.tipo.numerador.length > 0) {
            this.comprobante.numerador = this.comprobante.tipo.numerador[0];
        }
    }
    

   

    /**
     * Busca facturas
     */
    fetchFacturas = () => {
        // Busco las facturas de los productos
        if (this.tablas.datos.productosPend && this.tablas.datos.productosPend.length > 0) {
            this.emisionRemitosService.buscaModelos(this.tablas.datos.productosPend)(this.tablas.datos.subtotalesProductos)
                .subscribe(modelProds => {
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

        return (
            restoPagar === '-0.00' || 
            restoPagar === '-0.01' || 
            restoPagar === '0.01'
        ) ? '0.00' : restoPagar
    }


    compareIvaSelect = (i1, i2) => {
        // if (i1 & i2)
        //     debugger;
    }

    onBlurCuit = (ev) => {
        // Si el cuit NO es valido
        if (
            this.cliente.cuit &&
            this.cliente.cuit.toString() &&
            !this.utilsService.validarCuit(this.cliente.cuit.toString())
        ) {
            this.utilsService.showModal('Error')('Cuit no válido')
                (
                    () => {
                        this.cliente.cuit = null;
                        document.getElementById('cuitCliente') ? 
                            document.getElementById('cuitCliente').focus() : null
                    }
                )();
        }
    }

    test() {

        return !this.emisionRemitosService.checkIfDatosValidosComprobante(this.comprobante)
            (this.cliente)
            (this.tablas.datos.productosPend)
            (this.tablas.datos.modelosFactura)
            (this.deposito)
            (this.tablas.datos.lotesTraza)
            ||
            (
                !this.tablas.datos.detallesFormaPago ||
                this.tablas.datos.detallesFormaPago.length <= 0 ||
                !this.isRestoPagarValid()
            )
    }
}



/**
 * Calcula el resto pagar
 */
// calcRestoPagar = () => {
//     const sumMontos = _.sumBy(
//         this.tablas.datos.detallesFormaPago,
//         (fPago) => Number(fPago.monto) ? Number(fPago.monto) : 0
//     )

//     // return this.cotizacionDatos.total - sumMontos
//     return (this.cotizacionDatos.total + this.sumatoriaSubtotales) - sumMontos
// }