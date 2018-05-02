import { Component, Input } from '@angular/core';

import { environment } from 'environments/environment';
import { UtilsService } from '../../../../../../services/utilsService';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { FormaPago } from '../../../../../../models/formaPago';
import { FormaPagoService } from '../../../../../../services/formaPagoService';
import { TipoFormaPago } from '../../../../../../models/tipoFormaPago';

@Component({
    selector: 'nueva-forma-pago',
    styleUrls: ['./nuevaFormaPago.scss'],
    templateUrl: './nuevaFormaPago.html',
})

export class NuevaFormaPago {
    recurso: FormaPago = new FormaPago();

    tiposFormaPago: Observable<TipoFormaPago[]>;

    constructor(
        private formaPagoService: FormaPagoService,
        private utilsService: UtilsService,
        private router: Router
    ) {
        // Cargo lo tipos de forma pago disponibles
        this.tiposFormaPago = this.formaPagoService.getTiposFormaPagoList();
    }

    onClickCrear = async () => {
        try {
            console.log(this.recurso);
            const resp: any = await this.formaPagoService.registrarRecurso(
                this.recurso
            );
    
            this.utilsService.showModal(
                resp.control.codigo
            )(
                resp.control.descripcion
            )(
                () => this.router.navigate(['/pages/tablas/formas-pago']) 
            )();
        }
        catch(ex) {
            this.utilsService.decodeErrorResponse(ex);        
        }
    }

}
