import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'popup-lista',
    styleUrls: [('./popup-lista.component.scss')],
    templateUrl: './popup-lista.component.html'
})

/**
 * COMPONENTE REUTILIZABLE
 * 
 */
export class PopupLista {
    // Items a iterar y filtrar
    @Input() items;
    // Key a mostrar
    @Input() keysToShow: string[];
    // Evento click de cada item de la lista
    @Input() onClickItem;
    // Posicion padre
    @Input() fatherPosition: {top: number, left: number};

    constructor() { }

    /**
     * Muestra el item de acuerdo a las keys pasadas
     */
    parseItem = (item) => {
        return this.keysToShow
                    .map(key => item[key])
                    .join(', ');
    }

    getPosicionLista = () => {
        return {top: (this.fatherPosition.top + 22) + 'px', left: this.fatherPosition.left + 'px'}
    }
}
