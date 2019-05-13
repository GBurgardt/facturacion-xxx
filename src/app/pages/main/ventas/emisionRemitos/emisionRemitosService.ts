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
import { DateLikePicker } from "app/models/dateLikePicker";
import { Factura } from "../../../../models/factura";
import { SisTipoOperacion } from "app/models/sisTipoOperacion";
import { Cliente } from "../../../../models/cliente";
import { Vendedor } from "../../../../models/vendedor";
import { ListaPrecio } from "app/models/listaPrecio";
import { TipoComprobante } from "app/models/tipoComprobante";
import sisModulos from "constantes/sisModulos";
import { Contrato } from "app/models/contrato";
import { RelacionCanje } from "app/models/relacionCanje";

@Injectable()
export class EmisionRemitosService {
    constructor(
        private authService: AuthService,
        private localStorageService: LocalStorageService,
        private recursoService: RecursoService,
        public utilsService: UtilsService
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
            ancho: '9%',
            customClass: 'text-left'
        },
        {
            nombre: 'imputacion',
            key: 'imputacion',
            ancho: '13%',
            enEdicion: null,
            editarFocus: true,
            customClass: 'text-left'
        },
        {
            nombre: 'cantidad',
            key: 'pendiente',
            ancho: '6.5%',
            enEdicion: null,
            decimal: true,
            customClass: 'text-right',
            customBlur: 'onBlurInputNumber'
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
            customClass: 'text-right',
            customBlur: 'onBlurInputNumber'
        },
        {
            nombre: 'dto/rec',
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
            nombre: 'precio desc',
            key: 'precioDesc',
            ancho: '5.5%',
            customClass: 'text-right',
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
            ancho: '4.5%',
            customClass: 'text-left'
        },
        {
            nombre: 'Nro Comprobante',
            key: 'numero',
            ancho: '5%',
            customClass: 'text-left'
        },
        {
            nombre: 'LP',
            key: 'codigoListaPrecio',
            ancho: '5%',
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

    // getColumnsDetallesFp = () => [
    //     {
    //         nombre: 'plazo',
    //         key: 'cantDias',
    //         ancho: '15%',
    //         customClass: 'text-right'
    //     },
    //     {
    //         nombre: 'int',
    //         key: 'porcentaje',
    //         ancho: '15%',
    //         decimal: true,
    //         customClass: 'text-right'
    //     },
    //     {
    //         nombre: 'detalle',
    //         key: 'detalle',
    //         ancho: '15%',
    //         customClass: 'text-left'
    //     },
    //     {
    //         nombre: 'monto',
    //         key: 'monto',
    //         ancho: '15%',
    //         enEdicion: null,
    //         editarFocus: true,
    //         decimal: true,
    //         customClass: 'text-right'
    //     },
    //     {
    //         nombre: 'observaciones',
    //         key: 'observaciones',
    //         ancho: '30%',
    //         enEdicion: null,
    //         elementoFinalBlur: true,
    //         customClass: 'text-left'
    //     }
    // ]

    getColumnsDetallesFp = () => [
        {
            nombre: 'forma pago',
            key: 'formaPagoDescrip',
            ancho: '15%'
        },
        {
            nombre: 'plazo',
            key: 'cantDias',
            ancho: '15%',
            customClass: 'text-right'
        },
        {
            nombre: 'fecha pago',
            key: 'fechaPago',
            ancho: '15%',
            enEdicion: null,
            editarFocus: true,
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
            decimal: true,
            customClass: 'text-right monto-element'
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
    buscarPendientes = (cliente: Padron) => (comprobanteRel: ComprobanteRelacionado) => (comprobante: Comprobante) => (tipoOpSelect) => (listaPrecioSelect: ListaPrecio) => {
        return this.authService.getProductosPendientes(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        )(cliente)(comprobanteRel)(comprobante)(tipoOpSelect)(listaPrecioSelect)(sisModulos.venta)
            .catch(
                err => {
                    // const respErr = 
                    //     err && err['_body'] && err['_body'].control ? 
                    //         err['_body'].control : null;

                    // this.utilsService.showModal(respErr.codigo)(respErr.descripcion)()();
                    // return Observable.throw(
                    //     this.utilsService.showErrorWithBody(err)
                    // )

                    this.utilsService.showErrorWithBody(err);

                    return Observable.of({
                        arraydatos: []
                    });
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
     * 
     */
    buscaModelos = (prodsPend: ProductoPendiente[], subtotales: any[], idMoneda, idCliente, idSisTipoOperacion) => {
        const prodsModel = prodsPend
            .map(prodP => {

                const subtotalProd = subtotales
                    .find(
                        st => st.idFactDetalle === prodP.idFactDetalle
                    );

                return new ProductoBuscaModelo(
                    {
                        idProducto: prodP.producto.idProductos,
                        precio: prodP.precio,
                        cantidad: prodP.pendiente,
                        subTotal: subtotalProd ? subtotalProd.subtotal : null
                    }
                )
            });

        return this.authService.buscaModelos(
            this.localStorageService.getObject(environment.localStorage.acceso).token,
            prodsModel,
            sisModulos.venta,
            idMoneda,
            idCliente,
            idSisTipoOperacion)
            .map(
                responBuscMod => 
                    responBuscMod.arraydatos.map(
                        respModFact => new ModeloFactura(respModFact)
                    )
            );
    }

    /**
     * 
     */
    confirmarYEmitirRemito =    (comprobante: Comprobante) =>
                                (comproRelac: ComprobanteRelacionado) =>
                                (clienteSelec: Padron) =>
                                // (clienteSelec: Cliente) =>
                                (productosPend: ProductoPendiente[]) =>
                                (cotizacionDatos: { cotizacion: Cotizacion, total: number }) =>
                                (sisCanje: SisCanje) =>
                                (formasPagoSeleccionadas: FormaPago[]) =>
                                // (factura: Factura) =>
                                (factura: Comprobante) =>
                                (modelosFactura: ModeloFactura[]) =>
                                (detallesFormaPago: DetalleFormaPago[]) => 
                                (depositoSelec: Deposito) => 
                                (lotesTraza: Lote[]) => 
                                (tipoOpSelect: SisTipoOperacion) => 
                                (dataVendedor: any) => 
                                (subtotalesProductos: any) => 
                                (listaPrecioSelec: ListaPrecio) => 
                                (contrato: Contrato) => 
                                (relacionCanje: RelacionCanje) => 
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
            modelosFactura
        )(
            cotizacionDatos
        )(
            depositoSelec
        )(
            sisCanje
        )(
            formasPagoSeleccionadas
        )(
            factura
        )(
            detallesFormaPago
        )(
            lotesTraza
        )(
            tipoOpSelect
        )(
            dataVendedor
        )(
            subtotalesProductos
        )(
            listaPrecioSelec
        )(contrato)(relacionCanje)

    /**
     * Valida que los datos estén correctos
     */
    checkIfDatosValidosComprobante =    (comprobante: Comprobante) => 
                                        (clienteSelect: Padron) => 
                                        (productosPend: ProductoPendiente[]) => 
                                        (modelosFactura: ModeloFactura[]) =>
                                        (depositoSelec: Deposito) => 
                                        (lotesTraza: Lote[]) => {
        // Primero checkeo nulos
        const noExistenNulos = this.checkIfNulosDatosComprobantes(comprobante)(clienteSelect)(productosPend)(modelosFactura)(depositoSelec);

        // Checkeo que haya productos agregados
        const existenProductos = this.checkIfExistenProductos(productosPend)(modelosFactura);

        /// Checkeo que hayan cargado los datos de la trazabilidad
        // const trazabilidadCargada = this.checkIfTrazabilidadCargada(productosPend);

        // Checkeo lotes trazabales
        const lotesTrazablesValido = this.checkIfValidLotesTraza(lotesTraza);

        // console.log('lotesTrazablesValido');
        // console.log(lotesTrazablesValido);

        // console.log('noExistenNulos');
        // console.log(noExistenNulos);
        // console.log('existenProductos');
        // console.log(existenProductos);
        // console.log('trazabilidadCargada');
        // console.log(trazabilidadCargada);

        // Si no existen nulos y si existen productos, los datos son validos
        // return noExistenNulos && existenProductos && trazabilidadCargada
        return noExistenNulos && existenProductos && lotesTrazablesValido

    }

    checkIfValidLotesTraza = (lotesTraza: Lote[]) => 
        lotesTraza && (
            lotesTraza.length > 0 ? 
                lotesTraza.every(
                    (lot: Lote) => lot.cantidad && lot.recetaN
                ) 
                :
                true
        )
    
    /**
     * Checkea si existen nulos
     * @return TRUE si NO hay nulos
     */
    checkIfNulosDatosComprobantes =   (comprobante: Comprobante) => 
                                    (provSelec: Padron) => 
                                    (productosPend: ProductoPendiente[]) => 
                                    (modelosFactura: ModeloFactura[]) => 
                                    (depositoSelec: Deposito) =>  {

        const result = provSelec !== null && 
            provSelec.padronCodigo !== null && 
            comprobante.tipo !== null && 
            comprobante.tipo.idCteTipo !== null && 
            comprobante.numerador !== null &&
            comprobante.numerador.ptoVenta !== null &&
            // comprobante.moneda !== null && 
            // comprobante.moneda.idMoneda !== null && 
            comprobante.fechaComprobante !== null &&
            comprobante.fechaVto !== null && 
            productosPend !== null && 
            modelosFactura !== null && 
            depositoSelec !== null;

        return result;
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
        productosPend.length > 0 
        // modelosFactura.length > 0
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
                subtotalIva: respuesta.datos.subTotalIva,
                precioDesc: respuesta.datos.precioDesc,
                numeroComp: prodPend.numero,
                idFactDetalle: prodPend.idFactDetalle
            }
        });


    /**
     * Busca lotes dados varios productos
     */
    buscaLotes = (productos: ProductoPendiente[]) => (comprobante: Comprobante) => 
        this.authService.getBuscaLotes(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        )(productos)(comprobante).map(
            resp => resp.arraydatos.map(
                lote => new Lote(lote)
            )
        )
 
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

    getColumnsFactura = () => [
        {
            nombre: 'cuenta',
            key: 'cuentaContable',
            ancho: '30%'
        },
        {
            nombre: 'descripción',
            key: 'descripcion',
            ancho: '30%'
        },
        {
            nombre: 'base imponible',
            key: 'baseImponible',
            ancho: '30%',
            decimal: true,
        },
        {
            nombre: 'importe',
            key: 'importeTotal',
            ancho: '30%',
            // decimal: true,
            enEdicion: null,
            customClass: 'text-right',
            editarFocus: true,
            elementoFinalBlur: true
        }
    ]

    /**
     * Busca un producto en la base, por su ID
     */
    buscarProducto = (idProducto) => (idListaPrecio) => (idMoneda) =>
        this.authService.getBuscarProducto(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        )(idProducto)(idListaPrecio)(idMoneda)
            .map(
                respProdEnc => respProdEnc && respProdEnc.arraydatos && respProdEnc.arraydatos.length > 0 ?
                    new ProductoPendiente(respProdEnc.arraydatos[0]) : null
            )


    /**
     * Checkea si el cliente existe en la db de facturación
     */
    checkIfClientExistInFacturacion = (cliente: Padron) => 
        this.authService.getResourceList(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        )(
            resourcesREST.cliente.nombre
        )({
            codCliente: cliente.padronCodigo
        })('query')
        .map(
            resp => resp && resp.control.codigo && resp.control.codigo === 'OK' ? 
                new Vendedor(
                    resp.arraydatos[0].vendedor
                ) : null
        )
        .toPromise();


    /**
     * Checkea que todos los productos agregados tengan cant > 0
     */
    existsProductsWithoutCantidad = (prodsList: ProductoPendiente[]) => 
        !prodsList.every(
            prod => prod.pendiente > 0
        )
    

    autorizarAfip = (idFactCab) => 
        this.authService.autorizarAfip(
            this.localStorageService.getObject(environment.localStorage.acceso).token,
            'solicitarCae',
            idFactCab
        )
            // .catch((err, caught) => {
            //     // debugger;
            //     this.utilsService.showErrorWithBody(err, true);
            //     return Observable.of([]);
            // })
    

}