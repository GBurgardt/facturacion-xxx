import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { routing } from './pages.routing';
import { NgaModule } from '../theme/nga.module';
import { AppTranslationModule } from '../app.translation.module';

import { Pages } from './pages.component';
import { DefaultModal } from './reusable/modals/default-modal/default-modal.component';
import { LocalStorageService } from 'app/services/localStorageService';
import { ConfirmationModal } from './reusable/modals/confirmation-modal/confirmation-modal.component';

// import { DataTableModule } from "angular2-datatable";
// import { DataTables } from './reusable/tables/dataTables';
// import { DataFilterPipe } from './reusable/tables/dataTables/data-filter.pipe';
// import { DataTablesService } from './reusable/tables/dataTables/dataTables.service';

@NgModule({
    imports: [
        CommonModule, 
        AppTranslationModule, 
        NgaModule, 
        routing,
        // DataTableModule
    ],
    declarations: [
        Pages,
        DefaultModal,
        ConfirmationModal
        // DataTables,
        // DataFilterPipe
    ],
    entryComponents: [
        DefaultModal,
        ConfirmationModal
        // DataTables
    ],
    providers: [
        LocalStorageService,
        // DataTablesService
    ]
})
export class PagesModule { }
