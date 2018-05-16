import { Component, Input } from '@angular/core';

import { LocalStorageService } from '../../../../../../services/localStorageService';
import { Usuario } from '../../../../../../models/usuario';
import { Sucursal } from 'app/models/sucursal';
import { Perfil } from '../../../../../../models/perfil';
import { environment } from 'environments/environment';
import { UtilsService } from '../../../../../../services/utilsService';
import { Router } from '@angular/router';
import { TipoComprobante } from '../../../../../../models/tipoComprobante';
import { RecursoService } from '../../../../../../services/recursoService';


@Component({
    selector: 'nuevo-tipo-comprobante',
    styleUrls: ['./nuevoTipoComprobante.scss'],
    templateUrl: './nuevoTipoComprobante.html',
})
export class NuevoTipoComprobante {
    recurso: TipoComprobante = new TipoComprobante();

    constructor(
        private recursoService: RecursoService,
        private utilsService: UtilsService,
        private router: Router
    ) { }

    /**
     * Crear
     */
    onClickCrearTipoComprobante = async () => {
        try {
            const resp = await this.recursoService.setRecurso(this.recurso)();

            // Muestro mensaje de okey y redirecciono a la lista de tipos comprobantes
            this.utilsService.showModal(
                resp.control.codigo
            )(
                resp.control.descripcion
            )(
                () => this.router.navigate(['/pages/tablas/tipos-comprobantes'])
            )();
        }
        catch(ex) {
            this.utilsService.decodeErrorResponse(ex);
        }
    }

}
