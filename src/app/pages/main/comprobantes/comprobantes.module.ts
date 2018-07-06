import { NgModule } from "@angular/core";
import { routing } from './comprobantes.routing';
import { Comprobantes } from ".";
import { NgbTabsetModule } from "@ng-bootstrap/ng-bootstrap";
import { SharedModule } from "../SharedModule";
import { RecursoService } from "app/services/recursoService";
import { AuthService } from "../../../services/authService";
import { UtilsService } from "../../../services/utilsService";
import { ConsultaComprobante } from "app/pages/main/comprobantes/consultaComprobante/consultaComprobante.component";
import { ComprobanteService } from "../../../services/comprobanteService";

@NgModule({
    imports: [
        routing,
        SharedModule,
        NgbTabsetModule
    ],
    declarations: [
        Comprobantes,
        ConsultaComprobante
    ],
    providers: [
        RecursoService,
        AuthService,
        UtilsService,
        ComprobanteService
    ],
    exports: []
})
export class ComprobantesModule {
}
