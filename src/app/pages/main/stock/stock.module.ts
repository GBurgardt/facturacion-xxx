import { NgModule } from "@angular/core";
import { routing } from './stock.routing';
import { Stock } from ".";

import { SharedModule } from "../SharedModule";
import { Productos } from "./productos";
import { NuevoProducto } from "app/pages/main/stock/productos/components/nuevoProducto";
import { EditarProducto } from "app/pages/main/stock/productos/components/editarProducto";
import { RecursoService } from "../../../services/recursoService";
import { AuthService } from "../../../services/authService";
import { UtilsService } from "../../../services/utilsService";
import { TablaProductos } from "./productos/components/tablaProductos";
import { ConsultaPorProducto } from "./consultaPorProducto";
import { ConsultaPorProductoService } from "./consultaPorProducto/consultaPorProductoService";
import { ConsultaGeneralService } from "./consultaGeneral/consultaGeneralService";
import { ConsultaGeneral } from "./consultaGeneral";

@NgModule({
    imports: [
        routing,
        SharedModule
    ],
    declarations: [
        Stock,
        Productos,
        NuevoProducto,
        EditarProducto,
        TablaProductos,
        ConsultaPorProducto,
        ConsultaGeneral
    ],
    providers: [
        RecursoService,
        AuthService,
        UtilsService,
        ConsultaPorProductoService,
        ConsultaGeneralService
    ],
    exports: [
        TablaProductos
    ]
})
export class StockModule {
}
