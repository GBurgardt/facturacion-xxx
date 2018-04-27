import { Component, Input } from '@angular/core';
import { UsuariosService } from '../../../../../../services/usuariosService';
import { LocalStorageService } from '../../../../../../services/localStorageService';
import { Usuario } from '../../../../../../models/usuario';
import { Sucursal } from 'app/models/sucursal';
import { Perfil } from '../../../../../../models/perfil';
import { environment } from 'environments/environment';
import { UtilsService } from '../../../../../../services/utilsService';
import { Router } from '@angular/router';
import { TipoComprobante } from '../../../../../../models/tipoComprobante';
import { TipoComprobantesService } from '../../../../../../services/tipoComprobantesService';

@Component({
    selector: 'nuevo-tipo-comprobante',
    styleUrls: ['./nuevoTipoComprobante.scss'],
    templateUrl: './nuevoTipoComprobante.html',
})
export class NuevoTipoComprobante {
    // Usuario nuevo
    tipoComprobanteNuevo: TipoComprobante = new TipoComprobante();

    constructor(
        private tipoComprobantesService: TipoComprobantesService,
        private utilsService: UtilsService,
        private router: Router
    ) { }

    /**
     * Crear 
     */
    onClickCrearTipoComprobante = async () => {
        
        try {
            
            const respTipoComprobanteCreado = await this.tipoComprobantesService.registrarTipoComprobante(
                this.tipoComprobanteNuevo
            );
    
            // Muestro mensaje de okey y redirecciono a la lista de tipos comprobantes
            this.utilsService.showModal(
                respTipoComprobanteCreado.control.codigo
            )(
                respTipoComprobanteCreado.control.descripcion
            )(
                () => this.router.navigate(['/pages/tablas/tipos-comprobantes']) 
            )();
        }
        catch(ex) {
            this.utilsService.decodeErrorResponse(ex);
            
        }
    }

}
