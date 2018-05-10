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
import { EditarFormaPago } from './formasPago/components/editarFormaPago';
import { NuevoProducto } from './productos/components/nuevoProducto';
import { EditarProducto } from './productos/components/editarProducto';
import { Depositos } from './depositos';
import { EditarDeposito } from './depositos/components/editarDeposito';
import { NuevoDeposito } from './depositos/components/nuevoDeposito/nuevoDeposito.component';
import { ListaPrecios } from './listaPrecios';
import { NuevoListaPrecio } from './listaPrecios/components/nuevoListaPrecio';
import { EditarListaPrecio } from './listaPrecios/components/editarListaPrecio';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
    {
        path: '',
        component: Tablas,
        children: [
            { path: 'usuarios', component: Usuarios },
            { path: 'usuarios/nuevo', component: NuevoUsuario },
            { path: 'usuarios/editar/:idUsuario', component: EditarUsuario },
            { path: 'comprobantes', component: TipoComprobantes },
            { path: 'comprobantes/nuevo', component: NuevoTipoComprobante },
            { path: 'comprobantes/editar/:idTipoComprobante', component: EditarTipoComprobante },
            { path: 'rubros', component: Rubros },
            { path: 'rubros/nuevo', component: NuevoRubro },
            { path: 'rubros/editar/:idRubro', component: EditarRubro },
            { path: 'subrubros', component: SubRubros },
            { path: 'subrubros/nuevo', component: NuevoSubRubro },
            { path: 'subrubros/editar/:idSubRubro', component: EditarSubRubro },
            { path: 'formaspago', component: FormasPago },
            { path: 'formaspago/nuevo', component: NuevaFormaPago },
            { path: 'formaspago/editar/:idFormaPago', component: EditarFormaPago },
            { path: 'productos', component: Productos },
            { path: 'productos/nuevo', component: NuevoProducto },
            { path: 'productos/editar/:idProductos', component: EditarProducto },
            { path: 'depositos', component: Depositos },
            { path: 'depositos/nuevo', component: NuevoDeposito },
            { path: 'depositos/editar/:idDeposito', component: EditarDeposito },
            { path: 'listaPrecios', component: ListaPrecios },
            { path: 'listaPrecios/nuevo', component: NuevoListaPrecio },
            { path: 'listaPrecios/editar/:idListaPrecio', component: EditarListaPrecio },
        ]
    }
];

export const routing = RouterModule.forChild(routes);
