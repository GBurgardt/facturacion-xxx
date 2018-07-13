import { NgModule } from "@angular/core";
import { routing } from './compras.routing';
import { Compras } from ".";
import { NgbTabsetModule } from "@ng-bootstrap/ng-bootstrap";
import { SharedModule } from "../SharedModule";
import { RecursoService } from "app/services/recursoService";
import { AuthService } from "../../../services/authService";
import { UtilsService } from "../../../services/utilsService";
import { TablaIngreso } from "app/pages/main/compras/comprobanteCompra/components";
import { ComprobanteCompra } from "app/pages/main/compras/comprobanteCompra";
import { ComprobanteCompraService } from "app/pages/main/compras/comprobanteCompra/comprobanteCompraService";

import { EmisionRemitos } from "./emisionRemitos";
import { EmisionRemitosService } from "./emisionRemitos/emisionRemitosService";
import { TablaEmisionRem } from "app/pages/main/compras/emisionRemitos/components/tablaEmisionRem/tablaEmisionRem.component";
import { TablaFormaPago } from "app/pages/main/compras/emisionRemitos/components/tablaFormaPago";
import { NgaModule } from "app/theme/nga.module";

@NgModule({
    imports: [
        routing,
        NgbTabsetModule,
        SharedModule
    ],
    declarations: [
        Compras,
        ComprobanteCompra,
        TablaIngreso,
        TablaEmisionRem,
        TablaFormaPago,
        EmisionRemitos
    ],
    providers: [
        RecursoService,
        AuthService,
        UtilsService,
        ComprobanteCompraService,
        EmisionRemitosService
    ],
    exports: [
        TablaIngreso,
        TablaEmisionRem,
        TablaFormaPago
    ]
})
export class ComprasModule {
}
