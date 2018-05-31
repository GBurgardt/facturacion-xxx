import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { routing } from './pages.routing';
import { NgaModule } from '../theme/nga.module';
import { AppTranslationModule } from '../app.translation.module';

import { Pages } from './pages.component';
import { DefaultModal } from './reusable/modals/default-modal/default-modal.component';
import { LocalStorageService } from 'app/services/localStorageService';
import { ConfirmationModal } from './reusable/modals/confirmation-modal/confirmation-modal.component';
import { CustomCard } from 'app/pages/reusable/cards/customCard';

// import { DataTableModule } from "angular2-datatable";
// import { DataTables } from './reusable/tablas/dataTables';
// import { DataFilterPipe } from './reusable/tablas/dataTables/data-filter.pipe';
// import { DataTablesService } from './reusable/tablas/dataTables/dataTables.service';

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
        ConfirmationModal,
        //CustomCard
        // DataTables,
        // DataFilterPipe,
        
    ],
    entryComponents: [
        DefaultModal,
        ConfirmationModal
        // DataTables
    ],
    providers: [
        LocalStorageService,
        // DataTablesService
    ],
    exports: [
        //CustomCard
    ]
})
export class PagesModule { }
