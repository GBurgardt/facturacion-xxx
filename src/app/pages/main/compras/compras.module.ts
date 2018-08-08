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

@NgModule({
    imports: [
        routing,
        NgbTabsetModule,
        SharedModule
    ],
    declarations: [
        Compras,
        ComprobanteCompra,
        TablaIngreso
    ],
    providers: [
        RecursoService,
        AuthService,
        UtilsService,
        ComprobanteCompraService
    ],
    exports: [
        TablaIngreso
    ]
})
export class ComprasModule {
}
