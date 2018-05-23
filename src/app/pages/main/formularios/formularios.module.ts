import { NgModule } from "@angular/core";
import { routing } from './formularios.routing';
import { Formularios } from ".";
import { ComprobanteCompra } from "./comprobanteCompra";
import { IngresoForm } from "app/pages/reusable/formularios/ingresoForm";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgaModule } from "app/theme/nga.module";
import { CustomCard } from "../../reusable/cards/customCard";
import { NgbDatepickerModule } from "@ng-bootstrap/ng-bootstrap";

@NgModule({
    imports: [
        routing,
        CommonModule,
        NgaModule,
        FormsModule,
        NgbDatepickerModule
    ],
    declarations: [
        Formularios,
        ComprobanteCompra,
        IngresoForm,
        CustomCard
    ],
    providers: []
})
export class FormulariosModule {
}
