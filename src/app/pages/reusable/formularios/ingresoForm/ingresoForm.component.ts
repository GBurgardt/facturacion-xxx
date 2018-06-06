import { Component, Input } from '@angular/core';

import { UtilsService } from 'app/services/utilsService';
import { Observable } from 'rxjs/Observable';
import { Producto } from 'app/models/producto';
import { Padron } from '../../../../models/padron';
import { RecursoService } from 'app/services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';
import { IngresoFormService } from 'app/pages/reusable/formularios/ingresoForm/ingresoFormService';
import { SisTipoOperacion } from 'app/models/sisTipoOperacion';
import { TipoComprobante } from 'app/models/tipoComprobante';
import { Moneda } from '../../../../models/moneda';
import { ProductoPendiente } from 'app/models/productoPendiente';
import { DateLikePicker } from '../../../../models/dateLikePicker';

@Component({
    selector: 'ingreso-form',
    templateUrl: './ingresoForm.html',
    styleUrls: ['./ingresoForm.scss']
})

/**
 * Form reutilizable
 */
export class IngresoForm {
    @Input() titulo = 'test';
    @Input() recurso;

    /////////////////////////////////////////////
    /////////// Modelos Comprobante /////////////
    /////////////////////////////////////////////
    proveedorSeleccionado: Padron = new Padron();

    comprobante: {
        tipo: TipoComprobante,
        numero: number,
        moneda: Moneda,
        fechaCompra: DateLikePicker,
        fechaVto: DateLikePicker
    } = {tipo: new TipoComprobante(), numero: null, moneda: new Moneda(), fechaCompra: null, fechaVto: null};

    comprobanteRelacionado: {
        tipo: TipoComprobante,
        numero: number,
        todosLosPendientes: boolean
    } = {tipo: new TipoComprobante(), numero: null, todosLosPendientes: null};

    /////////////////////////////////////////////
    //////////// Listas desplegables ////////////
    /////////////////////////////////////////////
    tiposComprobantes: Observable<TipoComprobante[]>;
    tiposOperacion: Observable<SisTipoOperacion[]>;
    monedas: Observable<Moneda[]>;

    // Lista de proveedores completa (necesaria para filtrar) y filtrada
    proveedores: {
        todos: Padron[];
        filtrados: Padron[];
    } = {todos:[], filtrados:[]};

    /////////////////////////////////////////////
    ////////////////// Tablas ///////////////////
    /////////////////////////////////////////////
    tablas: {
        columnas: {
            columnasProductos: any[];
        },
        datos: {
            datosProductos: Observable<ProductoPendiente[]>;
        }
    } = { columnas: { columnasProductos: [] }, datos: { datosProductos: null } };
    


    /**
     * Toda la carga de data se hace en el mismo orden en el que está declarado arriba
     */
    constructor(
        private recursoService: RecursoService,
        private ingresoFormService: IngresoFormService,
        private utilsService: UtilsService
    ) {
        ////////// Listas desplegables  //////////
        this.tiposComprobantes = this.recursoService.getRecursoList(resourcesREST.cteTipo)();
        this.tiposOperacion = this.recursoService.getRecursoList(resourcesREST.sisTipoOperacion)();
        this.monedas = this.recursoService.getRecursoList(resourcesREST.sisMonedas)();

        ////////// Proveedores  //////////
        this.recursoService.getRecursoList(resourcesREST.proveedores)().subscribe(proveedores => this.proveedores.todos = proveedores);

        ////////// Tablas //////////
        this.tablas.columnas.columnasProductos = ingresoFormService.getColumnsProductos();
    }

    /**
     * Evento change del input del proovedor
     */
    onChangeInputProveedor = (codigo) => {
        this.proveedores.filtrados = this.ingresoFormService.filtrarProveedores(this.proveedores.todos, codigo);
    }

    /**
     * Click en la lista de proveedores
     */
    onClickListProv = (prove: Padron) => {
        this.proveedorSeleccionado = prove;
    }

    /**
     * On enter en inputprov
     */
    onEnterInputProv = (e) => {
        try {
            const codProv = e.target.value;
            const provSeleccionado = this.proveedores.todos.find((prove) => prove.padronCodigo.toString() === codProv);
            if (provSeleccionado) {
                this.proveedorSeleccionado = provSeleccionado;
            } else {
                this.utilsService.showModal('Codigo incorrecto')('El codigo no existe')()();
            }
        }
        catch(ex) {
            this.utilsService.showModal('Codigo incorrecto')('El codigo no existe')()();
        }
    }

    /**
     * Busca los productos pendientes de acuerdo al comprobante relacionado
     */
    onClickBuscarPendientes = () => {
        this.tablas.datos.datosProductos = this.ingresoFormService.buscarPendientes(this.proveedorSeleccionado)(this.comprobanteRelacionado);
    }


    onClickEdit = () => {

    }

    onClickRemove = () => {
        
    }

}
