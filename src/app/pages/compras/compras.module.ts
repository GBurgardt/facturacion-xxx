import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule  } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
/* COMPRAS ROTING Y COMPONENTES */
import { routing }    from './compras.routing';
import { ComprasComponent } from './compras.component';
import { CargaFacturaComponent } from './components/carga/carga.component';
/* dQ() Tablas* */
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { DataTableModule } from "angular2-datatable";
import { DataFilterPipe } from './components/tables/components/dataTables/data-filter.pipe';
/* Fin tablas */


/*Declaraciones de objetos*/

import { Inputs } from './components/inputs';
import { Layouts } from './components/layouts';
import { StandardInputs } from './components/inputs/components/standardInputs';
import { ValidationInputs } from './components/inputs/components/validationInputs';
import { GroupInputs } from './components/inputs/components/groupInputs';
import { CheckboxInputs } from './components/inputs/components/checkboxInputs';
import { Rating } from './components/inputs/components/ratinginputs';
import { SelectInputs } from './components/inputs/components/selectInputs';
/* dQ() Tablas*/
import { Tables } from './components/tables/tables.component';
import { SmartTables } from './components/tables/components/smartTables/smartTables.component';
import { DataTables } from './components/tables/components/dataTables/dataTables.component';
import { SmartTablesService } from './components/tables/components/smartTables/smartTables.service';
/*Fin tablas*/

 
/*Formularios*/ 
//import { InlineForm } from './components/carga/components/inlineForm'; 
import { InlineForm } from './components/carga/components/formCargaFactura'; 
import { BlockForm } from './components/carga/components/blockForm';
import { HorizontalForm } from './components/carga/components/horizontalForm';
import { BasicForm } from './components/carga/components/basicForm';
import { WithoutLabelsForm } from './components/carga/components/withoutLabelsForm';

/*FOrmularios para INgreso de Compras */




@NgModule({ 
  imports: [
    CommonModule,
    FormsModule,
    AppTranslationModule,
    NgaModule,
    NgbRatingModule,
    routing,
    Ng2SmartTableModule,
    DataTableModule,
  ],
  declarations: [
    Layouts,
    Inputs, 
    ComprasComponent,
    CargaFacturaComponent,
    StandardInputs,
    ValidationInputs,
    GroupInputs,
    DataFilterPipe,  
    CheckboxInputs,
    SmartTables,
    DataTables,
    Rating,
    SelectInputs,
    InlineForm,
    BlockForm,
    HorizontalForm,
    BasicForm,
    WithoutLabelsForm
  ]
})

export class ComprasModule {
    
}
