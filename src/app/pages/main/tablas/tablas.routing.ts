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
import { SubRubros } from './subRubros';
import { NuevoSubRubro } from './subRubros/components/nuevoSubRubro';
import { EditarSubRubro } from './subRubros/components/editarSubRubro';
import { FormasPago } from './formasPago';
import { NuevaFormaPago } from 'app/pages/main/tablas/formasPago/components/nuevaFormaPago';
import { Productos } from './productos';

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
            { path: 'sub-rubros', component: SubRubros },
            { path: 'sub-rubros/nuevo', component: NuevoSubRubro },
            { path: 'sub-rubros/editar/:idSubRubro', component: EditarSubRubro },
            { path: 'formas-pago', component: FormasPago },
            { path: 'formas-pago/nuevo', component: NuevaFormaPago },
            { path: 'productos', component: Productos },
        ]
    }
];

export const routing = RouterModule.forChild(routes);
