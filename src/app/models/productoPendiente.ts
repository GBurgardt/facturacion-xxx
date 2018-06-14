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
            this.original = prod.original;
            this.pendiente = prod.pendiente;
            this.precio = prod.precio;
            this.dolar = prod.dolar;
            this.moneda = prod.moneda;
            this.porCalc = prod.porCalc;
            this.ivaPorc = prod.ivaPorc;
            this.deposito = prod.deposito;

            // Si es un prodPendiente y tiene el prducto adentro, entonces lo creo. Sino, lo guardo directamente
            this.producto = prod.producto ? 
                new Producto(prod.producto) :
                prod;

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
            this.ivaPorc = null;
            this.deposito = null;
            this.producto = new Producto();

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