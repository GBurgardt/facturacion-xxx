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

import { EditarFormaPago } from './formasPago/components/editarFormaPago';

import { Depositos } from './depositos';
import { EditarDeposito } from './depositos/components/editarDeposito';
import { NuevoDeposito } from './depositos/components/nuevoDeposito/nuevoDeposito.component';
import { ListaPrecios } from './listaPrecios';
import { NuevoListaPrecio } from './listaPrecios/components/nuevoListaPrecio';
import { EditarListaPrecio } from './listaPrecios/components/editarListaPrecio';
import { Productos } from 'app/pages/main/stock/productos';
import { NuevoProducto } from '../stock/productos/components/nuevoProducto';
import { EditarProducto } from 'app/pages/main/stock/productos/components/editarProducto';
import { ModeloImputacion } from './modeloImputacion';
import { NuevoModeloImputacion } from './modeloImputacion/components/nuevoModeloImputacion';
import { EditarModeloImputacion } from 'app/pages/main/tablas/modeloImputacion/components/editarModeloImputacion';

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
            { path: 'formas-pago/editar/:idFormaPago', component: EditarFormaPago },
            // { path: 'productos', component: Productos },
            // { path: 'productos/nuevo', component: NuevoProducto },
            // { path: 'productos/editar/:idProductos', component: EditarProducto },
            { path: 'depositos', component: Depositos },
            { path: 'depositos/nuevo', component: NuevoDeposito },
            { path: 'depositos/editar/:idDeposito', component: EditarDeposito },
            { path: 'lista-precios', component: ListaPrecios },
            { path: 'lista-precios/nuevo', component: NuevoListaPrecio },
            { path: 'lista-precios/editar/:idListaPrecio', component: EditarListaPrecio },
            { path: 'modelo-imputacion', component: ModeloImputacion },
            { path: 'modelo-imputacion/nuevo', component: NuevoModeloImputacion },
            { path: 'modelo-imputacion/editar/:idModeloCab', component: EditarModeloImputacion },
        ]
    }
];

export const routing = RouterModule.forChild(routes);
