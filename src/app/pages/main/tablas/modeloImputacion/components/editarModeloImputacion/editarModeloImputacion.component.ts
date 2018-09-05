import { Component, Input } from '@angular/core';
import { environment } from 'environments/environment';
import { UtilsService } from '../../../../../../services/utilsService';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FormaPago } from '../../../../../../models/formaPago';
import { TipoFormaPago } from 'app/models/tipoFormaPago';
import { RecursoService } from '../../../../../../services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';
import { ListaPrecio } from '../../../../../../models/listaPrecio';
import { ModeloCab } from 'app/models/modeloCab';
import { ModeloDetalle } from 'app/models/modeloDetalle';
import { PlanCuenta } from 'app/models/planCuenta';
import { SisTipoModelo } from 'app/models/sisTipoModelo';


@Component({
    selector: 'editar-modelo-imputacion',
    styleUrls: ['./editarModeloImputacion.scss'],
    templateUrl: './editarModeloImputacion.html',
})

export class EditarModeloImputacion {
    recurso: ModeloCab = new ModeloCab();
    
    // detalles: ModeloDetalle[] = [];
    detalleEnEdicion: ModeloDetalle = new ModeloDetalle();

    agregandoDetalle: boolean = false;
    editandoDetalle: boolean = false;

    addDetalleTitle = 'Agregar Detalle';

    // Desplegables
    signos = ['+', '-', '*', '/', '%'];
    debeHaber = ['D', 'H', '-'];
    contPlanCuentaList: Observable<PlanCuenta[]> = Observable.of([]);
    sisTipoModeloList: Observable<SisTipoModelo[]> = Observable.of([]);

    constructor(
        private utilsService: UtilsService,
        private router: Router,
        private route: ActivatedRoute,
        private recursoService: RecursoService
    ) {
        this.contPlanCuentaList = this.recursoService.getRecursoList(resourcesREST.contPlanCuenta)();
        this.sisTipoModeloList = this.recursoService.getRecursoList(resourcesREST.sisTipoModelo)();

        this.route.params.subscribe(params =>
            this.recursoService.getRecursoList(resourcesREST.modeloImputacion)()
                .map((recursoList: ModeloCab[]) =>
                    recursoList.find(recurso => recurso.idModeloCab === parseInt(params.idModeloCab))
                )
                .subscribe(recurso =>{
                    this.recurso = recurso;
                })
        );
    }

    onClickEditar = async() => {
        try {
            const respuestaEdicion: any = await this.recursoService.editarRecurso(this.recurso)();

            this.utilsService.showModal(
                respuestaEdicion.control.codigo
            )(
                respuestaEdicion.control.descripcion
            )(
                () => this.router.navigate(['/pages/tablas/modelo-imputacion'])
            )();
        }
        catch(ex) {
            this.utilsService.decodeErrorResponse(ex);

        }
    }

    onClickConfirmarDetalle = () => {
        if (this.editandoDetalle) {
            let copiaDetalles = Object.assign(
                [], 
                this.recurso.modeloDetalle
            );

            // Remplazo el elemento editado
            copiaDetalles[
                copiaDetalles.findIndex(
                    det => det.idModeloDetalle === this.detalleEnEdicion.idModeloDetalle
                )
            ] = this.detalleEnEdicion;

            // Remplazo el array original
            this.recurso.modeloDetalle = Object.assign([], copiaDetalles);

        } else {
            // Lo agrego
            this.recurso.modeloDetalle.push(this.detalleEnEdicion);
        }

        // Limpio el detalle en edicion
        this.detalleEnEdicion = new ModeloDetalle();

        // Limpio los estados
        this.agregandoDetalle = false;
        this.editandoDetalle = false;
    }

    onRemoveDetalle = (det) => {
        this.recurso.modeloDetalle = this.recurso.modeloDetalle.filter(
            d => d.idModeloDetalle !== det.idModeloDetalle
        );

        // También borro el que esté actual si hay
        this.detalleEnEdicion = new ModeloDetalle();
        // Limpio los estados
        this.agregandoDetalle = false;
        this.editandoDetalle = false;
    }

    onEditDetalle = (det) => {
        this.addDetalleTitle = 'Editar Detalle';

        this.editandoDetalle = !this.editandoDetalle;

        this.detalleEnEdicion = Object.assign({}, det);
        debugger;
    }

    compareWithCtaContable = (item1: any, item2: any) => {
        if (item2) debugger;
        return item1 && item2 && (
            item1 === item2 ||
            item1.toString() === item2
        )
    }

    onClickCancelarDetalle = () => {
        this.detalleEnEdicion = new ModeloDetalle();
        this.editandoDetalle = false;
        this.agregandoDetalle = false;
    }
}
