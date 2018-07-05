import { Routes, RouterModule } from '@angular/router';
import { Comprobantes } from '.';
import { ConsultaComprobante } from './consultaComprobante';


// noinspection TypeScriptValidateTypes
const routes: Routes = [
    {
        path: '',
        component: Comprobantes,
        children: [
            { path: 'consulta', component: ConsultaComprobante },
        ]
    }
];

export const routing = RouterModule.forChild(routes);
