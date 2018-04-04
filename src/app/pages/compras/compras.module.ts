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

/*Fin tablas*/

 
/*Formularios*/ 
import { InlineForm } from './components/carga/components/inlineForm'; 



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
    
    ComprasComponent,
    CargaFacturaComponent,
    
    InlineForm
  ]
})

export class ComprasModule {
    
}
