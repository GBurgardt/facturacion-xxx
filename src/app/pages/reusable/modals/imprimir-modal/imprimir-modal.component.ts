import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'imprimir-modal',
    styleUrls: [('./imprimir-modal.component.scss')],
    templateUrl: './imprimir-modal.component.html'
})

export class ImprimirModal implements OnInit {

    modalHeader: string;
    modalContent: string;
    currentComprobante: any;

    onClickImprimir;

    constructor(private activeModal: NgbActiveModal) {
    }

    ngOnInit() { }

    closeModal(resultado) {
        this.activeModal.close(resultado);
    }
}
