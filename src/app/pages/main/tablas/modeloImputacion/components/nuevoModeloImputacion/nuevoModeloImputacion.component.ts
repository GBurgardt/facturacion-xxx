import { Component, Input } from '@angular/core';
import { environment } from 'environments/environment';
import { UtilsService } from '../../../../../../services/utilsService';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FormaPago } from '../../../../../../models/formaPago';
import { TipoFormaPago } from 'app/models/tipoFormaPago';
import { RecursoService } from '../../../../../../services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';
import { ListaPrecio } from '../../../../../../models/listaPrecio';
import { ModeloCab } from '../../../../../../models/modeloCab';
import { ModeloDetalle } from '../../../../../../models/modeloDetalle';
import { PlanCuenta } from '../../../../../../models/planCuenta';
import { SisTipoModelo } from '../../../../../../models/sisTipoModelo';


@Component({
    selector: 'nuevo-modelo-imputacion',
    styleUrls: ['./nuevoModeloImputacion.scss'],
    templateUrl: './nuevoModeloImputacion.html',
})

export class NuevoModeloImputacion {
    recurso: ModeloCab = new ModeloCab();

    detalles: ModeloDetalle[] = [];
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
        private recursoService: RecursoService,
        private utilsService: UtilsService,
        private router: Router
    ) {
        this.contPlanCuentaList = this.recursoService.getRecursoList(resourcesREST.contPlanCuenta)();
        this.sisTipoModeloList = this.recursoService.getRecursoList(resourcesREST.sisTipoModelo)();

    }

    onSelectModImpuTest = (modImpu) => {
        debugger;
    }




    onClickCrear = async () => {
        try {
            // Agrego los detalles
            this.recurso.modeloDetalle = Object.assign([], this.detalles);

            const resp: any = await this.recursoService.setRecurso(this.recurso)();

            this.utilsService.showModal(
                resp.control.codigo
            )(
                resp.control.descripcion
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
                this.detalles
            );

            // Remplazo el elemento editado
            copiaDetalles[
                copiaDetalles.findIndex(
                    det => det.idModeloDetalle === this.detalleEnEdicion.idModeloDetalle
                )
            ] = this.detalleEnEdicion;

            // Remplazo el array original
            this.detalles = Object.assign([], copiaDetalles);

        } else {
            // Le genero un id que uso acá en el FE nomas.
            this.detalleEnEdicion.idModeloDetalle = this.detalles.length + 1;
            // Lo agrego
            this.detalles.push(this.detalleEnEdicion);
        }

        // Limpio el detalle en edicion
        this.detalleEnEdicion = new ModeloDetalle();

        // Limpio los estados
        this.agregandoDetalle = false;
        this.editandoDetalle = false;
    }

    onRemoveDetalle = (det) => {
        this.detalles = this.detalles.filter(
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
    }

    onClickCancelarDetalle = () => {
        this.detalleEnEdicion = new ModeloDetalle();
        this.editandoDetalle = false;
        this.agregandoDetalle = false;
    }
}
