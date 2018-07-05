import { Component, Input } from '@angular/core';

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
                    .map(key => {
                        const deepKey = key.includes('.') ? key.split('.') : null;

                        // Si tiene deepKey entonces voy profundo en el json (ejemplo: producto.descripcion)
                        return deepKey ? item[deepKey[0]][deepKey[1]] : item[key];
                        //return item[key];
                    })
                    .join(', ');
    }

    getPosicionLista = () => {
        return {top: (this.fatherPosition.top + 22) + 'px', left: this.fatherPosition.left + 'px'}
    }




}
