import { Producto } from "./producto";
import { ModeloDetalle } from "app/models/modeloDetalle";

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
    producto: Producto;

    idFactDetalleImputada: number;
    idFactCabImputada: number;
    descuento: number;
    cantBultos: number;
    despacho: string;
    observaciones: string;
    itemImputada: number;

    // Imputacion
    imputacion: {
        todas: ModeloDetalle[],
        seleccionada: ModeloDetalle;    
    } = {
        todas:[],
        seleccionada:null
    };

    // Datos extras necesarios
    idProductos: number;

    constructor(prod?: any) {
        if (prod) {
            this.comprobante = prod.comprobante;
            this.numero = prod.numero;
            this.original = prod.original ? prod.original : 0;
            this.pendiente = prod.pendiente ? prod.pendiente : 0;
            this.precio = prod.precio ? prod.precio : 0;
            this.dolar = prod.dolar ? prod.dolar : 0;
            this.moneda = prod.moneda;
            this.porCalc = prod.porCalc ? prod.porCalc : 0;
            // Si NO tiene ivaPorc, entonces es un Producto
            this.ivaPorc = prod.ivaPorc ?   prod.ivaPorc : 
                                            prod.IVA.porcIVA ? prod.IVA.porcIVA : 0;
            this.deposito = prod.deposito ? prod.deposito : 0;

            // Si es un prodPendiente y tiene el prducto adentro, entonces lo creo. Sino, lo guardo directamente
            this.producto = prod.producto ? 
                new Producto(prod.producto) :
                prod;

            this.idFactDetalleImputada = prod.idFactDetalleImputada ? prod.idFactDetalleImputada : 0
            this.idFactCabImputada = prod.idFactCabImputada ? prod.idFactCabImputada : 0
            this.descuento = prod.descuento ? prod.descuento : 0
            this.cantBultos = prod.cantBultos ? prod.cantBultos : 0
            this.despacho = prod.despacho
            this.observaciones = prod.observaciones
            this.itemImputada = prod.itemImputada
                

            // Imputacion
            this.imputacion.todas = this.producto.modeloCab.modeloDetalle;
            // Busco el seleccionado por defecto
            if (this.imputacion.todas.length > 0) {
                const impuSelect = this.imputacion.todas.find(modelD => modelD.prioritario);
                this.imputacion.seleccionada = impuSelect ? impuSelect : new ModeloDetalle();
            }

            // Datos extras necesarios
            this.idProductos = this.producto.idProductos;
        } else {
            this.comprobante = null;
            this.numero = null;
            this.original = null;
            this.pendiente = null;
            this.precio = null;
            this.dolar = null;
            this.moneda = null;
            this.porCalc = null;
            this.deposito = null;
            this.producto = new Producto();

            this.idFactDetalleImputada = null
            this.idFactCabImputada = null
            this.descuento = null
            this.cantBultos = null
            this.despacho = null
            this.observaciones = null
            this.itemImputada = null

            this.imputacion.todas = [];
            this.imputacion.seleccionada = new ModeloDetalle();

            this.idProductos = null;
        }
    }

}


/*

constructor(prod?: {
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
        producto: any;
    }) {
 */