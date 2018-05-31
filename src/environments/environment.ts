// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,
    facturacionRest: {
        urlBase: 'http://10.0.0.30:8080/FacturacionRest/ws',
        //urlBase: 'http://localhost:8080/facturacionRest/ws',
        timeoutDefault: 60000  //60 seg
    },
    localStorage: {
        acceso: 'accesoActivo',
        menu: 'menuActivo',
        perfil: 'perfilActivo',
        usuario: 'usuarioActivo'
    }
};
