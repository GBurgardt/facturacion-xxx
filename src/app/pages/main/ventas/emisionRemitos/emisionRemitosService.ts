import { Injectable } from "@angular/core";
import { Padron } from "../../../../models/padron";
import { AuthService } from "app/services/authService";
import { LocalStorageService } from "app/services/localStorageService";
import { environment } from "environments/environment";
import { ProductoPendiente } from "../../../../models/productoPendiente";
import { RecursoService } from "app/services/recursoService";
import { resourcesREST } from "constantes/resoursesREST";
import { Cotizacion } from "app/models/cotizacion";
import { ProductoBuscaModelo } from "../../../../models/productoBuscaModelo";
import { ModeloFactura } from "../../../../models/modeloFactura";
import { Comprobante } from "app/models/comprobante";
import { ComprobanteRelacionado } from "app/models/comprobanteRelacionado";
import { Observable } from 'rxjs/Observable';
import { Deposito } from '../../../../models/deposito';
import { UtilsService } from '../../../../services/utilsService';
import { FormaPago } from "app/models/formaPago";
import { CteFechas } from "../../../../models/cteFechas";
import { Lote } from "../../../../models/lote";
import { SisCanje } from "../../../../models/sisCanje";
import { DetalleFormaPago } from "app/models/detalleFormaPago";

@Injectable()
export class EmisionRemitosService {
    constructor(
        private authService: AuthService,
        private localStorageService: LocalStorageService,
        private recursoService: RecursoService,
        private utilsService: UtilsService
    ) { }

    filtrarClientes = (listaClientes, textoBuscado) => 
        listaClientes.filter(
            (prov: Padron) =>   prov.padronCodigo.toString().includes(textoBuscado) ||
                                prov.padronApelli.toString().toLowerCase().includes(textoBuscado)
        );    

    getProveFormated = (prove) => `${prove.padronNombre} (${prove.padronCodigo})`;

    getColumnsProductos = () => [
        {
            nombre: 'articulo',
            key: 'producto',
            subkey: 'codProducto',
            ancho: '5%'
        },
        {
            nombre: 'descripcion',
            key: 'producto',
            subkey: 'descripcion',
            ancho: '10%',
            customClass: 'text-left'
        },
        {
            nombre: 'imputacion',
            key: 'imputacion',
            ancho: '15%',
            enEdicion: null,
            editarFocus: true,
            customClass: 'text-left'
        },
        {
            nombre: 'cantidad',
            key: 'pendiente',
            ancho: '7.5%',
            enEdicion: null,
            decimal: true,
            customClass: 'text-right'
        },
        {
            nombre: 'unidad',
            key: 'producto',
            subkey: 'unidadVenta',
            ancho: '4.5%',
            customClass: 'text-left'
        },
        {
            nombre: 'precio',
            key: 'precio',
            ancho: '5.5%',
            enEdicion: null,
            decimal: true,
            customClass: 'text-right'
        },
        {
            nombre: 'dto',
            key: 'descuento',
            ancho: '5.5%',
            enEdicion: null,
            decimal: true,
            customClass: 'text-right'
        },
        {
            nombre: 'tipo',
            key: 'tipoDescuento',
            ancho: '5.5%',
            enEdicion: null,
            elementoFinalBlur: true,
            customClass: 'text-right'
        },
        {
            nombre: 'subtotal',
            key: 'subtotal',
            ancho: '5.5%',
            // decimal: true,
            customClass: 'text-right'
        },
        {
            nombre: '%IVA',
            key: 'ivaPorc',
            ancho: '5.5%',
            decimal: true,
            customClass: 'text-right'
        },
        {
            nombre: 'subt.C/IVA',
            key: 'subtotalIva',
            ancho: '5.5%',
            customClass: 'text-right'
        },
        {
            nombre: 'trazable',
            key: 'producto',
            subkey: 'trazable',
            ancho: '5.5%',
            customClass: 'text-left'
        }
    ];

    getColumnsTrazabilidad = () => [
        {
            nombre: 'articulo',
            key: 'codProducto',
            ancho: '15%'
        },
        {
            nombre: 'descripcion',
            key: 'descripcionProd',
            ancho: '15%',
            customClass: 'text-left'
        },
        {
            nombre: 'proveedor',
            key: 'proveedor',
            ancho: '15%',
            customClass: 'text-left'
        },
        {
            nombre: 'gtin',
            key: 'gtin',
            ancho: '15%',
            customClass: 'text-left'
        },
        {
            nombre: 'lote',
            key: 'nroLote',
            ancho: '6.6%',
            customClass: 'text-right'
        },
        {
            nombre: 'serie',
            key: 'serie',
            ancho: '6.6%',
            customClass: 'text-right'
        },
        {
            nombre: 'vto',
            key: 'fechaVto',
            ancho: '6.6%',
            customClass: 'text-right'
        },
        {
            nombre: 'stock',
            key: 'stock',
            decimal: true,
            ancho: '6.6%',
            customClass: 'text-right'
        },
        {
            nombre: 'receta N',
            key: 'recetaN',
            ancho: '6.6%',
            enEdicion: null,
            editarFocus: true,
            customClass: 'text-right'
        },
        {
            nombre: 'cantidad',
            key: 'cantidad',
            ancho: '6.6%',
            enEdicion: null,
            elementoFinalBlur: true,
            decimal: true,
            customClass: 'text-right'
        }
    ];


