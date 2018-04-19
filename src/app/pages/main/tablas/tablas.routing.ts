import { Routes, RouterModule } from '@angular/router';

import { Tablas } from './Tablas.component';
import { Comprobantes } from './comprobantes';
import { Usuarios } from './usuarios';
// import { BasicTables } from './components/basicTables/basicTables.component';
// import { SmartTables } from './components/smartTables/smartTables.component';


// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Tablas,
    children: [
      { path: 'comprobantes', component: Comprobantes },
      { path: 'usuarios', component: Usuarios },
    ]
  }
];

export const routing = RouterModule.forChild(routes);
