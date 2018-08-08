import { Routes, RouterModule } from '@angular/router';
import { Ventas } from '.';
import { EmisionRemitos } from './emisionRemitos';


// noinspection TypeScriptValidateTypes
const routes: Routes = [
    {
        path: '',
        component: Ventas,
        children: [
            { path: 'emision-remito', component: EmisionRemitos },
        ]
    }
];

export const routing = RouterModule.forChild(routes);
