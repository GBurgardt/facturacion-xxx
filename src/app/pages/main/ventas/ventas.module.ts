import { NgModule } from "@angular/core";
import { routing } from './ventas.routing';
import { Ventas } from ".";
import { NgbTabsetModule } from "@ng-bootstrap/ng-bootstrap";
import { SharedModule } from "../SharedModule";
import { RecursoService } from "app/services/recursoService";
import { AuthService } from "../../../services/authService";
import { UtilsService } from "../../../services/utilsService";


import { EmisionRemitos } from "./emisionRemitos";
import { EmisionRemitosService } from "./emisionRemitos/emisionRemitosService";
import { TablaEmisionRem } from "app/pages/main/ventas/emisionRemitos/components/tablaEmisionRem/tablaEmisionRem.component";
import { TablaFormaPago } from "app/pages/main/ventas/emisionRemitos/components/tablaFormaPago";

@NgModule({
    imports: [
        routing,
        NgbTabsetModule,
        SharedModule
    ],
    declarations: [
        Ventas,
        TablaEmisionRem,
        TablaFormaPago,
        EmisionRemitos
    ],
    providers: [
        RecursoService,
        AuthService,
        UtilsService,
        EmisionRemitosService
    ],
    exports: [
        TablaEmisionRem,
        TablaFormaPago
    ]
})
export class VentasModule {
}
