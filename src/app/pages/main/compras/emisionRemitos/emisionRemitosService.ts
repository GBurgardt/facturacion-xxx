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
            ancho: '10%'
        },
        {
            nombre: 'imputacion',
            key: 'imputacion',
            ancho: '15%',
            enEdicion: null
        },
        {
            nombre: 'cantidad',
            key: 'pendiente',
            ancho: '7.5%',
            enEdicion: null
        },
        {
            nombre: 'unidad',
            key: 'producto',
            subkey: 'unidadVenta',
            ancho: '7.5%'
        },
        {
            nombre: 'precio',
            key: 'precio',
            ancho: '7.5%',
            enEdicion: null
        },
        {
            nombre: 'dto',
            key: 'descuento',
            ancho: '7.5%',
            enEdicion: null
        },
        {
            nombre: 'tipo',
            key: 'tipoDescuento',
            ancho: '7.5%',
            enEdicion: null
        },
        {
            nombre: 'subtotal',
            key: 'subtotal',
            ancho: '7.5%'
        },
        {
            nombre: '%IVA',
            key: 'ivaPorc',
            ancho: '7.5%'
        },
        {
            nombre: 'subt.C/IVA',
            key: 'subtotalIva',
            ancho: '7.5%'
        },
        {
            nombre: 'trazable',
            key: 'producto',
            subkey: 'trazable',
            ancho: '7.5%'
        }
    ];

    getColumnsTrazabilidad = () => [
        {
            nombre: 'articulo',
            key: 'producto',
            subkey: 'codProducto',
            ancho: '15%'
        },
        {
            nombre: 'descripcion',
            key: 'producto',
            subkey: 'descripcion',
            ancho: '20%'
        },
        {
            nombre: 'GLN',
            key: 'gln',
            ancho: '5%'
        },
        {
            nombre: 'lote',
            key: 'trazabilidad',
            subkey: 'lote',
            ancho: '5%',
            enEdicion: null
        },
        {
            nombre: 'serie',
            key: 'trazabilidad',
            subkey: 'serie',
            ancho: '5%',
            enEdicion: null
        },
        {
            nombre: 'fecha elab',
            key: 'trazabilidad',
            subkey: 'fechaElab',
            ancho: '20%',
            enEdicion: null
        },
        {
            nombre: 'fecha vto',
            key: 'trazabilidad',
            subkey: 'fechaVto',
            ancho: '20%',
            enEdicion: null
        }
    ];

    getColumnsFactura = () => [
        {
            nombre: 'cuenta',
            key: 'cuentaContable',
            ancho: '30%'
        },
        {
            nombre: 'descripcion',
            key: 'descripcion',
            ancho: '30%'
        },
        {
            nombre: 'importe',
            key: 'importeTotal',
            ancho: '30%'
        }
    ]

    /**
     * Buscar los productos pendientes
     */
    buscarPendientes = (cliente: Padron) => (comprobanteRel: ComprobanteRelacionado) => {
        return this.authService.getProductosPendientes(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        )(cliente)(comprobanteRel)
            .map(respuesta => respuesta.arraydatos.map(prodPend => new ProductoPendiente(prodPend)));
    }

    /**
     * Retorna todos los productos de la empresa actual
     */
    getAllProductos = () => this.recursoService.getRecursoList(resourcesREST.productos)();
    

    /**
     * Retorna un array de solo los prodPendientes que son trazables
     */
    getOnlyTrazables = (prodsPend: ProductoPendiente[]) => {
        return prodsPend.filter(prod => prod.producto.trazable);
    }

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
    confirmarYGrabarComprobante = (comprobante: Comprobante) => 
        (comproRelac: ComprobanteRelacionado) =>
        (provSelec: Padron) => 
        (productosPend: ProductoPendiente[]) => 
        (modelosFactura: ModeloFactura[]) =>
        (cotizacionDatos: { cotizacion: Cotizacion, total: number }) => 
        (depositoSelec: Deposito) => this.authService.grabaComprobante(this.localStorageService.getObject(environment.localStorage.acceso).token)(comprobante)(comproRelac)(provSelec)(productosPend)(modelosFactura)(cotizacionDatos)(depositoSelec)
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
       

    seleccionarCliente = (todos: Padron[]) => (seleccionado: Padron) => {
        // Primero busco si el ingresado existe
        const provBuscado = new Padron({...todos.find(
            prove => prove.padronCodigo === Number(seleccionado.padronCodigo)
        )});
        
        // Si existe, lo seteo como seleccionado
        if (provBuscado) {
            return provBuscado;
        } else {
            // Caso contrario..
            // Busco el padronCodigo del cliente que estaba seleccionado
            const clienteAnterior: Padron = new Padron({...todos.find(
                prove =>    prove.padronApelli === seleccionado.padronApelli &&
                            prove.padronNombre === seleccionado.padronNombre &&
                            prove.cuit === seleccionado.cuit &&
                            prove.codigoPostal === seleccionado.codigoPostal
            )});

            // Si habia uno seleccionado, lo restauro
            if (clienteAnterior) {
                // Vuelvo el padronCodigo a su valor correcto
                return clienteAnterior;
            } else {
                // Caso contrario tiro mensajito
                throw({
                    nombre: 'Codigo incorrecto',
                    descripcion: 'El codigo no existe'
                })
                
            }
        }
    }

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

}