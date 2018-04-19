import { NgModule } from '@angular/core';
import { routing } from './tablas.routing';

import { DataTableModule } from "angular2-datatable";
import { DataTables } from '../../reusable/tables/dataTables';
import { DataFilterPipe } from '../../reusable/tables/dataTables/data-filter.pipe';
import { DataTablesService } from '../../reusable/tables/dataTables/dataTables.service';
import { Tablas } from 'app/pages/main/tablas';
import { Comprobantes } from './comprobantes';
import { Usuarios } from './usuarios';

@NgModule({
  imports: [
    routing,
    
    DataTableModule,
    
  ],
  declarations: [
    Tablas,
    
    DataTables,
    DataFilterPipe,
    Comprobantes,
    Usuarios
  ],
  providers: [
    
    DataTablesService
  ]
})
export class TablesModule {
}
