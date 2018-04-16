import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from '../../../theme/nga.module';

import { routing } from './comprobantes.routing';
import { Comprobantes } from './comprobantes.component';
import { AppTranslationModule } from '../../../app.translation.module';

import { DataTables } from '../../reusable/tables/dataTables';
import { DataFilterPipe } from '../../reusable/tables/dataTables/data-filter.pipe';
import { DataTableModule } from "angular2-datatable";
import { DataTablesService } from '../../reusable/tables/dataTables/dataTables.service';

@NgModule({
    imports: [
        CommonModule,
        AppTranslationModule,
        FormsModule,
        NgaModule,
        routing,
        DataTableModule
    ],
    declarations: [
        Comprobantes,
        DataTables,
        DataFilterPipe
    ],
    entryComponents: [
        DataTables
    ],
    providers: [
        DataTablesService
    ]
})
export class ComprobantesModule { }
