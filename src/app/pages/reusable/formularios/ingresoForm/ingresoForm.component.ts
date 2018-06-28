import * as _ from 'lodash';
import { Component, Input, ViewChild, ElementRef } from '@angular/core';

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
import { Comprobante } from 'app/models/comprobante';
import { ComprobanteRelacionado } from 'app/models/comprobanteRelacionado';
import { Factura } from '../../../../models/factura';
import { Deposito } from 'app/models/deposito';

@Component({
    selector: 'ingreso-form',
    templateUrl: './ingresoForm.html',
    styleUrls: ['./ingresoForm.scss']
})

/**
 * Form reutilizable
 */
export class IngresoForm {
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
            },
            onClickConfirmEdit: (tipoColumnas) => (prodSelect: ProductoPendiente) => { 
                // Actualizo el Total Comprobante sumando todos los precios nuevamente (no le sumo directamente el precio editado porque no es un precio nuevo, sino que ya está y debería sumarle la diferencia editada nomás)
                this.cotizacionDatos.total = Math.round(
                    _.sumBy(
                        this.tablas.datos.productosPend,
                        (prod) => Number(prod.precio) ? Number(prod.precio) * Number(prod.pendiente) : 0
                    )
                );

                // Actualizo los modelos factura (si se ingresó precio y pendiente)
                (prodSelect && prodSelect.precio > 0 && prodSelect.pendiente > 0) ? 
                    this.ingresoFormService.buscaModelos(this.tablas.datos.productosPend).subscribe(modelProds => {
                        this.tablas.datos.modelosFactura = modelProds
                    }) : null;

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
            this.proveedorSeleccionado = _.clone(prove);
            this.ingresoFormService.getLetrasProveedor(this.proveedorSeleccionado).subscribe(letras => this.letras = letras);
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
        //this.ingresoFormService.buscarPendientes(this.proveedorSeleccionado)(this.comprobanteRelacionado).subscribe(prodsPend=>console.log(prodsPend));
    }

    /**
     * Agrega el producto seleccionado a la lista de productosPendientes
     */
    onClickProductoLista = (prodSelec: ProductoPendiente) => {
        
        
        const existeProd = this.tablas.datos.productosPend.find(prod=>prod.producto.idProductos === prodSelec.producto.idProductos)

        !existeProd ? this.tablas.datos.productosPend.push(prodSelec) : null;

    }

    /**
     * Valida y graba el comprobante
     */
    onClickConfirmar = () => {

        console.log(this.comprobante)
        

        // this.ingresoFormService.confirmarYGrabarComprobante(this.comprobante)
        //     (this.comprobanteRelacionado)
        //     (this.proveedorSeleccionado)
        //     (this.tablas.datos.productosPend)
        //     (this.tablas.datos.modelosFactura)
        //     (this.cotizacionDatos)
        //     (this.depositoSelec).subscribe(
        //         a=>console.log(a)
        //     )
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
            const provSeleccionado = _.clone(this.proveedores.todos.find((prove) => prove.padronCodigo.toString() === codProv));
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
     * También retorno el proveedor seleccionado en el input
     */
    onBlurInputProv = (e) => {
        // Agrego el settimeout para que se ejecute antes el evento click de la lista, sino se ejecuta antes este y nunca se ejecuta el click de la lista
        setTimeout(() => {
            // Vacio filtrados
            this.proveedores.filtrados.next([]);

            // Actualizo proveedor seleccionado
            try {
                this.proveedorSeleccionado = this.ingresoFormService.seleccionarProveedor(this.proveedores.todos)(this.proveedorSeleccionado);
            }
            catch(err) {
                // Muestro error
                if (err && err.nombre && err.descripcion) {
                    this.utilsService.showModal(err.nombre)(err.descripcion)()();
                }
                // Vacio proveedor seleccionado
                this.proveedorSeleccionado = new Padron();
            }
        }, 100)
    }


    /**
     * Setea la fecha de compra calculandola dado un string en formato 'ddmm', parseando a 'dd/mm/aaaa'
     */
    onCalculateFecha = (e) => (keyFecha) => {
        if (!this.comprobante[keyFecha] || typeof this.comprobante[keyFecha] !== 'string') return;
        
        this.comprobante[keyFecha] = this.utilsService.stringToDateLikePicker(this.comprobante[keyFecha]);

        // Hago focus en el prox input
        (keyFecha==='fechaComprobante') ? document.getElementById("fechaVto").focus() : null;
        (keyFecha==='fechaVto') ? document.getElementById("cteRelSelect").focus() : null;

    }

    /**
     * Evento blur de pto venta y numero en comprobante
     * tipo: puntoVenta o numero
     * keyTipoe: comprobante, comprobanteRelacionado
     */
    onBlurNumeroAutocomp = (e) => (tipo: string) => (keyTipo: string) => {
        try {
            this[keyTipo][tipo] = this.ingresoFormService.autocompNroComp(tipo)(this[keyTipo]);
        }
        catch (err) {
            (err && err.nombreError) ? 
                this.utilsService.showModal(err.nombreError)(err.descripcionError)()() : null;
            // Limpio el campo
            this[keyTipo][tipo] = '';
        }
    }

    /**
     * Actualizo el deposito seleccionado que me viene de tablaIngreso
     */
    onSelectDeposito = (depSelect: Deposito) => {
        this.depositoSelec = depSelect;
    }
}

















// /**
//      * Evento click de la pesñta factura. Recarga los modelos de la factura
//      */
//     onClickFacturaTab = () => {
//         // Checkeo si existe algun producto sin precio o sin cantidad asignado
//         const existeProdSinPrecioOCantidad = this.tablas.datos.productosPend.some(
//             prodPend => !prodPend.precio || !prodPend.pendiente
//         );

//         // Si existe, entonces NO hago la consulta y aviso al usuario tal sitaucion
//         if (existeProdSinPrecioOCantidad) {
//             this.utilsService.showModal('Aviso')('Algunos productos no tienen precio o cantidad definida')()();
//         } else {
//             // Caso contrario puedo proseguir y hacer la consulta libremente
//             this.ingresoFormService.buscaModelos(this.tablas.datos.productosPend).subscribe(modelProds => {
//                 this.tablas.datos.modelosFactura = modelProds
//             });
//         }
//     }