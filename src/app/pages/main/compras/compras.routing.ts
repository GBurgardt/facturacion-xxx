import { Routes, RouterModule } from '@angular/router';
import { Compras } from '.';
import { ComprobanteCompra } from './comprobanteCompra';


// noinspection TypeScriptValidateTypes
const routes: Routes = [
    {
        path: '',
        component: Compras,
        children: [
            { path: 'comprobante-compra', component: ComprobanteCompra },
        ]
    }
];

export const routing = RouterModule.forChild(routes);
