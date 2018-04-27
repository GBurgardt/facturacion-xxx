import { Usuario } from "app/models/usuario";
import { TipoComprobante } from "app/models/tipoComprobante";

const classes = { Usuario, TipoComprobante };

export default function dynamicClass (name) {
    return classes[name];
}