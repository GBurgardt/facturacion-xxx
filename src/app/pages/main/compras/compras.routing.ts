import { Routes, RouterModule } from '@angular/router';

import { ComprasComponent } from './compras.component';
//import { Tables } from './components/tables/smartTables/smartTables.component';
import { CargaFacturaComponent } from './components/carga/carga.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
    {
        path: '',
        component: ComprasComponent,
        children: [
            { path: 'carga', component: CargaFacturaComponent }
        ]
    }
];

export const routing = RouterModule.forChild(routes);
