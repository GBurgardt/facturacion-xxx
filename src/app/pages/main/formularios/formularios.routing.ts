import { Routes, RouterModule } from '@angular/router';
import { Formularios } from '.';
import { ComprobanteCompra } from './comprobanteCompra';


// noinspection TypeScriptValidateTypes
const routes: Routes = [
    {
        path: '',
        component: Formularios,
        children: [
            { path: 'comprobante-compra', component: ComprobanteCompra },
        ]
    }
];

export const routing = RouterModule.forChild(routes);
