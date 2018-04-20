import { Routes, RouterModule } from '@angular/router';

import { Tablas } from './tablas.component';
import { Comprobantes } from './comprobantes';
import { Usuarios } from './usuarios';
import { NuevoUsuario } from './usuarios/components/nuevoUsuario';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
    {
        path: '',
        component: Tablas,
        children: [
            { path: 'comprobantes', component: Comprobantes },
            { path: 'usuarios', component: Usuarios },
            { path: 'usuarios/nuevo-usuario', component: NuevoUsuario },
        ]
    }
];

export const routing = RouterModule.forChild(routes);
