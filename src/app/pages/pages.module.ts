import { NgModule, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './pages.routing';
import { NgaModule } from '../theme/nga.module';
import { AppTranslationModule } from '../app.translation.module';
import { Pages } from './pages.component';
import { DefaultModal } from './reusable/modals/default-modal/default-modal.component';
import { LocalStorageService } from 'app/services/localStorageService';
import { ConfirmationModal } from './reusable/modals/confirmation-modal/confirmation-modal.component';
import { PopupListaService } from 'app/pages/reusable/otros/popup-lista/popup-lista-service';
import { ComprobanteService } from '../services/comprobanteService';
import { UtilsService } from '../services/utilsService';
import { ListPopupService } from './reusable/otros/listFinder/components/listPopup/listPopupService';
import { ImprimirModal } from './reusable/modals/imprimir-modal/imprimir-modal.component';



@NgModule({
    imports: [
        CommonModule,
        AppTranslationModule,
        NgaModule,
        routing
    ],
    declarations: [
        Pages,
        DefaultModal,
        ConfirmationModal,
        ImprimirModal
    ],
    entryComponents: [
        DefaultModal,
        ConfirmationModal,
        ImprimirModal
    ],
    providers: [
        LocalStorageService,
        PopupListaService,
        ComprobanteService,
        UtilsService,
        ListPopupService
    ],
    exports: [
    ]
})
export class PagesModule { }
