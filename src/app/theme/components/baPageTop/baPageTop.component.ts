import { Component } from '@angular/core';

import { GlobalState } from '../../../global.state';

@Component({
    selector: 'ba-page-top',
    templateUrl: './baPageTop.html',
    styleUrls: ['./baPageTop.scss']
})
export class BaPageTop {

    public isScrolled: boolean = false;
    public isMenuCollapsed: boolean = false;

    currentMenuSelected: string = '';

    constructor(private _state: GlobalState) {
        this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
            this.isMenuCollapsed = isCollapsed;
        });

        // Actualizo el titulo
        this._state.subscribe('menu.activeLink', (activeLink) => {
            this.currentMenuSelected = activeLink.title;
        });
    }

    public toggleMenu() {
        this.isMenuCollapsed = !this.isMenuCollapsed;
        this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
        return false;
    }

    public scrolledChanged(isScrolled) {
        this.isScrolled = isScrolled;
    }
}
