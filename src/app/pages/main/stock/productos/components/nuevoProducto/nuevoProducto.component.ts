import { Component, Input } from '@angular/core';

import { environment } from 'environments/environment';
import { UtilsService } from '../../../../../../services/utilsService';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Producto } from '../../../../../../models/producto';
import { IVA } from '../../../../../../models/IVA';

import { RecursoService } from '../../../../../../services/recursoService';
import { SubRubro } from '../../../../../../models/subRubro';
import { Unidad } from '../../../../../../models/unidad';
import { resourcesREST } from 'constantes/resoursesREST';
import { Rubro } from 'app/models/rubro';
import { ModeloCab } from 'app/models/modeloCab';
import { AuthService } from '../../../../../../services/authService';

@Component({
    selector: 'nuevo-producto',
    styleUrls: ['./nuevoProducto.scss'],
    templateUrl: './nuevoProducto.html',
})

export class NuevoProducto {
    recurso: Producto = new Producto();
    ivas: Observable<IVA[]>;
    rubros: Observable<Rubro[]>;
    subRubros: Observable<SubRubro[]>;
    unidadesCompra: Observable<Unidad[]>;
    unidadesVenta: Observable<Unidad[]>;
    modelosCab: Observable<ModeloCab[]>;

    sugerenciaProxCodigo: string = '';

    constructor(
        private recursoService: RecursoService,
        private utilsService: UtilsService,
        private router: Router
    ) {
        // Inicializo los valores de los desplegables
        this.rubros = this.recursoService.getRecursoList(resourcesREST.rubros)();
        // this.subRubros = this.recursoService.getRecursoList(resourcesREST.subRubros)();
        this.unidadesCompra = this.recursoService.getRecursoList(resourcesREST.sisUnidad)();
        this.unidadesVenta = this.recursoService.getRecursoList(resourcesREST.sisUnidad)();
        this.ivas = this.recursoService.getRecursoList(resourcesREST.sisIVA)();
        this.modelosCab = this.recursoService.getRecursoList(resourcesREST.modeloCab)();

        this.recursoService.getProximoCodigoProducto().subscribe(
            proxCodigo => this.sugerenciaProxCodigo = proxCodigo ? proxCodigo : '0'
        );
    }

    onClickCrear = async () => {
        try {

            const resp: any = await this.recursoService.setRecurso(
                this.recurso
            )();


            this.utilsService.showModal(
                resp.control.codigo
            )(
                resp.control.descripcion
            )(
                () => this.router.navigate(['/pages/stock/productos'])
            )();
        }
        catch(ex) {
            this.utilsService.decodeErrorResponse(ex);
        }
    }

    compareWithModeloImpu = (mod1: ModeloCab, mod2: ModeloCab) => mod1 && mod2 ? mod1.idModeloCab === mod2.idModeloCab : mod1 === mod2

    /**
     * Cuanbdo cambia Rubro, actualizo SubRubros
     */
    onChangeRubro = (rubroSelect: Rubro) => {
        this.subRubros = this.recursoService.getRecursoList(resourcesREST.subRubros)({
            'idRubro': rubroSelect.idRubro
        })
    }

}
