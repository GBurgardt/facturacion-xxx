import { Routes, RouterModule } from '@angular/router';
import { Stock } from '.';
import { Productos } from './productos';
import { NuevoProducto } from 'app/pages/main/stock/productos/components/nuevoProducto';
import { EditarProducto } from 'app/pages/main/stock/productos/components/editarProducto';
import { ConsultaPorProducto } from './consultaPorProducto';


// noinspection TypeScriptValidateTypes
const routes: Routes = [
    {
        path: '',
        component: Stock,
        children: [
            { path: 'productos', component: Productos },
            { path: 'productos/nuevo', component: NuevoProducto },
            { path: 'productos/editar/:idProductos', component: EditarProducto },
            { path: 'consulta-producto', component: ConsultaPorProducto },
        ]
    }
];

export const routing = RouterModule.forChild(routes);
