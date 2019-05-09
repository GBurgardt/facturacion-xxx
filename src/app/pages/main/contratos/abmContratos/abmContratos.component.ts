import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from 'app/services/utilsService';
import { RecursoService } from 'app/services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';
import { Contrato } from 'app/models/contrato';
import { ContratosService } from 'app/services/contratosService';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
    selector: 'abm-contratos',
    styleUrls: ['./abmContratos.scss'],
    templateUrl: './abmContratos.html'
})
export class AbmContratos {
    tableDataFiltered: BehaviorSubject<Contrato[]> = new BehaviorSubject([]);
    tableDataComplete: Contrato[] = [];
    tableColumns;

    filtros: {
        cliente: string,
        producto: string,
        estado: string
    } = { cliente: null, producto: null, estado: 'todos' };

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
        this.recursoService.getRecursoList(resourcesREST.contratos)()
            .subscribe(
                resp => {
                    this.tableDataFiltered.next(resp);
                    this.tableDataComplete = resp;
                }
            )
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

                this.recursoService.getRecursoList(resourcesREST.contratos)()
                    .subscribe(
                        resp => {
                            this.tableDataFiltered.next(resp);
                            this.tableDataComplete = resp;
                        }
                    )
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

    /**
     * Filtra de acuerdo a los filtros seteados
     */
    onFiltrar = (e) => {
        console.log(this.filtros.cliente);
        this.tableDataFiltered.next(
            this.tableDataComplete
                .filter(
                    (cont: Contrato) =>
                        this.filtros.cliente && this.filtros.cliente.length > 0 ?
                            (
                                cont.idPadron.toString().toLowerCase().trim().includes(this.filtros.cliente.toString().toLowerCase()) ||
                                cont.padronNombre.toString().toLowerCase().trim().includes(this.filtros.cliente.toString().toLowerCase()) ||
                                cont.padronApelli.toString().toLowerCase().trim().includes(this.filtros.cliente.toString().toLowerCase())
                            ) : true
                )
                .filter(
                    (cont: Contrato) => 
                        this.filtros.producto && this.filtros.producto.length > 0 ?
                            (
                                cont.sisCanje.descripcion.toString().toLowerCase().trim().includes(this.filtros.producto.toString().toLowerCase())
                            ) : true
                )
                .filter(
                    (cont: Contrato) => 
                        this.filtros.estado && this.filtros.estado.length > 0 ?
                            (
                                this.filtros.estado === 'cumplido' ?
                                    cont.kilos === cont.kilosCumplidos :
                                this.filtros.estado === 'pendiente' ?
                                    cont.kilos !== cont.kilosCumplidos :
                                    true
                            ) : true
                )
                    
                    // &&
                    // //Si es cumplido, lois kilos y kilosCumplidos deben ser iguales
                    // (
                    //     this.filtros.estado === 'cumplido' ?
                    //         cont.kilos === cont.kilosCumplidos :
                    //     this.filtros.estado === 'pendiente' ?
                    //         cont.kilos !== cont.kilosCumplidos :
                    //         true
                    // )

        )

    }

    // onFiltrar = (e) => {
    //     if (this.filtros && this.filtros.cliente && this.filtros.producto && this.filtros.estado) {
    //         this.tableDataFiltered.next(
    //             this.tableDataComplete.filter(
    //                 (cont: Contrato) =>
    //                     (
    //                         cont.idPadron.toString().toLowerCase().trim().includes(this.filtros.cliente.toString().toLowerCase()) ||
    //                         cont.padronNombre.toString().toLowerCase().trim().includes(this.filtros.cliente.toString().toLowerCase()) ||
    //                         cont.padronApelli.toString().toLowerCase().trim().includes(this.filtros.cliente.toString().toLowerCase())
    //                     )
    //                     &&   
    //                     (
    //                         cont.sisCanje && 
    //                         cont.sisCanje.descripcion.toString().toLowerCase().trim().includes(this.filtros.producto.toString().toLowerCase())
    //                     )
    //                     &&
    //                     //Si es cumplido, lois kilos y kilosCumplidos deben ser iguales
    //                     (
    //                         this.filtros.estado === 'cumplido' ?
    //                             cont.kilos === cont.kilosCumplidos :
    //                         this.filtros.estado === 'pendiente' ?
    //                             cont.kilos !== cont.kilosCumplidos :
    //                             true
    //                     )
                        
    //             )
    //         )
    //     } else if (this.filtros && (this.filtros.cliente || this.filtros.producto)) {
    //         this.tableDataFiltered.next(
    //             this.tableDataComplete.filter(
    //                 (cont: Contrato) =>
    //                     this.filtros.cliente &&
    //                         (
    //                             cont.idPadron.toString().toLowerCase().trim().includes(this.filtros.cliente.toString().toLowerCase()) ||
    //                             cont.padronNombre.toString().toLowerCase().trim().includes(this.filtros.cliente.toString().toLowerCase()) ||
    //                             cont.padronApelli.toString().toLowerCase().trim().includes(this.filtros.cliente.toString().toLowerCase())
    //                         )
    //                     ||    
    //                     this.filtros.producto &&
    //                         (
    //                             cont.sisCanje && 
    //                             cont.sisCanje.descripcion.toString().toLowerCase().trim().includes(this.filtros.producto.toString().toLowerCase())
    //                         )
                        
    //             )
    //         )
    //     } else {
    //         this.tableDataFiltered.next(this.tableDataComplete)
    //     }

    // }
}
