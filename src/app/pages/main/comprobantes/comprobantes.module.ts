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
import { ConsultaImputaciones } from "./consultaImputaciones";
import { ImputacionesService } from "app/services/imputacionesService";
import { ConsultaLibrosIva } from "./consultaLibrosIva";

@NgModule({
    imports: [
        routing,
        SharedModule,
        NgbTabsetModule
    ],
    declarations: [
        Comprobantes,
        ConsultaComprobante,
        ConsultaImputaciones,
        ConsultaLibrosIva
    ],
    providers: [
        RecursoService,
        AuthService,
        UtilsService,
        ComprobanteService,
        ImputacionesService
    ],
    exports: []
})
export class ComprobantesModule {
}
