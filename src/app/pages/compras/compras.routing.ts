import { Routes, RouterModule }  from '@angular/router';

import { ComprasComponent } from './compras.component';
import { Inputs } from './components/inputs/inputs.component';
import { Layouts } from './components/layouts/layouts.component';
//import { Tables } from './components/tables/smartTables/smartTables.component';
import { CargaFacturaComponent } from './components/carga/carga.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: ComprasComponent,
    children: [
      { path: 'inputs', component: Inputs },
      { path: 'layouts', component: Layouts },
    // { path: 'tables', component: Tables },
      { path: 'cargar-factura', component: CargaFacturaComponent }    
    ]
  }
];

export const routing = RouterModule.forChild(routes);
