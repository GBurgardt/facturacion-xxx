import { Routes, RouterModule }  from '@angular/router';

import { Comprobantes } from './comprobantes.component';
import { DataTables } from '../../reusable/tables/dataTables';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Comprobantes,
    children: [
      { path: 'tabla', component: DataTables }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
