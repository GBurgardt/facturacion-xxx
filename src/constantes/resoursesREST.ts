import { Usuario } from "app/models/usuario";
import { TipoComprobante } from "app/models/tipoComprobante";
import { Rubro } from "app/models/rubro";
import { Perfil } from "app/models/perfil";
import { Sucursal } from "app/models/sucursal";
import { SubRubro } from "app/models/subRubro";
import { FormaPago } from "app/models/formaPago";
import { TipoFormaPago } from "app/models/tipoFormaPago";
import { Producto } from "app/models/producto";
import { IVA } from "app/models/IVA";
import { Unidad } from "app/models/unidad";
import { Deposito } from "app/models/deposito";
import { ListaPrecio } from "app/models/listaPrecio";
import { Moneda } from "app/models/moneda";
import { SisComprobante } from "app/models/sisComprobante";
import { Padron } from "app/models/padron";
import { SisTipoOperacion } from "app/models/sisTipoOperacion";
import { ProductoPendiente } from "app/models/productoPendiente";
import { Parametro } from "app/models/parametro";
import { Cotizacion } from "app/models/cotizacion";
import { ProductoBuscaModelo } from "app/models/productoBuscaModelo";
import { SisModulo } from "../app/models/sisModulo";
import { SisEstado } from "app/models/sisEstado";
import { CondIva } from "app/models/condIva";
import { CteFechas } from "app/models/cteFechas";
import { SisCanje } from "app/models/sisCanje";
import { Lote } from "app/models/lote";
import { ModeloCab } from "app/models/modeloCab";
import { Stock } from "app/pages/main/stock";
import { PlanCuenta } from "app/models/planCuenta";
import { SisTipoModelo } from "app/models/sisTipoModelo";
import { ModeloCabSinDetalles } from "app/models/modeloCabSinDetalles";

/**
 * Todos los recursos disposnibles en el serivcio REST
 */
export const resourcesREST = {
    usuarios: {
        nombre: 'usuarios',
        Clase: Usuario
    },
    cteTipo: {
        nombre: 'cteTipo',
        Clase: TipoComprobante
    },
    rubros: {
        nombre: 'rubros',
        Clase: Rubro
    },
    perfiles: {
        nombre: 'perfiles',
        Clase: Perfil
    },
    sucursales: {
        nombre: 'sucursales',
        Clase: Sucursal
    },
    subRubros: {
        nombre: 'subRubros',
        Clase: SubRubro
    },
    formaPago: {
        nombre: 'formaPago',
        Clase: FormaPago
    },
    sisFormaPago: {
        nombre: 'sisFormaPago',
        Clase: TipoFormaPago
    },
    productos: {
        nombre: 'productos',
        Clase: Producto
    },
    sisIVA: {
        nombre: 'sisIVA',
        Clase: IVA
    },
    sisUnidad: {
        nombre: 'sisUnidad',
        Clase: Unidad
    },
    depositos: {
        nombre: 'deposito',
        Clase: Deposito
    },
    listaPrecios: {
        nombre: 'listaPrecios',
        Clase: ListaPrecio
    },
    sisMonedas: {
        nombre: 'sisMonedas',
        Clase: Moneda
    },
    filtroListaPrecios: {
        nombre: 'filtroListaPrecios',
        Clase: Producto
    },
    sisComprobantes: {
        nombre: 'sisComprobantes',
        Clase: SisComprobante
    },
    proveedores: {
        nombre: 'proveedores',
        Clase: Padron
    },
    sisTipoOperacion: {
        nombre: 'sisTipoOperacion',
        Clase: SisTipoOperacion
    },
    buscaPendientes: {
        nombre: 'buscaPendientes',
        Clase: ProductoPendiente
    },
    buscaCotizacion: {
        nombre: 'buscaCotizacion',
        Clase: Cotizacion
    },
    buscaModelo: {
        nombre: 'buscaModelo',
        Clase: ProductoBuscaModelo
    },
    sisModulos: {
        nombre: 'sisModulos',
        Clase: SisModulo
    },
    sisEstados: {
        nombre: 'sisEstados',
        Clase: SisEstado
    },
    buscaComprobantes: {
        nombre: 'buscaComprobantes',
        Clase: null
    },
    // buscaCteTipoNro: {
    //     nombre: 'buscaCteTipoNro',
    //     Clase: TipoComprobante
    // },
    buscaFormaPago: {
        nombre: 'buscaFormaPago',
        Clase: null
    },
    sisSitIva: {
        nombre: 'sisSitIva',
        Clase: CondIva
    },
    buscaCteFecha: {
        nombre: 'buscaCteFecha',
        Clase: CteFechas
    },
    calculoSubtotales: {
        nombre: 'calculoSubtotales',
        Clase: null
    },
    sisCanjes: {
        nombre: 'sisCanjes',
        Clase: SisCanje
    },
    buscaLote: {
        nombre: 'buscaLote',
        Clase: Lote
    },
    buscaLotes: {
        nombre: 'buscaLotes',
        Clase: Lote
    },
    modeloCab: {
        nombre: 'modeloCab',
        Clase: ModeloCabSinDetalles
    },
    buscaStock: {
        nombre: 'buscaStock',
        Clase: Stock
    },
    modeloImputacion: {
        nombre: 'modeloImputacion',
        Clase: ModeloCab
    },
    contPlanCuenta: {
        nombre: 'contPlanCuenta',
        Clase: PlanCuenta
    },
    sisTipoModelo: {
        nombre: 'sisTipoModelo',
        Clase: SisTipoModelo
    }

};
