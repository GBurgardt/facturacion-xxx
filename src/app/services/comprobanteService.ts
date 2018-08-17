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

@Injectable()
export class ComprobanteService { 

    constructor(
        private authService: AuthService,
        private localStorageService: LocalStorageService
    ) { };
    
    /**
     * Retorna una instancia de sismodulo vacia que se usa en todos
     */
    getEmptySisModulo = () => new SisModulo();

    getEmptyProducto = () => new Producto();

    /**
     * Busca los comprobantes dado los filtros dados
     */
    buscarComprobantes =    (comprobante: Comprobante) => 
                            (fechasFiltro: { desde: DateLikePicker, hasta: DateLikePicker}) => 
                            (sisModuloSelec: SisModulo) => 
                            (tipoComprobanteSelec: TipoComprobante) =>
                            (productoSelec: Producto) =>
                            (sisEstadoSelec: SisEstado) => 
                            (padronSelec: Padron) =>
                            (depositoSelec: Deposito) => 
        this.authService.getBuscaComprobantes(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        )(comprobante)(fechasFiltro)(sisModuloSelec)(tipoComprobanteSelec)(productoSelec)(sisEstadoSelec)(padronSelec)(depositoSelec)
            .map(respuesta => respuesta.arraydatos.map(compEnca => new ComprobanteEncabezado(compEnca)))


    descargarPdf = (compBusc) => {
        return this.authService.descargarComprobante(
            this.localStorageService.getObject(environment.localStorage.acceso).token
        )(
            compBusc.idFactCab
        )
    }

}