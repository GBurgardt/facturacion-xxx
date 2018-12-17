import { Router } from '@angular/router';
import { UtilsService } from '../../../../../../services/utilsService';
import { RecursoService } from 'app/services/recursoService';
import { Component, Input, HostListener } from '@angular/core';

import { Numerador } from '../../../../../../models/numerador';
import { TipoComprobante } from '../../../../../../models/tipoComprobante';
import { Observable } from '../../../../../../../../node_modules/rxjs';
import { resourcesREST } from 'constantes/resoursesREST';

import { DateLikePicker } from 'app/models/dateLikePicker';
import { PtoVenta } from 'app/models/ptoVenta';

@Component({
    selector: 'nuevo-numeradores',
    styleUrls: ['./nuevoNumeradores.scss'],
    templateUrl: './nuevoNumeradores.html',
})

export class NuevoNumeradores {
    recurso: Numerador = new Numerador();
    cteTipos: Observable<TipoComprobante[]>;
    ptoVentas: Observable<PtoVenta[]>;

    addNewNumero = false;

    constructor(
        private recursoService: RecursoService,
        public utilsService: UtilsService,
        private router: Router
    ) {
        this.cteTipos = this.recursoService.getRecursoList(resourcesREST.cteTipo)({
            'condicion': 'propio'
        });
        this.ptoVentas = this.recursoService.getRecursoList(resourcesREST.ptoVenta)();
    }

    ngOnInit() {
        this.recursoService.setEdicionFinalizada(false);
    }

    @HostListener('window:beforeunload')
    canDeactivate = () => 
        this.recursoService.checkIfEquals(this.recurso, new Numerador()) || 
        this.recursoService.getEdicionFinalizada();

    onClickCrear = async () => {
        try {
            const fa = this.recurso;
            debugger;

            const resp: any = await this.recursoService.setRecurso(this.recurso)();
    
            this.utilsService.showModal(
                resp.control.codigo
            )(
                resp.control.descripcion
            )(
                () => {
                    this.router.navigate(['/pages/tablas/numeradores']);
                    this.recursoService.setEdicionFinalizada(true);
                }
            )();
        }
        catch(ex) {
            this.utilsService.decodeErrorResponse(ex);       
        }
    }

    onClickAddNumero = () => {
        this.addNewNumero = !this.addNewNumero;

        this.recurso.ptoVenta = new PtoVenta();
    }

    onItemChangedFecha(e, keyFecha) {
        this.recurso[keyFecha] = new DateLikePicker(null, e)
    }

}
