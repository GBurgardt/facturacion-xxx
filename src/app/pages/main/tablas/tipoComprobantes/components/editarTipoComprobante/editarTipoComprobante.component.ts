import { Component, Input } from '@angular/core';
import { LocalStorageService } from '../../../../../../services/localStorageService';
import { environment } from 'environments/environment';
import { UtilsService } from '../../../../../../services/utilsService';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { TipoComprobante } from '../../../../../../models/tipoComprobante';
import { TipoComprobantesService } from '../../../../../../services/tipoComprobantesService';

@Component({
    selector: 'editar-tipo-comprobante',
    styleUrls: ['./editarTipoComprobante.scss'],
    templateUrl: './editarTipoComprobante.html',
})
export class EditarTipoComprobante {

    // Usuario que se va a editar
    tipoComprobanteEnEdicion: TipoComprobante = new TipoComprobante();

    constructor(
        private utilsService: UtilsService,
        private router: Router,
        private route: ActivatedRoute,
        private tipoComprobantesService: TipoComprobantesService
    ) {
        
        // Busco el id del tipo de comprobante a editar
        this.route.params.subscribe(params => 
            // Obtengo el tipo de comprobante que se va a editar
            this.tipoComprobantesService.getTipoComprobanteById(parseInt(params.idTipoComprobante)).subscribe(tipoComprobante =>{
                this.tipoComprobanteEnEdicion = tipoComprobante;
                
            })
        );

    }

    /**
     * Editar
     */
    onClickEditarTipoComprobante = async() => {
        try {
            // Edito el usuario seleccionado
            const respUsuarioEditado = await this.tipoComprobantesService.editarTipoComprobante(
                this.tipoComprobanteEnEdicion
            );
    
            // Muestro mensaje de okey y redirecciono a la lista de tipos de comprobantes
            this.utilsService.showModal(
                respUsuarioEditado.control.codigo
            )(
                respUsuarioEditado.control.descripcion
            )(
                () => this.router.navigate(['/pages/tablas/tipos-comprobantes']) 
            )();
        }
        catch(ex) {
            this.utilsService.decodeErrorResponse(ex);
            
        }
    }

}
