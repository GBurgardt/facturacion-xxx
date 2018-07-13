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
import { ModeloFactura } from '../../../../models/modeloFactura';
import { Comprobante } from 'app/models/comprobante';
import { Factura } from '../../../../models/factura';
import { Deposito } from 'app/models/deposito';
import { PopupListaService } from 'app/pages/reusable/otros/popup-lista/popup-lista-service';
import { EmisionRemitosService } from './emisionRemitosService';
import { FormaPago } from '../../../../models/formaPago';
import { CondIva } from '../../../../models/condIva';
import { CteFechas } from '../../../../models/cteFechas';
import { DateLikePicker } from '../../../../models/dateLikePicker';


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
    /////////// Modelos Comprobante /////////////
    /////////////////////////////////////////////
    cliente: Padron = new Padron();
    comprobante: Comprobante = new Comprobante();
    
    factura: Factura = new Factura();
    cotizacionDatos: {
        cotizacion: Cotizacion,
        total: number
    } = { cotizacion: new Cotizacion(), total: 0};

    depositoSelec: Deposito;

    // Inhdice del producto enfocado del popup
    clienteEnfocadoIndex: number = -1;

    // Intervalo de fecha del cte seleccionado (y el pto venta seteado)
    cteFechasIntervalo: CteFechas = new CteFechas();

    /////////////////////////////////////////////
    //////////// Listas desplegables ////////////
    /////////////////////////////////////////////
    sisSitIvas: Observable<CondIva[]>;
    tiposComprobantes: Observable<TipoComprobante[]>;
    tiposOperacion: Observable<SisTipoOperacion[]>;
    monedas: Observable<Moneda[]>;
    depositos: Observable<Deposito[]>;

    // Lista de clientes completa (necesaria para filtrar) y filtrada
    clientes: {
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
            onClickEdit: (tipoColumnas) => (prodSelect: ProductoPendiente) => { 
                this.tablas.columnas[tipoColumnas] = this.tablas.columnas[tipoColumnas].map(tabla => {
                    let newTabla = tabla;
                    if (newTabla.enEdicion !== undefined) {
                        newTabla.enEdicion = prodSelect.producto.idProductos
                    }
                    return newTabla;
                });

                // Hago focus en el select de imputacion
                setTimeout(()=>{
                    const selectImpu: any = document.getElementsByClassName('select-impu-'+prodSelect.producto.idProductos);
                    if(selectImpu && selectImpu[0]) {
                        selectImpu[0].focus();
                    } else {
                        const inputFocus: any = document.getElementsByClassName('input-edit-'+prodSelect.producto.idProductos);
                        inputFocus && inputFocus[0] ? inputFocus[0].focus() : null
                    }
                });
            },
            onClickConfirmEdit: (tipoColumnas) => (prodSelect: ProductoPendiente) => { 
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
           }
        }
    };
    

    /////////////////////////////////////////////
    //////////////// PopupLista /////////////////
    /////////////////////////////////////////////

    popupLista: any = {
        onClickListProv: (prove: Padron) => {
            this.cliente = new Padron({...prove});
            this.emisionRemitosService.getLetrasCliente(this.cliente).subscribe(letras => this.letras = letras);
        },
        getOffsetOfInputCliente: () => this.utilsService.getOffset(document.getElementById('clienteSeleccionado'))
    }

    
    /////////////////////////////////////////////
    ////////// EmisionRemitoDatos ///////////////
    /////////////////////////////////////////////

    dataTablaFormasPago: Observable<FormaPago[]>;

    /**
     * Toda la carga de data se hace en el mismo orden en el que está declarado arriba
     */
    constructor(
        private recursoService: RecursoService,
        private emisionRemitosService: EmisionRemitosService,
        private utilsService: UtilsService,
        private popupListaService: PopupListaService
    ) {

        ////////// Listas desplegables //////////
        this.sisSitIvas = this.recursoService.getRecursoList(resourcesREST.sisSitIva)();
        this.tiposComprobantes = this.recursoService.getRecursoList(resourcesREST.buscaCteTipoNro)([2]);
        this.tiposOperacion = this.recursoService.getRecursoList(resourcesREST.sisTipoOperacion)([2]);
        this.monedas = this.recursoService.getRecursoList(resourcesREST.sisMonedas)();
        this.depositos = this.recursoService.getRecursoList(resourcesREST.depositos)();

        ////////// Clientes  //////////
        this.recursoService.getRecursoList(resourcesREST.proveedores)().subscribe(clientes => {
            this.clientes.todos = clientes;
            this.clientes.filtrados.next(clientes);
        });

        ////////// Tablas //////////
        this.tablas.columnas.columnasProductos = emisionRemitosService.getColumnsProductos();
        this.tablas.columnas.columnasTrazabilidad = emisionRemitosService.getColumnsTrazabilidad();
        this.tablas.columnas.columnasFactura = emisionRemitosService.getColumnsFactura();

        ////////// Otros //////////
        this.emisionRemitosService.getCotizacionDatos().subscribe(cotizDatos => this.cotizacionDatos.cotizacion = cotizDatos);
    }


    ///////////////////////////////// Eventos OnClick /////////////////////////////////

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
    onClickConfirmar = () => null;
    

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

        this.emisionRemitosService.buscaModelos(this.tablas.datos.productosPend).subscribe(modelProds => {
            this.tablas.datos.modelosFactura = modelProds
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
     * El blur es cuando se hace un leave del input (caundo se apreta click afuera por ejemplo).
     * Acá lo que hago es poner un array vacio como próx valor de los filtrados, cosa que la lista desaparezca porque no hay nada
     * También retorno el cliente seleccionado en el input
     */
    onBlurInputProv = (e) => {
        // Vacio filtrados
        this.clientes.filtrados.next([]);

        // Actualizo cliente seleccionado
        try {
            this.cliente = this.emisionRemitosService.seleccionarCliente(this.clientes.todos)(this.cliente);
            this.emisionRemitosService.getLetrasCliente(this.cliente).subscribe(letras => this.letras = letras);
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
                
                // Actualizo las formas de pago de la tabla
                this.dataTablaFormasPago = this.emisionRemitosService.getFormasPago(this.cliente)(this.comprobante.fechaComprobante);
            } else {
                // Si se sale del intervalo permitido, seteo la fecha como fechaApertura
                this.comprobante.fechaComprobante = new DateLikePicker(this.cteFechasIntervalo.fechaApertura);
                // Y le aviso
                this.utilsService.showModal('Error')('La fecha se sale del intervalo permitido')()();
            }
        }

        

    }

    /**
     * Evento blur de pto venta y numero en comprobante
     * tipo: puntoVenta o numero
     * keyTipoe: comprobante, comprobanteRelacionado
     */
    onBlurNumeroAutocomp = (e) => (tipo: string) => (keyTipo: string) => 
        this[keyTipo][tipo] = this.emisionRemitosService.autocompNroComp(tipo)(this[keyTipo]);
    

    /**
     * Actualizo el deposito seleccionado que me viene de tablaIngreso
     */
    onSelectDeposito = (depSelect: Deposito) => {
        this.depositoSelec = depSelect;
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
            provSelect ? this.popupLista.onClickListProv(provSelect) : null;
            // Reseteo el index
            this.clienteEnfocadoIndex = -1;
        })
    }

    /**
     * Evento que se dispara cuando se selecciona una fecha
     */
    onModelChangeFechaComp(e, d) {
        // Actualizo las formas de pago de la tabla
        this.dataTablaFormasPago = this.emisionRemitosService.getFormasPago(this.cliente)(this.comprobante.fechaComprobante);
    }


    onBlurPtoVenta = (e) => (tipo) => (keyTipo) => {
        // Consulto el service y traigo el intevalo de fecha de cteTipo
        this.emisionRemitosService.getBuscaCteFecha(
            this.comprobante
        ).catch((err, c) => {
            // Null en intervalo fechas..
            this.cteFechasIntervalo = null;
            // Pongo fecha seleccionada por dfecto en HOY
            this.comprobante.fechaComprobante = new DateLikePicker(new Date());
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
            // debugger;
            // Actualizo las formas de pago para la fechaApertura
            this.dataTablaFormasPago = this.emisionRemitosService.getFormasPago(this.cliente)(intervaloFecha.fechaApertura);
        });


        // Hago el autocompletado de los nros
        this.onBlurNumeroAutocomp(e)(tipo)(keyTipo)
    }
}
