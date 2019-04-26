import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from 'app/services/utilsService';
import { RecursoService } from 'app/services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';
import { Contrato } from 'app/models/contrato';
import { ContratosService } from 'app/services/contratosService';

@Component({
    selector: 'abm-contratos',
    styleUrls: ['./abmContratos.scss'],
    templateUrl: './abmContratos.html'
})
export class AbmContratos {
    tableData;
    tableColumns;

    constructor(
        private router: Router,
        public utilsService: UtilsService,
        private recursoService: RecursoService,
        private contratosService: ContratosService
    ) {
        this.tableColumns = [
            {
                nombre: 'Cod Cliente',
                key: 'idPadron',
                ancho: '20%'
            },
            {
                nombre: 'Nombre',
                key: 'padronNombre',
                ancho: '20%'
            },
            {
                nombre: 'Apellido',
                key: 'padronApelli',
                ancho: '20%'
            },
            {
                nombre: 'Cereal',
                key: 'sisCanje',
                subkey: 'descripcion',
                ancho: '20%'
            },
            {
                nombre: 'Kilos',
                key: 'kilos',
                ancho: '20%'
            },
            {
                nombre: 'Fecha Vto',
                key: 'fechaVto',
                ancho: '20%'
            },
            {
                nombre: 'Kilos Cumplidos',
                key: 'kilosCumplidos',
                ancho: '15%'
            }
        ]
        this.tableData = this.recursoService.getRecursoList(resourcesREST.contratos)();
    }

    onClickEdit = (rec: Contrato) => {
        this.router.navigate(['/pages/contratos/abm/editar', rec.idContratos]);
    }

    onClickRemove = async (recurso: Contrato) => {
        this.utilsService.showModal(
            'Borrar contrato'
        )(
            '¿Estás seguro de borrarlo?'
        )(
            async () => {
                await this.recursoService.borrarRecurso(recurso.idContratos)(resourcesREST.contratos);

                this.tableData = this.recursoService.getRecursoList(resourcesREST.contratos)();
            }
        )({
            tipoModal: 'confirmation'
        });
    }

    onClickDownload = (contrato: Contrato) => {
        contrato.isDownloading = true;

        this.contratosService.downloadContrato(contrato.idContratos)
            .subscribe(
                resp => {            
                    this.utilsService.downloadBlob(
                        resp['_body'], 
                        contrato.contratoNro, 
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                    );

                    contrato.isDownloading = false;
                },
                error => console.log(error)
            )
    }

    getDato = (td, tc) => {
        const dato = tc.subkey ? td[tc.key][tc.subkey] : td[tc.key];

        return dato ?
            dato.day ? 
                `${dato.day<10 ? '0' : ''}${dato.day}/${dato.month<10 ? '0' : ''}${dato.month}/${dato.year}`
                :
                dato
            : 
            ''
    }
}
