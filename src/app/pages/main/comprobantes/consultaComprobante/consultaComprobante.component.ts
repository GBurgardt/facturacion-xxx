import { Component } from '@angular/core';
import { RecursoService } from '../../../../services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';
import { SisModulo } from '../../../../models/sisModulo';
import { UtilsService } from '../../../../services/utilsService';
import { ComprobanteService } from '../../../../services/comprobanteService';
import { Producto } from '../../../../models/producto';
import { SisEstado } from 'app/models/sisEstado';
import { Padron } from 'app/models/padron';
import { Deposito } from '../../../../models/deposito';
import { TipoComprobante } from '../../../../models/tipoComprobante';
import { Comprobante } from '../../../../models/comprobante';
import { DateLikePicker } from '../../../../models/dateLikePicker';
import { ComprobanteEncabezado } from '../../../../models/comprobanteEncabezado';
import { ComprobanteDetalle } from '../../../../models/comprobanteDetalle';

import { Observable, BehaviorSubject } from 'rxjs';

@Component({
    selector: 'consulta-comprobante',
    styleUrls: ['./consultaComprobante.scss'],
    templateUrl: './consultaComprobante.html'
})
export class ConsultaComprobante {
    resourcesREST = resourcesREST;
    
    sisModulos: Observable<SisModulo[]>;
    tipoComprobantes: Observable<TipoComprobante[]>;
    productos: Observable<Producto[]>;
    sisEstados: Observable<SisEstado[]>;
    depositos: Observable<Deposito[]>;
    padrones: Observable<Padron[]>;
    
    // Lo uso cuando busca específicamente por nro y pto venta
    comprobante: Comprobante = new Comprobante();

    fechasFiltro: {
        desde: DateLikePicker,
        hasta: DateLikePicker
    } = {
        desde: new DateLikePicker(),
        hasta: new DateLikePicker()
    }

    sisModuloSelec: SisModulo = new SisModulo();
    tipoComprobanteSelec: TipoComprobante = new TipoComprobante();
    productoSelec: Producto = new Producto();
    sisEstadoSelec: SisEstado = new SisEstado();
    padronSelec: Padron = new Padron();
    depositoSelec: Deposito = new Deposito();

    // compEncabezados: Observable<ComprobanteEncabezado[]> = Observable.of([]);
    compEncabezados: BehaviorSubject<ComprobanteEncabezado[]> = new BehaviorSubject([]);
    compDetalles: BehaviorSubject<ComprobanteDetalle[]> = new BehaviorSubject([]);
    

    constructor(
        private recursoService: RecursoService,
        private utilsService: UtilsService,
        private comprobanteService: ComprobanteService
    ) {
        this.sisModulos = this.recursoService.getRecursoList(resourcesREST.sisModulos)();
        this.productos = this.recursoService.getRecursoList(resourcesREST.productos)();
        this.sisEstados = this.recursoService.getRecursoList(resourcesREST.sisEstados)();

        

        this.padrones = this.recursoService.getRecursoList(resourcesREST.proveedores)();
        this.depositos = this.recursoService.getRecursoList(resourcesREST.depositos)();
    }

    ngOnInit() {
        this.compDetalles.subscribe(a=>console.log(a));

    }

    /**
     * Cuando se cambia un módulo se actualiza la lista de tiposComprobantes
     */
    onChangeSisModulo = (moduloSelec: SisModulo) => 
        this.tipoComprobantes = this.recursoService.getRecursoList(resourcesREST.cteTipo)({
            'sisModulo': moduloSelec.idSisModulos
        })
        // ([
        //     moduloSelec.idSisModulos
        // ]);

    /**
     * On click buscar
     */
    onClickBuscar = () => {
        // Busco los encabezados
        // Me suscribo a los cambios de los encabezados y en cada actualizacion de estos, actualizo también todos los detalles
        // Aprovecho a fijarme si la cantidad es 0. En ese caso, muestro mensaje
        this.comprobanteService.buscarComprobantes(this.comprobante)(this.fechasFiltro)(this.sisModuloSelec)(this.tipoComprobanteSelec)(this.productoSelec)(this.sisEstadoSelec)(this.padronSelec)(this.depositoSelec)
            .subscribe(encabezados => {
                // Actualizo encabezados
                this.compEncabezados.next(encabezados);

                encabezados && encabezados.length === 0 ?
                    this.utilsService.showModal('Aviso')('No se encontraron comprobantes con esas condiciones')()() : null;

                // Actualizo detalles
                this.compDetalles.next(
                    this.utilsService.flatMap(
                        (encabezado: ComprobanteEncabezado) => encabezado.detalle,
                        encabezados
                    )
                )

            })

    }


    /**
     * Formatea el numero pto-venta 4 caracteres y numero 8 caracteres
     */
    formatNumero = (numero) => 
        `${numero.toString().substring(0, numero.toString().length - 8).padStart(4,0)} - ${numero.toString().substring(numero.toString().length - 8)}`
    

    /**
     * Setea la fecha de compra calculandola dado un string en formato 'ddmm', parseando a 'dd/mm/aaaa'
     */
    onCalculateFecha = (e) => (keyFecha) => {
        if (!this.fechasFiltro[keyFecha] || typeof this.fechasFiltro[keyFecha] !== 'string') return;
        
        this.fechasFiltro[keyFecha] = this.utilsService.stringToDateLikePicker(this.fechasFiltro[keyFecha]);

        // Hago focus en el prox input y luego al boton buscar
        (keyFecha==='desde') ? document.getElementById("fechaHasta").focus() : 
            (keyFecha==='hasta') ? document.getElementById("btnBuscar").focus() : null;
        

    }

    /**
     * Descargar pdf del comprobante
     */
    onClickPrint = (compBusc: ComprobanteEncabezado) => {
        this.comprobanteService.descargarPdf(compBusc).subscribe(resp => {
            const bodyResp = resp['_body'];

            var newBlob = new Blob([bodyResp], {type: "application/pdf"})
            
            // IE
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(newBlob);
                return;
            } 
            
            const data = window.URL.createObjectURL(newBlob);

            var link = document.createElement('a');
            link.href = data;
            // link.download="fileBody.pdf";
            link.download=`${compBusc.numero}.pdf`;
            link.click();

            // Firefox
            setTimeout(function(){
                // For Firefox it is necessary to delay revoking the ObjectURL
                window.URL.revokeObjectURL(data);
            }, 100)
        });
        
    }

    /**
     * Evento blur de pto venta y numero en comprobante
     * tipo: puntoVenta o numero
     * keyTipoe: comprobante, comprobanteRelacionado
     */
    onBlurNumeroAutocomp = (e) => (tipo: string) => (keyTipo: string) => 
        this[keyTipo][tipo] = this.utilsService.autocompNroComp(tipo)(this[keyTipo])
}
