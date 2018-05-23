import { Routes, RouterModule } from '@angular/router';
import { Pages } from './pages.component';
import { ModuleWithProviders } from '@angular/core';
// noinspection TypeScriptValidateTypes

// export function loadChildren(path) { return System.import(path); };

export const routes: Routes = [
    {
        path: 'login',
        loadChildren: 'app/pages/main/login/login.module#LoginModule'
    },

    {
        path: 'register',
        loadChildren: 'app/pages/main/register/register.module#RegisterModule'
    },
    {
        path: 'pages',
        component: Pages,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', loadChildren: './main/dashboard/dashboard.module#DashboardModule' },
            { path: 'tablas', loadChildren: './main/tablas/tablas.module#TablasModule' },
            { path: 'formularios', loadChildren: './main/formularios/formularios.module#FormulariosModule' },

            // Paginas de ejemplos para desarrollo
            { path: 'editors', loadChildren: './examples/editors/editors.module#EditorsModule' },
            { path: 'components', loadChildren: './examples/components/components.module#ComponentsModule' },
            { path: 'charts', loadChildren: './examples/charts/charts.module#ChartsModule' },
            { path: 'ui', loadChildren: './examples/ui/ui.module#UiModule' },
            { path: 'forms', loadChildren: './examples/forms/forms.module#FormsModule' },
            { path: 'tables', loadChildren: './examples/tables/tables.module#TablesModule' },
            { path: 'maps', loadChildren: './examples/maps/maps.module#MapsModule' }
        ]
    }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
