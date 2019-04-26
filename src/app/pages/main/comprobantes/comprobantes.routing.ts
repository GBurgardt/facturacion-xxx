import { Routes, RouterModule } from '@angular/router';
import { Comprobantes } from '.';
import { ConsultaComprobante } from './consultaComprobante';
import { ConsultaImputaciones } from './consultaImputaciones';
import { ConsultaLibrosIva } from './consultaLibrosIva';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
    {
        path: '',
        component: Comprobantes,
        children: [
            { path: 'consulta', component: ConsultaComprobante },
            { path: 'imputaciones', component: ConsultaImputaciones },
            { path: 'libros-iva', component: ConsultaLibrosIva }
        ]
    }
];

export const routing = RouterModule.forChild(routes);
