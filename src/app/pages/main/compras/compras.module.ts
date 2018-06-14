import { NgModule } from "@angular/core";
import { routing } from './compras.routing';
import { Compras } from ".";
import { ComprobanteCompra } from "./comprobanteCompra";
import { IngresoForm } from "app/pages/reusable/formularios/ingresoForm";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgaModule } from "app/theme/nga.module";
//import { CustomCard } from "../../reusable/cards/customCard";
import { NgbDatepickerModule, NgbTabsetModule } from "@ng-bootstrap/ng-bootstrap";
import { SharedModule } from "../SharedModule";
import { RecursoService } from "app/services/recursoService";
import { AuthService } from "../../../services/authService";
import { UtilsService } from "../../../services/utilsService";
import { IngresoFormService } from "app/pages/reusable/formularios/ingresoForm/ingresoFormService";
import { TablaIngreso } from "app/pages/reusable/formularios/ingresoForm/components";

@NgModule({
    imports: [
        routing,
        //CommonModule,
        //NgaModule,
        //FormsModule,
        //NgbDatepickerModule,
        SharedModule,
        NgbTabsetModule
    ],
    declarations: [
        Compras,
        ComprobanteCompra,
        IngresoForm,
        TablaIngreso
        //CustomCard
    ],
    providers: [
        RecursoService,
        AuthService,
        UtilsService,
        IngresoFormService
    ],
    exports: [
        TablaIngreso
    ]
})
export class ComprasModule {
}
