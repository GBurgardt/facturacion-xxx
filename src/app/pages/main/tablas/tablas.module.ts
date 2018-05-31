import { NgModule } from '@angular/core';
import { routing } from './tablas.routing';
import { Tablas } from 'app/pages/main/tablas';

import { DataTableModule } from "angular2-datatable";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../../theme/nga.module';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

import { DataTables } from '../../reusable/tablas/dataTables';
import { DataFilterPipe } from '../../reusable/tablas/dataTables/data-filter.pipe';
import { DataTablesService } from '../../reusable/tablas/dataTables/dataTables.service';
import { CustomCard } from '../../reusable/cards/customCard';
import { IngresoForm } from '../../reusable/formularios/ingresoForm';

import { Usuarios } from './usuarios';
import { NuevoUsuario } from './usuarios/components/nuevoUsuario';
import { AuthService } from '../../../services/authService';
import { LocalStorageService } from '../../../services/localStorageService';
import { EditarUsuario } from './usuarios/components/editarUsuario';
import { UtilsService } from '../../../services/utilsService';
import { TipoComprobantes } from './tipoComprobantes';
import { EditarTipoComprobante } from './tipoComprobantes/components/editarTipoComprobante';
import { NuevoTipoComprobante } from './tipoComprobantes/components/nuevoTipoComprobante';
import { Rubros } from './rubros';
import { NuevoRubro } from './rubros/components/nuevoRubro';
import { EditarRubro } from './rubros/components/editarRubro';
import { NuevoRecurso } from '../../reusable/formularios/nuevoRecurso';
import { SubRubros } from './subRubros';
import { NuevoSubRubro } from './subRubros/components/nuevoSubRubro';
import { EditarSubRubro } from './subRubros/components/editarSubRubro';
import { FormasPago } from 'app/pages/main/tablas/formasPago';
import { NuevaFormaPago } from './formasPago/components/nuevaFormaPago';

import { RecursoService } from '../../../services/recursoService';
import { EditarFormaPago } from './formasPago/components/editarFormaPago';

import { Depositos } from './depositos';
import { EditarDeposito } from './depositos/components/editarDeposito';
import { NuevoDeposito } from './depositos/components/nuevoDeposito/nuevoDeposito.component';
import { ListaPrecios } from './listaPrecios';
import { NuevoListaPrecio } from './listaPrecios/components/nuevoListaPrecio';
import { EditarListaPrecio } from './listaPrecios/components/editarListaPrecio';
import { SharedModule } from '../SharedModule';

@NgModule({
    imports: [
        routing,
        // DataTableModule,
        // CommonModule,
        // FormsModule,
        // NgaModule,
        // NgbDatepickerModule,
        SharedModule
    ],
    declarations: [
        Tablas,
        // DataTables,
        // DataFilterPipe,
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
        EditarSubRubro,
        FormasPago,
        NuevaFormaPago,
        EditarFormaPago,
       
        Depositos,
        NuevoDeposito,
        EditarDeposito,
        ListaPrecios,
        NuevoListaPrecio,
        EditarListaPrecio,
        //CustomCard,
        //IngresoForm
    ],
    providers: [
        DataTablesService,
        AuthService,
        LocalStorageService,
        UtilsService,
        RecursoService
    ]
})
export class TablasModule {
}
