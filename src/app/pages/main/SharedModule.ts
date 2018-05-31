import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { CustomCard } from 'app/pages/reusable/cards/customCard';
import { IngresoForm } from '../reusable/formularios/ingresoForm';
import { DataFilterPipe } from 'app/pages/reusable/tablas/dataTables/data-filter.pipe';
import { DataTables } from 'app/pages/reusable/tablas/dataTables';
import { DataTableModule } from 'angular2-datatable';
import { NgaModule } from 'app/theme/nga.module';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        DataTableModule,
        NgaModule,
        NgbDatepickerModule

    ],
    declarations: [
        CustomCard,
        DataTables,
        DataFilterPipe
    ],
    providers: [
    ],
    exports: [
        CustomCard,
        DataTables,
        DataFilterPipe,
        CommonModule,
        FormsModule,
        DataTableModule,
        NgaModule,
        NgbDatepickerModule
    ]
})
export class SharedModule {}