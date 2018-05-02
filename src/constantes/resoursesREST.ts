import { Usuario } from "app/models/usuario";
import { TipoComprobante } from "app/models/tipoComprobante";
import { Rubro } from "app/models/rubro";
import { Perfil } from "app/models/perfil";
import { Sucursal } from "app/models/sucursal";
import { SubRubro } from "app/models/subRubro";
import { FormaPago } from "app/models/formaPago";
import { TipoFormaPago } from "app/models/tipoFormaPago";
import { Producto } from "app/models/producto";

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
};
