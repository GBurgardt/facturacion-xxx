import { Producto } from "./producto";
import { ModeloDetalle } from "app/models/modeloDetalle";
import { DateLikePicker } from "./dateLikePicker";

export class ProductoPendiente {
    comprobante: string;
    numero: string;
    original: number;
    pendiente: number;
    precio: number;
    dolar: number;
    moneda: string;
    porCalc: number;
    ivaPorc: number;
    deposito: number;
    idFactDetalleImputa: number;
    idFactCabImputada: number;
    descuento: number;
    tipoDescuento: string;
    cantBultos: number;
    despacho: string;
    observaciones: string;
    itemImputada: number;
    producto: Producto;

    // Imputacion
    imputacion: {
        todas: ModeloDetalle[],
        seleccionada: ModeloDetalle;    
    } = {
        todas:[],
        seleccionada:null
    };

    // Datos traza
    trazabilidad: {
        lote: string,
        serie: string,
        fechaElab: DateLikePicker,
        fechaVto: DateLikePicker
    }

    importe: number;
    auxPreviusImporte: number;

    // nroComprobante: string;

    // subtotal: number;

    constructor(productoPendiente?: {
        comprobante: string;
        numero: string;
        original: number;
        pendiente: number;
        precio: number;
        dolar: number;
        moneda: string;
        porCalc: number;
        ivaPorc: number;
        deposito: number;
        idFactDetalleImputa: number;
        idFactCabImputada: number;
        descuento: number;
        tipoDescuento: string;
        cantBultos: number;
        despacho: string;
        observaciones: string;
        itemImputada: number;
        producto: any;
        importe?: number;
    }) {
        if (productoPendiente) {
            this.comprobante = productoPendiente.comprobante;
            this.numero = productoPendiente.numero;
            this.original = productoPendiente.original;
            this.pendiente = productoPendiente.pendiente;
            this.precio = productoPendiente.precio;
            this.dolar = productoPendiente.dolar;
            this.moneda = productoPendiente.moneda;
            this.porCalc = productoPendiente.porCalc;
            this.ivaPorc = productoPendiente.ivaPorc;
            this.deposito = productoPendiente.deposito;
            this.idFactDetalleImputa = productoPendiente.idFactDetalleImputa;
            this.idFactCabImputada = productoPendiente.idFactCabImputada;
            this.descuento = productoPendiente.descuento;
            this.tipoDescuento = productoPendiente.tipoDescuento;
            this.cantBultos = productoPendiente.cantBultos;
            this.despacho = productoPendiente.despacho;
            this.observaciones = productoPendiente.observaciones;
            this.itemImputada = productoPendiente.itemImputada;
            this.producto = new Producto(productoPendiente.producto);


            // Imputacion
            this.imputacion.todas = this.producto.modeloCab.modeloDetalle;
            // Busco el seleccionado por defecto
            if (this.imputacion && this.imputacion.todas && this.imputacion.todas.length > 0) {
                const impuSelect = this.imputacion.todas.find(modelD => modelD.prioritario);
                this.imputacion.seleccionada = impuSelect ? impuSelect : new ModeloDetalle();
            }

            // Vienen sin datos de trazabilidad
            this.trazabilidad = {
                lote: null,
                serie: null,
                fechaElab: null,
                fechaVto: null
            };

            this.importe = productoPendiente.importe ? productoPendiente.importe : 0;
            this.auxPreviusImporte = 0;

            // this.nroComprobante = '';


        } else {
            this.comprobante = null;
            this.numero = null;
            this.original = null;
            this.pendiente = null;
            this.precio = null;
            this.dolar = null;
            this.moneda = null;
            this.porCalc = null;
            this.ivaPorc = null;
            this.deposito = null;
            this.idFactDetalleImputa = null;
            this.idFactCabImputada = null;
            this.descuento = null;
            this.tipoDescuento = null;
            this.cantBultos = null;
            this.despacho = null;
            this.observaciones = null;
            this.itemImputada = null;
            this.producto = new Producto();

            this.imputacion.todas = [];
            this.imputacion.seleccionada = new ModeloDetalle();

            this.trazabilidad = {
                lote: null,
                serie: null,
                fechaElab: null,
                fechaVto: null
            };

            this.importe = null;
            this.auxPreviusImporte = null;

            // this.nroComprobante = null;
        }
    }

}