import { Component } from '@angular/core';
import { DataTablesService } from '../../../reusable/tablas/dataTables/dataTables.service';
import { UsuariosService } from '../../../../services/usuariosService';
import { LocalStorageService } from '../../../../services/localStorageService';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { Usuario } from 'app/models/usuario';
import { UtilsService } from '../../../../services/utilsService';
import { TipoComprobantesService } from 'app/services/tipoComprobantesService';

@Component({
    selector: 'tipo-comprobantes',
    styleUrls: ['./tipoComprobantes.scss'],
    templateUrl: './tipoComprobantes.html'
})
export class TipoComprobantes {

    // Data de la tabla
    dataTipoComprobantes;

    // Columnas de la tabla
    tableColumns;

    constructor(
        private service: DataTablesService,
        private tipoComprobantesService: TipoComprobantesService,
        private router: Router,
        private utilsService: UtilsService
    ) {
        // Guardo las columnas de la tabla con sus respectivas anchuras
        this.tableColumns = [
            {
                nombre: 'codigo',
                key: 'codigoComp',
                ancho: '10%'
            },
            {
                nombre: 'descripcion corta',
                key: 'descCorta',
                ancho: '10%'
            },
            {
                nombre: 'descripcion',
                key: 'descripcion',
                ancho: '20%'
            },
            {
                nombre: 'Curso legal',
                key: 'cursoLegal',
                ancho: '10%'
            },
            {
                nombre: 'codigo afip',
                key: 'codigoAfip',
                ancho: '10%'
            },
            {
                nombre: 'D/H',
                key: 'surenu',
                ancho: '10%'
            },
            {
                nombre: 'Observaciones',
                key: 'observaciones',
                ancho: '20%'
            }
        ]
        // Obtengo la lista de usuarios
        this.dataTipoComprobantes = this.tipoComprobantesService.getTipoComprobantesList();
    }

    /**
     * Redireciona a la pagina de editar
     */
    onClickEdit = (tipoComprobante) => {
        // Redirecciono al dashboard
        this.router.navigate(['/pages/tablas/tipos-comprobantes/editar', tipoComprobante.idCteTipo]);
    }

    /**
     * Borra el usuario y muestra un mensajito avisando tal accion
     */
    onClickRemove = async(usuario) => {
        
        // Pregunto si está seguro
        this.utilsService.showModal(
            'Borrar usuario'
        )(
            '¿Estás seguro de borrar el usuario?'
        )(
           async () => {
                // Borro usuario
                //const respUsuarioBorrado = await this.usuariosService.removeUsuario(usuario);     
                
                // Obtengo la lista de usuarios actualizada
                //this.dataTipoComprobantes = this.usuariosService.getUsuariosList();
            }
        )({
            tipoModal: 'confirmation'
        });
    }

}
