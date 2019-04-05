// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,
    facturacionRest: {
        urlBase: 'http://10.0.0.33:8080/FacturacionRest/ws',
        // urlBase: 'http://10.0.0.31:8080/facturacionrest/ws',
        urlFactElectronica: 'http://10.0.0.33:8080/FacturacionElectronica/ws',
        //urlFactElectronica: 'http://10.0.0.31:8080/facturacionrest/ws',

        // urlBase: 'http://vpn.kernelinformatica.com.ar:14217/FacturacionRest/ws',
        timeoutDefault: 60000
    },
    localStorage: {
        acceso: 'accesoActivo',
        menu: 'menuActivo',
        perfil: 'perfilActivo',
        usuario: 'usuarioActivo'
    }
};
