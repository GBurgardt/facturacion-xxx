import { NgModule } from "@angular/core";
import { routing } from './compras.routing';
import { Compras } from ".";
import { NgbTabsetModule, NgbProgressbarModule } from "@ng-bootstrap/ng-bootstrap";
import { SharedModule } from "../SharedModule";
import { RecursoService } from "app/services/recursoService";
import { AuthService } from "../../../services/authService";
import { UtilsService } from "../../../services/utilsService";
import { TablaIngreso } from "app/pages/main/compras/comprobanteCompra/components/tablaIngreso";
import { ComprobanteCompra } from "app/pages/main/compras/comprobanteCompra";
import { ComprobanteCompraService } from "app/pages/main/compras/comprobanteCompra/comprobanteCompraService";
import { TablaFormaPagoComp } from "app/pages/main/compras/comprobanteCompra/components/tablaFormaPagoComp";
import { EmisionRemitosService } from "../ventas/emisionRemitos/emisionRemitosService";
import { PendingChangesGuard } from "app/guards/PendingChangesGuard";

@NgModule({
    imports: [
        routing,
        NgbTabsetModule,
        SharedModule,
        NgbProgressbarModule
    ],
    declarations: [
        Compras,
        ComprobanteCompra,
        TablaIngreso,
        TablaFormaPagoComp
    ],
    providers: [
        RecursoService,
        AuthService,
        UtilsService,
        ComprobanteCompraService,
        EmisionRemitosService,
        PendingChangesGuard
    ],
    exports: [
        TablaIngreso,
        TablaFormaPagoComp
    ]
})
export class ComprasModule {
}
