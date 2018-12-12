import { Component, Input, HostListener } from '@angular/core';
import { UtilsService } from '../../../../../../services/utilsService';
import { Router, ActivatedRoute } from '@angular/router';
import { RecursoService } from 'app/services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';

import { Numerador } from '../../../../../../models/numerador';
import { Observable } from '../../../../../../../../node_modules/rxjs';
import { TipoComprobante } from 'app/models/tipoComprobante';
import { Numero } from 'app/models/numero';

@Component({
    selector: 'editar-numeradores',
    styleUrls: ['./editarNumeradores.scss'],
    templateUrl: './editarNumeradores.html',
})
export class EditarNumeradores {
    recurso: Numerador = new Numerador();
    recursoOriginal: Numerador = new Numerador();

    cteTipos: Observable<TipoComprobante[]>;
    numeros: Observable<Numero[]>;

    addNewNumero = false;

    constructor(
        public utilsService: UtilsService,
        private router: Router,
        private route: ActivatedRoute,
        private recursoService: RecursoService
    ) {
        this.route.params.subscribe(params => 
            this.recursoService.getRecursoList(resourcesREST.cteNumerador)()
                .map((recursoList: Numerador[]) =>
                    recursoList.find(recurso => recurso.idCteNumerador === parseInt(params.idCteNumerador))
                )
                .subscribe(recurso =>{
                    this.recurso = recurso;
                    this.recursoOriginal = Object.assign({}, recurso);
                })
        );

        this.cteTipos = this.recursoService.getRecursoList(resourcesREST.cteTipo)({
            'condicion': 'propio'
        });
        this.numeros = this.recursoService.getRecursoList(resourcesREST.cteNumero)();
    }

    
    ngOnInit() {
        this.recursoService.setEdicionFinalizada(false);
    }

    // Si NO finalizó la edición, y SI editó el recurso..
    @HostListener('window:beforeunload')
    canDeactivate = () => 
        this.recursoService.getEdicionFinalizada() ||
        this.recursoService.checkIfEquals(this.recurso, this.recursoOriginal);

    onClickEditar = async() => {
        try {
            console.log(this.recurso);
            const respuestaEdicion: any = await this.recursoService.editarRecurso(
                this.recurso
            )();
    
            this.utilsService.showModal(
                respuestaEdicion.control.codigo
            )(
                respuestaEdicion.control.descripcion
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

        this.recurso.numero = new Numero();
    }

    compareWithCteTipo = (a, b) => a && b && a.idCteTipo && b.idCteTipo ?
        a.idCteTipo === b.idCteTipo : null

}
