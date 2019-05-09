import { Component } from '@angular/core';
import { RecursoService } from '../../../../services/recursoService';
import { UtilsService } from '../../../../services/utilsService';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { Libro } from 'app/models/libro';
import { resourcesREST } from 'constantes/resoursesREST';
import { SisModulo } from 'app/models/sisModulo';
import { DateLikePicker } from 'app/models/dateLikePicker';
import { AuthService } from 'app/services/authService';
import { ComprobanteService } from 'app/services/comprobanteService';
import { SisTipoOperacion } from 'app/models/sisTipoOperacion';
import sisModulos from 'constantes/sisModulos';
import { Deposito } from 'app/models/deposito';
import { Comprobante } from 'app/models/comprobante';
import { ComprobanteRelacionado } from 'app/models/comprobanteRelacionado';
import { TipoComprobante } from 'app/models/tipoComprobante';
import { ProductoPendiente } from 'app/models/productoPendiente';
import { Lote } from 'app/models/lote';
import { ProductoReducido } from 'app/models/productoReducido';

@Component({
    selector: 'remitos-internos',
    styleUrls: ['./remitosInternos.scss'],
    templateUrl: './remitosInternos.html'
})
export class RemitosInternos {
    comprobante: Comprobante = new Comprobante();
    comprobanteRelacionado: ComprobanteRelacionado = new ComprobanteRelacionado();
    
    /** Listas Desplegables **/
    tiposOperaciones: Observable<SisTipoOperacion[]>;
    depositosOrigen: Observable<Deposito[]>;
    depositosDestino: Observable<Deposito[]>;
    tiposComprobantes: Observable<TipoComprobante[]>;
    tiposComprobantesRel: Observable<TipoComprobante[]>;
    
    /** Seleccionados **/
    tipoOpSelect: SisTipoOperacion;
    depositoOrigenSelect: SisTipoOperacion;
    depositoDestinoSelect: SisTipoOperacion;

    /** Tablas **/
    dataProductos: ProductoPendiente[] = [];

    /** Buscador productos **/
    productosReducidos: BehaviorSubject<ProductoReducido[]> = new BehaviorSubject([]);

    constructor(
        private recursoService: RecursoService,
        private utilsService: UtilsService,
        public comprobanteService: ComprobanteService
    ) { 
        this.tiposOperaciones = this.recursoService.getRecursoList(resourcesREST.sisTipoOperacion)({
            sisModulo: sisModulos.interno
        });
    }

    /**
     * Evento onchange desplegable Tipo Operacion
     * Actualiza los depositos
     */
    onChangeTipoOperacion = (tipoOpSelect: SisTipoOperacion) => {
        this.depositosOrigen = this.recursoService.getRecursoList(resourcesREST.depositos)({
            todos: tipoOpSelect.depositoOrigen
        });

        this.depositosDestino = this.recursoService.getRecursoList(resourcesREST.depositos)({
            todos: tipoOpSelect.depositoDestino
        });

        this.tiposComprobantes = this.recursoService.getRecursoList(resourcesREST.cteTipo)({
            'sisTipoOperacion': tipoOpSelect.idSisTipoOperacion
            // 'sisSitIva' : this.cliente.condIva.descCorta
        });
    }

    /**
     * Setea la fecha de compra calculandola dado un string en formato 'ddmm', parseando a 'dd/mm/aaaa'
     * También hago otras cosas
     */
    onBlurFechaComprobante = (e) => {

        // Actualizo fecha (sobretodo si el formato es 'ddmm')
        this.comprobante.fechaComprobante = this.utilsService.stringToDateLikePicker(this.comprobante.fechaComprobante);

        // Actualizo grilla trazable lotes
        // this.actualizarTrazableLotes();

        // Hago foco en el primer checbkox de la sformas de pago (el timeout es necesario para que espere a que se haga la consulta)
        // en gral esta consulta dura poquito (entre 10 y 40 milisegundos). Por eso con 150 milisegundos de espera es mas que suficiente
        setTimeout(() => {
            // Hago focus al siguiente elemento de lps
            const primerCheckBoxFp: any = document.getElementById('lp-radio-0');
            if (primerCheckBoxFp) {
                // primerCheckBoxFp.checked = true;
                primerCheckBoxFp.focus();
            }   
        }, 150)
        
    }

    /**
     * Evento que se dispara cuando se selecciona una fecha
     */
    onModelChangeFechaComp(e, d) {
        // Actualizo fecha (sobretodo si el formato es 'ddmm')
        this.comprobante.fechaComprobante = this.utilsService.stringToDateLikePicker(this.comprobante.fechaComprobante);
    }

    onBlurPtoVenta = (e) => 
        this.utilsService.onBlurInputNumber(e) &&
            this.comprobante.numerador && this.comprobante.numerador.ptoVenta ?
                this.comprobante.numerador.ptoVenta.ptoVenta = this.comprobante.numerador.ptoVenta.ptoVenta
                    .padStart(4, '0') : null;

    onBlurNumerador = (e) => 
        this.utilsService.onBlurInputNumber(e) &&
            this.comprobante.numerador && this.comprobante.numerador.numerador ?
                this.comprobante.numerador.numerador = this.comprobante.numerador.numerador
                    .padStart(8, '0') : null;


    onBlurPtoVentaCteRel = (e) => 
        this.utilsService.onBlurInputNumber(e) &&
            this.comprobanteRelacionado.puntoVenta ?
                this.comprobanteRelacionado.puntoVenta = this.comprobanteRelacionado.puntoVenta
                    .padStart(4, '0') : null;

    onBlurNumeradorCteRel = (e) => 
        this.utilsService.onBlurInputNumber(e) &&
            this.comprobanteRelacionado.numero ?
                this.comprobanteRelacionado.numero = this.comprobanteRelacionado.numero
                    .padStart(8, '0') : null;

    /**
     * Trae data que depende del tipo comprobante relacionado
     * También limpia varios campos
     */
    onChangeTipoComprobante = (cteTipoSelect: TipoComprobante) => {
        this.tiposComprobantesRel = this.recursoService.getRecursoList(resourcesREST.cteTipo)({
            'sisModulo': sisModulos.interno,
            'idCteTipo': cteTipoSelect.idCteTipo,
            'sisTipoOperacion': this.tipoOpSelect.idSisTipoOperacion
        });

        // Si trae observaciones, las seteo en el nuevo comprobante que se está creando
        this.comprobante.observaciones = cteTipoSelect.comprobante && cteTipoSelect.comprobante.observaciones ?
            cteTipoSelect.comprobante.observaciones : null;

        this.comprobante.numerador = null;
        this.comprobante.moneda = null;
        this.comprobante.letraCodigo = null;

        // Blanqueo todo lo que le sigue
        this.comprobanteRelacionado = new ComprobanteRelacionado();
        this.dataProductos = [];
        // this.tablas.datos.lotesTraza = [];
    }

    onChangeDeposito = (depSelec: Deposito) => {
        this.recursoService.getRecursoList(resourcesREST.productosReducidos)({
            tipo: 'reducida',
            idDeposito: depSelec.idDeposito
        })
        .take(1)
        .takeUntil(this._destroyed$)
        .subscribe(
            prods => this.productosReducidos.next(prods)
        )
    }

    // Using a private subject like this is a pattern to manage unsubscribing many observables in the component.
    private _destroyed$ = new Subject<any>();

    public ngOnDestroy (): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }
}
