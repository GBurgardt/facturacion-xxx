import { Injectable } from '@angular/core';
import { SisModulo } from 'app/models/sisModulo';
import { Producto } from '../models/producto';
import { SisEstado } from 'app/models/sisEstado';
import { Padron } from 'app/models/padron';
import { Deposito } from 'app/models/deposito';
import { AuthService } from 'app/services/authService';
import { LocalStorageService } from './localStorageService';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { TipoComprobante } from '../models/tipoComprobante';
import { Comprobante } from '../models/comprobante';
import { DateLikePicker } from '../models/dateLikePicker';
import { ComprobanteEncabezado } from '../models/comprobanteEncabezado';
import { UtilsService } from './utilsService';
import { Vendedor } from 'app/models/vendedor';
import { SisTipoOperacion } from 'app/models/sisTipoOperacion';
import sisModulos from 'constantes/sisModulos';
import { Numerador } from 'app/models/numerador';
import { PtoVenta } from 'app/models/ptoVenta';

@Injectable()
export class ComprobanteService { 

    constructor(
        private authService: AuthService,
        private localStorageService: LocalStorageService,
        public utilsService: UtilsService
    ) { };
    
    /**
     * Retorna una instancia de sismodulo vacia que se usa en todos
     */
    getEmptySisModulo = () => new SisModulo();

    getEmptyProducto = () => new Producto();

    /**
     * Busca los comprobantes dado los filtros dados
     */
    buscarComprobantes = (comprobante: Comprobante) => (fechasFiltro: { desde: DateLikePicker, hasta: DateLikePicker }) => (sisModuloSelec: SisModulo) => (tipoComprobanteSelec: TipoComprobante) => (productoSelec: Producto) => (sisEstadoSelec: SisEstado) => (padronSelec: Padron) => (depositoSelec: Deposito) => (vendedorSelec: Vendedor) => (sisTipoOpSelect: SisTipoOperacion) => (estadoAfip) => 
        this.authService.buscaComprobantes(this.localStorageService.getObject(environment.localStorage.acceso).token)(comprobante)(fechasFiltro)(sisModuloSelec)(tipoComprobanteSelec)(productoSelec)(sisEstadoSelec)(padronSelec)(depositoSelec)(vendedorSelec)(sisTipoOpSelect)(estadoAfip)
            .catch(
                err => this.utilsService.decodeErrorResponse(err)
            )
            .map(
                respuesta => respuesta.arraydatos.map(compEnca => new ComprobanteEncabezado(compEnca))
            )
    /**
     * Genera los comprobantes dado los filtros dados
     */
    generarReportes = (tipo) => (comprobante: Comprobante) => (fechasFiltro: { desde: DateLikePicker, hasta: DateLikePicker }) => (sisModuloSelec: SisModulo) => (tipoComprobanteSelec: TipoComprobante) => (productoSelec: Producto) => (sisEstadoSelec: SisEstado) => (padronSelec: Padron) => (depositoSelec: Deposito) => (vendedorSelec: Vendedor) => (sisTipoOpSelect: SisTipoOperacion) => (estadoAfip: string) =>
        this.authService.reporteComprobantes(tipo)(this.localStorageService.getObject(environment.localStorage.acceso).token)(comprobante)(fechasFiltro)(sisModuloSelec)(tipoComprobanteSelec)(productoSelec)(sisEstadoSelec)(padronSelec)(depositoSelec)(vendedorSelec)(sisTipoOpSelect)(estadoAfip)


    /**
     * Descargar pdf del comprobante
     */
    downloadComp = (compBusc: ComprobanteEncabezado) => {

        compBusc.isDownloading = true;

        this.authService.descargarComprobante(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        )(
            compBusc.idFactCab
        )
            .subscribe(resp => {
                if (resp && resp['_body']) {
                    this.utilsService.downloadBlob(resp['_body'], compBusc.numero);
                }

                compBusc.isDownloading = false;
            });
        
    }

    filtrarPadrones = (listaPadrones, textoBuscado) => 
        listaPadrones.filter(
            (prov: Padron) =>   prov.padronCodigo.toString().includes(textoBuscado) ||
                                prov.padronApelli.toString().toLowerCase().includes(textoBuscado)
        );

    filtrarProductos = (listaProductos, textoBuscado) => 
        listaProductos.filter(
            (prov: Producto) =>   prov.codProducto.toString().includes(textoBuscado) ||
                                prov.descripcion.toString().toLowerCase().includes(textoBuscado)
        );

    autorizarAfip = (idFactCab) => 
        this.authService.autorizarAfip(
            this.localStorageService.getObject(environment.localStorage.acceso).token,
            'solicitarCae',
            idFactCab
        )
            .catch((err, caught) => {
                this.utilsService.showErrorWithBody(err, true);
                return Observable.of([]);
            })

    borrarComprobante = (comp: ComprobanteEncabezado) => {
        return this.authService.borrarComprobante(
            this.localStorageService.getObject(environment.localStorage.acceso).token,
            comp.idFactCab
        )
            .catch((err, caught) => {
                this.utilsService.showErrorWithBody(err, true);
                return Observable.of([]);
            })
    }

    imprimirLibrosIva = (sisModulo: SisModulo, fecDesde, fecHasta) => 
        this.authService.imprimirLibrosIva(
            this.localStorageService.getObject(environment.localStorage.acceso).token,
            sisModulo.idSisModulos,
            fecDesde,
            fecHasta
        ).catch((err) => {
            debugger;
            return Observable.of(null)
        })
    

    
    /**
     * Check if comprobante contain numerador
     */
    comprobanteContainNumerador = (comprobante) => {
        if (
            !(
                comprobante && 
                comprobante.letraCodigo && 
                comprobante.letraCodigo.numeradores && 
                comprobante.letraCodigo.numeradores.length > 0
            )
        ) {
            if (!comprobante.numerador || !comprobante.numerador.ptoVenta) {
                if (!comprobante.numerador) {
                    comprobante.numerador = new Numerador();
                }
                comprobante.numerador.ptoVenta = new PtoVenta();
            }
            return true;
        } else {
            return false;
        }
    }

}