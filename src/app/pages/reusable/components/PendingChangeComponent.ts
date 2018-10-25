import { Component, HostListener } from '@angular/core';

@Component({

})
export class PendingChangeComponent {

    recursoEditado: boolean = false;

    @HostListener('window:beforeunload')
    canDeactivate() {
        return !this.recursoEditado
    }

}