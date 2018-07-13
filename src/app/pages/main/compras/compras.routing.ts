import { Routes, RouterModule } from '@angular/router';
import { Compras } from '.';
import { ComprobanteCompra } from './comprobanteCompra';
import { EmisionRemitos } from './emisionRemitos';


// noinspection TypeScriptValidateTypes
const routes: Routes = [
    {
        path: '',
        component: Compras,
        children: [
            { path: 'comprobante-compra', component: ComprobanteCompra },
            { path: 'emision-remito', component: EmisionRemitos },
        ]
    }
];

export const routing = RouterModule.forChild(routes);