    getColumnsCanje = () => [
        {
            nombre: 'articulo',
            key: 'cuentaContable',
            ancho: '30%'
        },
        {
            nombre: 'descripcion',
            key: 'descripcion',
            ancho: '30%',
            customClass: 'text-left'
        },
        {
            nombre: 'cantidad',
            key: 'importeTotal',
            ancho: '30%',
            decimal: true,
            customClass: 'text-right'
        }
    ]

    getColumnsDetallesFp = () => [
        {
            nombre: 'plazo',
            key: 'cantDias',
            ancho: '15%',
            customClass: 'text-right'
        },
        {
            nombre: 'int',
            key: 'porcentaje',
            ancho: '15%',
            decimal: true,
            customClass: 'text-right'
        },
        {
            nombre: 'detalle',
            key: 'detalle',
            ancho: '15%',
            customClass: 'text-left'
        },
        {
            nombre: 'monto',
            key: 'monto',
            ancho: '15%',
            enEdicion: null,
            editarFocus: true,
            decimal: true,
            customClass: 'text-right'
        },
        {
            nombre: 'observaciones',
            key: 'observaciones',
            ancho: '30%',
            enEdicion: null,
            elementoFinalBlur: true,
            customClass: 'text-left'
        }
    ]


    /**
     * Buscar los productos pendientes
     */
    buscarPendientes = (cliente: Padron) => (comprobanteRel: ComprobanteRelacionado) => {
        return this.authService.getProductosPendientes(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        )(cliente)(comprobanteRel)
            .catch(
                err => {
                    const respErr = 
                        err && err['_body'] && err['_body'].control ? 
                            err['_body'].control : null;

                    this.utilsService.showModal(respErr.codigo)(respErr.descripcion)()();
                    return Observable.throw(
                        this.utilsService.showErrorWithBody(err)
                    )
                }
            )
            .map(
                respuesta => respuesta.arraydatos.map(
                    prodPend => new ProductoPendiente(prodPend)
                )
            );
    }

    /**
     * Retorna todos los productos de la empresa actual
     */
    getAllProductos = () => this.recursoService.getRecursoList(resourcesREST.productos)();
    

    

    /**
     * Retorna los datos de cotizacion
     */
    getCotizacionDatos = () => this.authService.getCotizacion(
        this.localStorageService.getObject(environment.localStorage.acceso).token
    ).map(responseCotiz => new Cotizacion(responseCotiz.datos));

    /**
     * Retorna un array de todas las letras (del iva) del proovedr seleccionado
     */
    getLetrasCliente = (proveSelec: Padron) => this.authService.getSisSitIva(
        this.localStorageService.getObject(environment.localStorage.acceso).token
    )(proveSelec).map(
        respSisIva => respSisIva.datos.letra.split(',')
    )

    /**
     * Busca modelos para tab facturacion
     */
    buscaModelos = (prodsPend: ProductoPendiente[]) => {
        const prodsModel = prodsPend.map(prodP => new ProductoBuscaModelo(
            {
                idProducto: prodP.producto.idProductos,
                precio: prodP.precio,
                cantidad: prodP.pendiente
            }
        ));

        return this.authService.buscaModelos(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        )(prodsModel).map(responBuscMod => responBuscMod.arraydatos.map(respModFact => new ModeloFactura(respModFact)));
    }

    /**
     * 
     */
    confirmarYEmitirRemito =    (comprobante: Comprobante) =>
                                (comproRelac: ComprobanteRelacionado) =>
                                (clienteSelec: Padron) =>
                                (productosPend: ProductoPendiente[]) =>
                                (cotizacionDatos: { cotizacion: Cotizacion, total: number }) =>
                                (sisCanje: SisCanje) =>
                                (formasPagoSeleccionadas: FormaPago[]) =>
        this.authService.emitirRemito(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        )(
            comprobante
        )(
            comproRelac
        )(
            clienteSelec
        )(
            productosPend
        )(
            null
        )(
            cotizacionDatos
        )(
            null
        )(
            sisCanje
        )(
            formasPagoSeleccionadas
        )
            .catch(err => Observable.throw(
                this.utilsService.showErrorWithBody(err)
            ))

