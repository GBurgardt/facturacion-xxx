import { NgModule } from '@angular/core';
import { routing } from './tablas.routing';

import { DataTableModule } from "angular2-datatable";
import { DataTables } from '../../reusable/tablas/dataTables';
import { DataFilterPipe } from '../../reusable/tablas/dataTables/data-filter.pipe';
import { DataTablesService } from '../../reusable/tablas/dataTables/dataTables.service';
import { Tablas } from 'app/pages/main/tablas';

import { Usuarios } from './usuarios';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../../theme/nga.module';
import { NuevoUsuario } from './usuarios/components/nuevoUsuario';
import { UsuariosService } from '../../../services/usuariosService';
import { AuthService } from '../../../services/authService';
import { LocalStorageService } from '../../../services/localStorageService';
import { EditarUsuario } from './usuarios/components/editarUsuario';
import { UtilsService } from '../../../services/utilsService';
import { TipoComprobantes } from './tipoComprobantes';
import { TipoComprobantesService } from '../../../services/tipoComprobantesService';
import { EditarTipoComprobante } from './tipoComprobantes/components/editarTipoComprobante';
import { NuevoTipoComprobante } from './tipoComprobantes/components/nuevoTipoComprobante';
import { RubrosService } from '../../../services/rubrosService';
import { Rubros } from './rubros';
import { NuevoRubro } from './rubros/components/nuevoRubro';
import { EditarRubro } from './rubros/components/editarRubro';
import { NuevoRecurso } from '../../reusable/formularios/nuevoRecurso';
import { SubRubrosService } from '../../../services/subRubrosService';
import { SubRubros } from './subRubros';
import { NuevoSubRubro } from './subRubros/components/nuevoSubRubro';
import { EditarSubRubro } from './subRubros/components/editarSubRubro';



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
        Usuarios,
        NuevoUsuario,
        EditarUsuario,
        TipoComprobantes,
        NuevoTipoComprobante,
        EditarTipoComprobante,
        Rubros,
        NuevoRubro,
        EditarRubro,
        NuevoRecurso,
        SubRubros,
        NuevoSubRubro,
        EditarSubRubro
    ],
    providers: [
        DataTablesService,
        UsuariosService,
        AuthService,
        LocalStorageService,
        UtilsService,
        TipoComprobantesService,
        RubrosService,
        SubRubrosService
    ]
})
export class TablasModule {
}
