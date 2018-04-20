import { NgModule } from '@angular/core';
import { routing } from './tablas.routing';

import { DataTableModule } from "angular2-datatable";
import { DataTables } from '../../reusable/tables/dataTables';
import { DataFilterPipe } from '../../reusable/tables/dataTables/data-filter.pipe';
import { DataTablesService } from '../../reusable/tables/dataTables/dataTables.service';
import { Tablas } from 'app/pages/main/tablas';
import { Comprobantes } from './comprobantes';
import { Usuarios } from './usuarios';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from '../../../theme/nga.module';
import { NuevoUsuario } from './usuarios/components/nuevoUsuario';
import { UsuariosService } from '../../../services/usuariosService';
import { AuthService } from '../../../services/authService';
import { LocalStorageService } from '../../../services/localStorageService';



@NgModule({
    imports: [
        routing,
        DataTableModule,
        CommonModule,
        FormsModule,
        NgaModule
    ],
    declarations: [
        Tablas,
        DataTables,
        DataFilterPipe,
        Comprobantes,
        Usuarios,
        NuevoUsuario
    ],
    providers: [
        DataTablesService,
        UsuariosService,
        AuthService,
        LocalStorageService
    ]
})
export class TablasModule {
}
