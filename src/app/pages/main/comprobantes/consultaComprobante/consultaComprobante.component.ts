import { Component } from '@angular/core';
import { AuthService } from 'app/services/authService';
import { Observable } from 'rxjs/Observable';
import { RecursoService } from '../../../../services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';
import { SisModulo } from '../../../../models/sisModulo';
import { UtilsService } from '../../../../services/utilsService';
import { ComprobanteService } from '../../../../services/comprobanteService';
import { Producto } from '../../../../models/producto';
import { SisEstado } from 'app/models/sisEstado';

@Component({
    selector: 'consulta-comprobante',
    styleUrls: ['./consultaComprobante.scss'],
    templateUrl: './consultaComprobante.html'
})
export class ConsultaComprobante {
    resourcesREST = resourcesREST;
    
    comprobante = { 
        test: '',
    };
    
    sisModulos: Observable<SisModulo[]>;
    sisModuloSelec: SisModulo = new SisModulo();

    productos: Observable<Producto[]>;
    productoSelec: Producto = new Producto();

    sisEstados: Observable<SisEstado[]>;
    sisEstadoSelect: SisEstado = new SisEstado();

    constructor(
        private recursoService: RecursoService,
        private utilsService: UtilsService,
        private comprobanteService: ComprobanteService
    ) {
        this.sisModulos = this.recursoService.getRecursoList(resourcesREST.sisModulos)();
        this.productos = this.recursoService.getRecursoList(resourcesREST.productos)();
        this.sisEstados = this.recursoService.getRecursoList(resourcesREST.sisEstados)();
    }

    
    
}
