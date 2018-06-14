import { IVA } from "./IVA";
import { Unidad } from "./unidad";
import { SubRubro } from "./subRubro";
import { ModeloCab } from "app/models/modeloCab";

export class Producto {
    idProductos: number;
    codProducto: string;
    codigoBarra: string;
    descripcionCorta: string;
    descripcion: string;
    aptoCanje: boolean;
    modeloImputacion: string;
    stock: boolean;
    trazable: boolean;
    traReceta: boolean;
    traInforma: boolean;
    gtin: string;
    puntoPedido: number;
    costoReposicion: number;
    precioVentaProv: number;
    observaciones: string;
    IVA: IVA;
    subRubro: SubRubro;
    unidadCompra: Unidad;
    unidadVenta: Unidad; 

    editar: boolean;
    modeloCab: ModeloCab;

    constructor (producto?: {
        idProductos: number;
        codProducto: string;
        codigoBarra: string;
        descripcionCorta: string;
        descripcion: string;
        aptoCanje: boolean;
        modeloImputacion: string;
        stock: boolean;
        trazable: boolean;
        traReceta: boolean;
        traInforma: boolean;
        gtin: string;
        puntoPedido: number;
        costoReposicion: number;
        precioVentaProv: number;
        observaciones: string;
        IVA: any;
        subRubro: any;
        unidadCompra: any;
        unidadVenta: any; 

        editar: boolean;
        modeloCab: any;
    }) {
        if (producto) {
            this.idProductos = producto.idProductos;
            this.codProducto = producto.codProducto;
            this.codigoBarra = producto.codigoBarra;
            this.descripcionCorta = producto.descripcionCorta;
            this.descripcion = producto.descripcion;
            this.aptoCanje = producto.aptoCanje;
            this.modeloImputacion = producto.modeloImputacion;
            this.stock = producto.stock;
            this.trazable = producto.trazable;
            this.traReceta = producto.traReceta;
            this.traInforma = producto.traInforma;
            this.gtin = producto.gtin;
            this.puntoPedido = producto.puntoPedido;
            this.costoReposicion = producto.costoReposicion;
            this.precioVentaProv = producto.precioVentaProv;
            this.observaciones = producto.observaciones;
            this.IVA = new IVA(producto.IVA);
            this.subRubro = new SubRubro(producto.subRubro);
            this.unidadCompra = new Unidad(producto.unidadCompra);
            this.unidadVenta = new Unidad(producto.unidadVenta);

            this.editar = producto.editar;
            this.modeloCab = new ModeloCab(producto.modeloCab);
        } else {
            this.idProductos = null;       
            this.codProducto = null;       
            this.codigoBarra = null;       
            this.descripcionCorta = null;  
            this.descripcion = null;       
            this.aptoCanje = false;         
            this.modeloImputacion = null;  
            this.stock = false;             
            this.trazable = false;          
            this.traReceta = false;         
            this.traInforma = false;        
            this.gtin = null;              
            this.puntoPedido = null;       
            this.precioVentaProv = null;   
            this.observaciones = null;     
            this.IVA = new IVA();               
            this.subRubro = new SubRubro();          
            this.unidadCompra = new Unidad();      
            this.unidadVenta = new Unidad();      

            this.editar = null;
            this.modeloCab = new ModeloCab();
        }
    }

}