    /**
     * Valida que los datos estén correctos
     */
    checkIfDatosValidosComprobante =   (comprobante: Comprobante) => 
                                (provSelec: Padron) => 
                                (productosPend: ProductoPendiente[]) => 
                                (modelosFactura: ModeloFactura[]) =>
                                (depositoSelec: Deposito) => {
        // Primero checkeo nulos
        const noExistenNulos = this.checkIfNulosDatosComprobantes(comprobante)(provSelec)(productosPend)(modelosFactura)(depositoSelec);

        // Checkeo que haya productos agregados
        const existenProductos = this.checkIfExistenProductos(productosPend)(modelosFactura);

        /// Checkeo que hayan cargado los datos de la trazabilidad
        const trazabilidadCargada = this.checkIfTrazabilidadCargada(productosPend);

        // Si no existen nulos y si existen productos, los datos son validos
        return noExistenNulos && existenProductos && trazabilidadCargada

    }

    /**
     * Checkeo que lso datos de trazabilidad esten cargados en los productos trazables
     */
    checkIfTrazabilidadCargada = (productosPend: ProductoPendiente[]) => productosPend
        .filter(prodPend => prodPend.producto.trazable)
        .every(
            prod => (prod.trazabilidad && prod.trazabilidad.lote && prod.trazabilidad.serie && prod.trazabilidad.fechaVto && prod.trazabilidad.fechaElab) 
                ? true: false
        )

    /**
     * Me fijo si hay productos agregados
     */
    checkIfExistenProductos = (productosPend: ProductoPendiente[]) => (modelosFactura: ModeloFactura[]) => (
        productosPend.length > 0 && 
        modelosFactura.length > 0
    )

    /**
     * Checkea si existen nulos
     * @return TRUE si NO hay nulos
     */
    checkIfNulosDatosComprobantes =   (comprobante: Comprobante) => 
                                    (provSelec: Padron) => 
                                    (productosPend: ProductoPendiente[]) => 
                                    (modelosFactura: ModeloFactura[]) => 
                                    (depositoSelec: Deposito) => (
        provSelec.padronCodigo &&
        comprobante.tipo.idCteTipo && 
        comprobante.letra && 
        comprobante.puntoVenta &&
        comprobante.numero &&
        comprobante.moneda.idMoneda && 
        comprobante.fechaComprobante &&
        comprobante.fechaVto && 
        productosPend && 
        modelosFactura && 
        depositoSelec
    )

   
    // throw({
    //     nombreError: 'Error',
    //     descripcionError: 'Debe ingresar 4 caracteres o menos'
    // })
    /**
     * Autocompleta con ceros
     */
    autocompNroComp = (tipo) => (recursoComp) => recursoComp && recursoComp[tipo] ?
        recursoComp[tipo].padStart(
            tipo === 'puntoVenta' ? 4 : 8,
            0
        ) : '';
       

    seleccionarCliente = (todos: Padron[]) => (seleccionado: Padron) => 
        new Padron({...todos.find(
            prove => prove.padronCodigo === Number(seleccionado.padronCodigo)
        )});
    

    /**
     * Get formas pago apra la tabla de forma pago emisiuon remito
     */
    getFormasPago = (cliente: Padron) => (fecha: any) => 
        this.authService.getBuscaFormaPago(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        )(cliente)(fecha).map(resp => resp.arraydatos.map(fp => new FormaPago(fp)))
 
        
    /**
     * Busca el (o los) intevalo fecha de un comprobaten dado
     */
    getBuscaCteFecha = (comprobante: Comprobante) => 
        this.authService.getBuscaCteFecha(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        )(comprobante).map(resp => resp.arraydatos.map(cteFe => new CteFechas(cteFe)))


    /**
     * 
     */
    getCalculoSubtotales = (prodPend: ProductoPendiente) =>
        this.authService.getCalculoSubtotales(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        )(prodPend).map(respuesta => {
            return {
                idProducto: prodPend.producto.idProductos,
                subtotal: respuesta.datos.subTotal,
                subtotalIva: respuesta.datos.subTotalIva
            }
        });


    /**
     * Busca lotes dados varios productos
     */
    buscaLotes = (productos: ProductoPendiente[]) => (comprobante: Comprobante) => 
        this.authService.getBuscaLotes(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        )(productos)(comprobante).map(resp => resp.arraydatos.map(lote => new Lote(lote)))
 
    validarAntesDeConfirmar = (tipoColumnas) => (itemSelect: any) => {
        if (
            tipoColumnas === 'columnasTrazabilidad' && 
            itemSelect && 
            itemSelect.cantidad && 
            itemSelect.stockNegativo
        ) {
            if (itemSelect.stockNegativo === 0) {

                if (itemSelect.cantidad > itemSelect.stock) {
                    return 'Cantidad debe ser menor o igual a stock'
                }

            }
        } 
        return 'ok';
    }


}