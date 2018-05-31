import { NgModule } from "@angular/core";
import { routing } from './stock.routing';
import { Stock } from ".";
//import { ComprobanteCompra } from "./comprobanteCompra";
import { IngresoForm } from "app/pages/reusable/formularios/ingresoForm";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgaModule } from "app/theme/nga.module";

import { NgbDatepickerModule } from "@ng-bootstrap/ng-bootstrap";
import { SharedModule } from "../SharedModule";
import { Productos } from "./productos";
import { NuevoProducto } from "app/pages/main/stock/productos/components/nuevoProducto";
import { EditarProducto } from "app/pages/main/stock/productos/components/editarProducto";
import { DataTables } from "app/pages/reusable/tablas/dataTables";
import { DataTableModule } from "angular2-datatable";
import { DataFilterPipe } from "app/pages/reusable/tablas/dataTables/data-filter.pipe";
import { RecursoService } from "../../../services/recursoService";
import { AuthService } from "../../../services/authService";
import { UtilsService } from "../../../services/utilsService";

@NgModule({
    imports: [
        routing,
        // CommonModule,
        // NgaModule,
        // FormsModule,
        // NgbDatepickerModule,
        // DataTableModule,
        SharedModule
    ],
    declarations: [
        Stock,
        Productos,
        //IngresoForm,
        NuevoProducto,
        EditarProducto,
        // DataTables,
        // DataFilterPipe
    ],
    providers: [
        RecursoService,
        AuthService,
        UtilsService
    ]
})
export class StockModule {
}
