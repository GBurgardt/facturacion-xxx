import { Routes, RouterModule } from '@angular/router';

import { Tablas } from './tablas.component';
import { Usuarios } from './usuarios';
import { NuevoUsuario } from './usuarios/components/nuevoUsuario';
import { EditarUsuario } from 'app/pages/main/tablas/usuarios/components/editarUsuario';
import { TipoComprobantes } from './tipoComprobantes';
import { EditarTipoComprobante } from './tipoComprobantes/components/editarTipoComprobante';
import { NuevoTipoComprobante } from './tipoComprobantes/components/nuevoTipoComprobante';
import { Rubros } from './rubros';
import { NuevoRubro } from './rubros/components/nuevoRubro';
import { EditarRubro } from './rubros/components/editarRubro';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
    {
        path: '',
        component: Tablas,
        children: [
            { path: 'usuarios', component: Usuarios },
            { path: 'usuarios/nuevo', component: NuevoUsuario },
            { path: 'usuarios/editar/:idUsuario', component: EditarUsuario },
            { path: 'tipos-comprobantes', component: TipoComprobantes },
            { path: 'tipos-comprobantes/nuevo', component: NuevoTipoComprobante },
            { path: 'tipos-comprobantes/editar/:idTipoComprobante', component: EditarTipoComprobante },
            { path: 'rubros', component: Rubros },
            { path: 'rubros/nuevo', component: NuevoRubro },
            { path: 'rubros/editar/:idRubro', component: EditarRubro },
        ]
    }
];

export const routing = RouterModule.forChild(routes);
