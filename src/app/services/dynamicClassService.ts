import { Usuario } from "app/models/usuario";
import { TipoComprobante } from "app/models/tipoComprobante";
import { Rubro } from "app/models/rubro";
import { Empresa } from "app/models/empresa";
import { FormaPago } from "app/models/formaPago";
import { IVA } from "app/models/IVA";
import { MenuSucursal } from "app/models/menuSucursal";
import { Perfil } from "app/models/perfil";
import { Producto } from "app/models/producto";
import { SubRubro } from "app/models/subRubro";
import { Sucursal } from "app/models/sucursal";
import { TipoFormaPago } from "app/models/tipoFormaPago";
import { Unidad } from "app/models/unidad";
import { Deposito } from "app/models/deposito";
import { ListaPrecio } from "app/models/listaPrecio";
import { Moneda } from "app/models/moneda";

const classes = {
    Usuario,
    TipoComprobante,
    Rubro,
    Empresa,
    FormaPago,
    IVA,
    MenuSucursal,
    Perfil,
    Producto,
    SubRubro,
    Sucursal,
    TipoFormaPago,
    Unidad,
    Deposito,
    ListaPrecio,
    Moneda
};

export default function dynamicClass (name) {
    return classes[name];
}
