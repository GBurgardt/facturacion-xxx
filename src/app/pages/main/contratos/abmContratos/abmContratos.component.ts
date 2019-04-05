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
                nombre: 'Nro',
                key: 'contratoNro',
                ancho: '5%'
            },
            {
                nombre: 'Fecha Nac',
                key: 'fechaNacimiento',
                ancho: '10%'
            },
            {
                nombre: 'Nacionali',
                key: 'nacionalidad',
                ancho: '10%'
            },
            {
                nombre: 'Profesion',
                key: 'profesion',
                ancho: '10%'
            },
            {
                nombre: 'Doc',
                key: 'documento',
                ancho: '10%'
            },
            {
                nombre: 'Padre',
                key: 'padre',
                ancho: '15%'
            },
            {
                nombre: 'Madre',
                key: 'madre',
                ancho: '15%'
            },
            {
                nombre: 'Kilos',
                key: 'kilos',
                ancho: '5%'
            },
            {
                nombre: 'Cosecha',
                key: 'cosecha',
                ancho: '10%'
            },
            {
                nombre: 'Fecha Vto',
                key: 'fechaVto',
                ancho: '10%'
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

    getDato = (dato) => 
        dato ?
            dato.day ? 
                `${dato.day<10 ? '0' : ''}${dato.day}/${dato.month<10 ? '0' : ''}${dato.month}/${dato.year}`
                :
                dato
            : 
            ''
}
