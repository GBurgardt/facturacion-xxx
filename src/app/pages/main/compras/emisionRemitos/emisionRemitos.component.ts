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
    tipoOperacion: SisTipoOperacion = new SisTipoOperacion();
    sisCanje: SisCanje = new SisCanje();
    formasPagoSeleccionadas: FormaPago[] = [];

    /////////////////////////////////////////////
    //////////// Listas desplegables ////////////
    /////////////////////////////////////////////
    sisSitIvas: Observable<CondIva[]>;
    tiposComprobantes: Observable<TipoComprobante[]>;
    tiposOperacion: Observable<SisTipoOperacion[]>;
    monedas: Observable<Moneda[]>;
    depositos: Observable<Deposito[]>;
    productos: Observable<ProductoPendiente[]>;
    sisCanjes: Observable<SisCanje[]>;
    clientes: { todos: Padron[]; filtrados: BehaviorSubject<Padron[]> } = { todos: [], filtrados: new BehaviorSubject([]) }
    letras: string[] = [];
    
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
            detallesFormaPago: DetalleFormaPago[]
        }
    } = { 
        columnas: { 
            columnasProductos: [],
            columnasTrazabilidad: [],
            columnasCanje: [],
            columnasDetallesFp: []
        }, 
        datos: { 
            productosPend: [],
            subtotalesProductos: [],
            productosCanje: [],
            lotesTraza: [],
            detallesFormaPago: []
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
        private _state: GlobalState
    ) {

        ////////// Listas desplegables //////////
        this.sisSitIvas = this.recursoService.getRecursoList(resourcesREST.sisSitIva)();
        this.tiposComprobantes = this.recursoService.getRecursoList(resourcesREST.buscaCteTipoNro)([2]);
        this.tiposOperacion = this.recursoService.getRecursoList(resourcesREST.sisTipoOperacion)([2]);
        this.monedas = this.recursoService.getRecursoList(resourcesREST.sisMonedas)();
        this.depositos = this.recursoService.getRecursoList(resourcesREST.depositos)();

        // this.productos = this.recursoService.getRecursoList(resourcesREST.buscaPendientes)();
        this.productos = this.recursoService.getRecursoList(resourcesREST.buscaPendientes)({
            'idSisTipoModelo': 1
        });

        this.sisCanjes = this.recursoService.getRecursoList(resourcesREST.sisCanjes)();

        ////////// Clientes  //////////
        this.recursoService.getRecursoList(resourcesREST.proveedores)().subscribe(clientes => {
            this.clientes.todos = clientes;
            this.clientes.filtrados.next(clientes);
        });

        ////////// Tablas //////////
        this.tablas.columnas.columnasProductos = emisionRemitosService.getColumnsProductos();
        this.tablas.columnas.columnasTrazabilidad = emisionRemitosService.getColumnsTrazabilidad();
        this.tablas.columnas.columnasCanje = emisionRemitosService.getColumnsCanje();
        this.tablas.columnas.columnasDetallesFp = emisionRemitosService.getColumnsDetallesFp();

        ////////// Otros //////////
        this.emisionRemitosService.getCotizacionDatos().subscribe(cotizDatos => this.cotizacionDatos.cotizacion = cotizDatos);

        // Notifico el menu seleccionado
        // this._state.notifyDataChanged('menu.isCollapsed', 'Emision Remito');
    }

    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////// Eventos Click /////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////

    onClickRemove = (prodSelect: ProductoPendiente) => {
        _.remove(this.tablas.datos.productosPend, (prod: ProductoPendiente) => {
            return prod.producto.idProductos === prodSelect.producto.idProductos;
        });
    }

    onClickEdit = (tipoColumnas) => (itemSelect: any) => { 
        this.tablas.columnas[tipoColumnas] = this.tablas.columnas[tipoColumnas].map(tabla => {
            let newTabla = tabla;
            if (newTabla.enEdicion !== undefined) {
                
                tipoColumnas === 'columnasProductos' ? newTabla.enEdicion = itemSelect.producto.idProductos :
                tipoColumnas === 'columnasTrazabilidad' ? newTabla.enEdicion = itemSelect.nroLote :
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
        // Actualizo datos dle producto
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

        // Actualizo subtotales
        this.actualizarSubtotales(itemSelect);
    }

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
        this.onClickEdit('columnasProductos')(prodSelec);

        // Actualizo grilla trazable lotes
        this.actualizarTrazableLotes();

    }


    /**
     * Actualiza la grilla de Trazable Lotes
     */
    actualizarTrazableLotes = () => {
        // Agrego los lotes de los productos trazables a la grilla de trazabilidad lotes
        if (this.tablas.datos.productosPend.length > 0) {
            this.emisionRemitosService.buscaLotes(
                this.tablas.datos.productosPend
            )(
                this.comprobante
            ).subscribe(
                lotes => this.tablas.datos.lotesTraza = lotes
            )
        }

    }

    /**
     * Valida y graba el comprobante
     */
    onClickConfirmar = () => null;

    /**
     * Busca los productos pendientes de acuerdo al comprobante relacionado
     */
    onClickBuscarPendientes = () => 
        this.emisionRemitosService.buscarPendientes(this.cliente)(this.comprobanteRelacionado).subscribe(prodsPend=>{
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
        this.cliente = new Padron({...prove});
        this.emisionRemitosService.getLetrasCliente(this.cliente).subscribe(letras => this.letras = letras);
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
            this.cliente = this.emisionRemitosService.seleccionarCliente(this.clientes.todos)(this.cliente);
            this.emisionRemitosService.getLetrasCliente(this.cliente).subscribe(letras => this.letras = letras);

            // Si están seteados los datos necesarios aprovecho a actualizar la data de la tabla de forma de pago
            this.comprobante && this.comprobante.fechaComprobante && this.comprobante.fechaComprobante.day ?
                this.dataTablaFormasPago = this.emisionRemitosService.getFormasPago(this.cliente)(this.comprobante.fechaComprobante) :
                null;
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
     * Setea la fecha de compra calculandola dado un string en formato 'ddmm', parseando a 'dd/mm/aaaa'
     * También hago otras cosas
     */
    onBlurFechaComprobante = (e) => {
        
        // Primero checkeo que el intervalo existe ya que puede que el tipoComrpoiabte con ese pto venta NO tenga intervalo
        // Por lo que el operador puede ingresar la fecha que se le cante, y yo pongo por defecto la del día
        if (this.comprobante.fechaComprobante) {
            // Si NO hay intervalo, o si SI hay intervalo Y la fecha ingresada está dentro de el...
            if (
                (!this.cteFechasIntervalo || !this.cteFechasIntervalo.fechaApertura) ||
                moment(
                    this.utilsService.dateLikePickerToDate(this.comprobante.fechaComprobante)
                ).isBetween(
                    moment(this.cteFechasIntervalo.fechaApertura),
                    moment(this.cteFechasIntervalo.fechaCierre)
                )
            ) {
                // Actualizo fecha (sobretodo si el formato es 'ddmm')
                this.comprobante.fechaComprobante = this.utilsService.stringToDateLikePicker(this.comprobante.fechaComprobante);
                
                // Actualizo las formas de pago de la tabla (solo si está seteado el cliente)
                this.cliente && this.cliente.cuit ?
                    this.dataTablaFormasPago = this.emisionRemitosService.getFormasPago(this.cliente)(this.comprobante.fechaComprobante) : 
                    null;
            } else {
                // Si se sale del intervalo permitido, seteo la fecha como fechaApertura
                this.comprobante.fechaComprobante = new DateLikePicker(this.cteFechasIntervalo.fechaApertura);
                // Y le aviso
                this.utilsService.showModal('Error')('La fecha se sale del intervalo permitido')()();
            }

            // Actualizo grilla trazable lotes
            this.actualizarTrazableLotes();

        }
    }

    /**
     * Evento blur de pto venta y numero en comprobante
     * tipo: puntoVenta o numero
     * keyTipoe: comprobante, comprobanteRelacionado
     */
    onBlurNumeroAutocomp = (e) => (tipo: string) => (keyTipo: string) => 
        this[keyTipo][tipo] = this.emisionRemitosService.autocompNroComp(tipo)(this[keyTipo]);
    
    onBlurPtoVenta = (e) => (tipo) => (keyTipo) => {
        // Consulto el service y traigo el intevalo de fecha de cteTipo
        this.emisionRemitosService.getBuscaCteFecha(
            this.comprobante
        ).catch((err, c) => {
            // Null en intervalo fechas..
            this.cteFechasIntervalo = null;
            // Pongo fecha seleccionada por dfecto en HOY
            this.comprobante.fechaComprobante = new DateLikePicker(new Date());
            // Actualizo las formas de pago para la fecha de hoy (solo si está seteado el cliente y la fecha)
            this.cliente && this.cliente.cuit && this.comprobante && this.comprobante.fechaComprobante ?
                this.dataTablaFormasPago = this.emisionRemitosService.getFormasPago(this.cliente)(this.comprobante.fechaComprobante) : 
                null;
            return Observable.from([]);
        })
        .subscribe((cteFechas: CteFechas[]) => {
            // Agarro el primer objeto (viene en un array pero es único)
            const intervaloFecha = cteFechas && cteFechas.length === 1 ? cteFechas[0] : new CteFechas();
            if (cteFechas.length > 0) {
                // Actualizo intervalo
                this.cteFechasIntervalo = intervaloFecha
                // Seteo fecha por defecto
                this.comprobante.fechaComprobante = new DateLikePicker(intervaloFecha.fechaApertura);
            } else {
                // Null en intervalo fechas..
                this.cteFechasIntervalo = null;
                // Pongo fecha seleccionada por dfecto en HOY
                this.comprobante.fechaComprobante = new DateLikePicker(new Date());
            }
            // Actualizo las formas de pago para la fechaApertura (solo si está seteado el cliente y la fecha)
            this.cliente && this.cliente.cuit && this.comprobante && this.comprobante.fechaComprobante ?
                this.dataTablaFormasPago = this.emisionRemitosService.getFormasPago(this.cliente)(intervaloFecha.fechaApertura):
                null;
        });


        // Hago el autocompletado de los nros
        this.onBlurNumeroAutocomp(e)(tipo)(keyTipo)
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
     * Evento que se dispara cuando se selecciona una fecha
     */
    onModelChangeFechaComp(e, d) {
        // Actualizo las formas de pago de la tabla (solo si está seteado el cliente)
        this.cliente && this.cliente.cuit ?
            this.dataTablaFormasPago = this.emisionRemitosService.getFormasPago(this.cliente)(this.comprobante.fechaComprobante) :
            null;
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
        tipoOperacion === 'add' ?
            this.formasPagoSeleccionadas.push(fp) :
            this.formasPagoSeleccionadas = this.formasPagoSeleccionadas.filter(fpSelec => fpSelec.idFormaPago !== fp.idFormaPago);

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
                fp => fp.detalles
            )
            .reduce((a, b) => [...a].concat([...b]), []); // Aca aplasto el array bidimensional a uno de una dimensión

        
    }

    /**
     * Actualizo subtotales
     */
    actualizarSubtotales = (prod: ProductoPendiente) => {
        // Obtengo el nuevo subtotal
        this.emisionRemitosService.getCalculoSubtotales(prod).subscribe(nuevoSubtotal => {
            // Checkeo si hay uno viejo
            const viejoSubtotal = this.tablas.datos.subtotalesProductos.find(s => prod.producto.idProductos === s.idProducto);
    
            // Si hay uno viejo, lo edito. Si NO hay uno viejo, pusheo directamente el nuevo
            if (viejoSubtotal) {
                viejoSubtotal.subtotal = nuevoSubtotal.subtotal;
                viejoSubtotal.subtotalIva = nuevoSubtotal.subtotalIva;
            } else {
                this.tablas.datos.subtotalesProductos.push(nuevoSubtotal);
            }
        });
    }
    
    /**
     * Actualiza el total en cotizacion y otros
     */
    actualizarDatosProductos = () => {
        // Actualizo el Total Comprobante sumando todos los precios nuevamente 
        // (no le sumo directamente el precio editado porque no es un precio nuevo, sino que ya está y debería sumarle la diferencia editada nomás)
        this.cotizacionDatos.total = Math.round(
            _.sumBy(
                this.tablas.datos.productosPend,
                (prod) => Number(prod.precio) ? Number(prod.precio) * Number(prod.pendiente) : 0
            )
        );
    }

    
}
