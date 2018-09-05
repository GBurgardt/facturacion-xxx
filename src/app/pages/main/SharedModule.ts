import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { CustomCard } from 'app/pages/reusable/cards/customCard';

import { DataFilterPipe } from 'app/pages/reusable/tablas/dataTables/data-filter.pipe';
import { DataTables } from 'app/pages/reusable/tablas/dataTables';
import { DataTableModule } from 'angular2-datatable';
import { NgaModule } from 'app/theme/nga.module';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { PopupLista } from 'app/pages/reusable/otros/popup-lista/popup-lista.component';
import { ListFinder } from '../reusable/otros/listFinder/listFinder';
import { ListPopup } from 'app/pages/reusable/otros/listFinder/components/listPopup/listPopup';



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
        DataFilterPipe,
        PopupLista,
        ListFinder,
        ListPopup
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
        NgbDatepickerModule,
        PopupLista,
        ListFinder,
        ListPopup
    ]
})
export class SharedModule {}
