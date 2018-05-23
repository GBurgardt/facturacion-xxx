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
    }
};
