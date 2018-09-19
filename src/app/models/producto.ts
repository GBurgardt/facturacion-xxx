import { IVA } from "./IVA";
import { Unidad } from "./unidad";
import { SubRubro } from "./subRubro";
import { ModeloCab } from "app/models/modeloCab";
import { Marca } from "./marca";

export class Producto {
    idProductos: number;
    codProducto: string;
    codigoBarra: string;
    descripcionCorta: string;
    descripcion: string;
    aptoCanje: boolean;
    // modeloImputacion: string;
    stock: boolean;
    trazable: boolean;
    traReceta: boolean;
    traInforma: boolean;
    gtin: string;
    puntoPedido: string;
    costoReposicion: string;
    precioVentaProv: string;
    observaciones: string;
    IVA: IVA;
    subRubro: SubRubro;
    unidadCompra: Unidad;
    unidadVenta: Unidad; 

    editar: boolean;
    modeloCab: ModeloCab;

    marca: Marca;

    constructor (producto?: {
        idProductos: number;
        codProducto: string;
        codigoBarra: string;
        descripcionCorta: string;
        descripcion: string;
        aptoCanje: boolean;
        // modeloImputacion: string;
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

        marca: any;
    }) {
        if (producto) {
            this.idProductos = producto.idProductos;
            this.codProducto = producto.codProducto;
            this.codigoBarra = producto.codigoBarra;
            this.descripcionCorta = producto.descripcionCorta;
            this.descripcion = producto.descripcion;
            this.aptoCanje = producto.aptoCanje;
            // this.modeloImputacion = producto.modeloImputacion;
            this.stock = producto.stock;
            this.trazable = producto.trazable;
            this.traReceta = producto.traReceta;
            this.traInforma = producto.traInforma;
            this.gtin = producto.gtin;
            this.puntoPedido = Number(producto.puntoPedido).toFixed(2);
            this.costoReposicion = Number(producto.costoReposicion).toFixed(2);
            this.precioVentaProv = Number(producto.precioVentaProv).toFixed(2);
            this.observaciones = producto.observaciones;
            this.IVA = new IVA(producto.IVA);
            this.subRubro = new SubRubro(producto.subRubro);
            this.unidadCompra = new Unidad(producto.unidadCompra);
            this.unidadVenta = new Unidad(producto.unidadVenta);

            this.editar = producto.editar;
            this.modeloCab = new ModeloCab(producto.modeloCab);

            this.marca = new Marca(producto.marca);
        } else {
            this.idProductos = null;       
            this.codProducto = null;       
            this.codigoBarra = null;       
            this.descripcionCorta = null;  
            this.descripcion = null;       
            this.aptoCanje = false;         
            // this.modeloImputacion = null;  
            this.stock = false;             
            this.trazable = false;          
            this.traReceta = false;         
            this.traInforma = false;        
            this.gtin = null;              
            
            this.puntoPedido = Number(0).toFixed(2);
            this.costoReposicion = Number(0).toFixed(2);
            this.precioVentaProv = Number(0).toFixed(2);

            this.observaciones = null;     
            this.IVA = new IVA();               
            this.subRubro = new SubRubro();          
            this.unidadCompra = new Unidad();      
            this.unidadVenta = new Unidad();      

            this.editar = null;
            this.modeloCab = new ModeloCab();

            this.marca = new Marca();
        }
    }

}