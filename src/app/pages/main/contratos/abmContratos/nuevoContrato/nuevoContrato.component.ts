import { Component } from '@angular/core';
import { FilesService } from 'app/services/filesService';
import { Padron } from 'app/models/padron';
import { Contrato } from 'app/models/contrato';
import { AuthService } from 'app/services/authService';
import { LocalStorageService } from 'app/services/localStorageService';
import { environment } from 'environments/environment';
import { SisCanje } from 'app/models/sisCanje';
import { Observable } from 'rxjs';
import { RecursoService } from 'app/services/recursoService';
import { resourcesREST } from 'constantes/resoursesREST';
import { UtilsService } from 'app/services/utilsService';
import { Router } from '@angular/router';
import { ContratosService } from 'app/services/contratosService';

@Component({
    selector: 'nuevo-contrato',
    styleUrls: ['./nuevoContrato.scss'],
    templateUrl: './nuevoContrato.html'
})
export class NuevoContrato {

    recurso: Contrato = new Contrato();

    modelInputFile: any;
    file;

    sisCanjes: Observable<SisCanje[]>;

    constructor(
        private contratosService: ContratosService,
        private recursoService: RecursoService,
        private router: Router,
        public utilsService: UtilsService
    ) {
        this.sisCanjes = this.recursoService.getRecursoList(resourcesREST.sisCanjes)();
    }

    onFileSelected = (e) => {
        const existFile = e.target && e.target.files && e.target.files.length > 0;
        const file = existFile ? e.target.files[0] : null;
        this.file = file;
    }

    onGenerar = () => {
        if (this.file) {
            this.contratosService.generarContrato(this.file);
        }
    }

    onGrabar = () => {
        if (this.file) {
            this.contratosService
                .grabarContrato(this.file, this.recurso, () => this.router.navigate(['/pages/contratos/abm']))
        }
    }

    onSelectCliente = (cli: Padron) => {
        this.recurso.idPadron = cli.padronCodigo;

        setTimeout(
            () => document.getElementById('idFechaNacInput').focus()
        )
    }
}
