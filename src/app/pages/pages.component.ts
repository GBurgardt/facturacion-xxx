import { Component } from '@angular/core';
import { Routes } from '@angular/router';

import { BaMenuService } from '../theme';
import { PAGES_MENU } from './pages.menu';
import { AppState } from 'app/app.service';
import { LocalStorageService } from '../services/localStorageService';
import { environment } from 'environments/environment';

@Component({
    selector: 'pages',
    template: `
    <ba-sidebar></ba-sidebar>

    <div class="al-main">
      <div class="al-content">

        <router-outlet></router-outlet>
      </div>
    </div>
    <footer class="al-footer clearfix">
      <div class="al-footer-right" translate>{{'general.created_with'}} <i class="ion-heart"></i></div>
      <div class="al-footer-main clearfix">
        <div class="al-copy">&copy; <a href="http://www.kernelinformatica.com.ar" translate>{{'general.akveo'}}</a> 2018</div>
        <ul class="al-share clearfix">
          <li><i class="socicon socicon-facebook"></i></li>
          <li><i class="socicon socicon-twitter"></i></li>
          <li><i class="socicon socicon-google"></i></li>
          <li><i class="socicon socicon-github"></i></li>
        </ul>
      </div>
    </footer>
    <ba-back-top position="200"></ba-back-top>
    `
})
export class Pages {

    constructor(
        private _menuService: BaMenuService,
        private appState: AppState,
        private localStorageService: LocalStorageService
    ) {
    }

    ngOnInit() {
        // Ahora el menu se obtiene del localStorage, donde es almacenada cuando el user se loguea
        //this._menuService.updateMenuByRoutes(<Routes>PAGES_MENU);
        this._menuService.updateMenuByRoutes(
            this.localStorageService.getObject(environment.localStorage.menu)
        );
    }
}


/*
TODO: Viejo template, se le sacó el <ba-page-top> y  el <ba-content-top> al de arriba!
template: `
    <ba-sidebar></ba-sidebar>
    <ba-page-top></ba-page-top>
    <div class="al-main">
      <div class="al-content">
        <ba-content-top></ba-content-top>
        <router-outlet></router-outlet>
      </div>
    </div>
    <footer class="al-footer clearfix">
      <div class="al-footer-right" translate>{{'general.created_with'}} <i class="ion-heart"></i></div>
      <div class="al-footer-main clearfix">
        <div class="al-copy">&copy; <a href="http://www.kernelinformatica.com.ar" translate>{{'general.akveo'}}</a> 2018</div>
        <ul class="al-share clearfix">
          <li><i class="socicon socicon-facebook"></i></li>
          <li><i class="socicon socicon-twitter"></i></li>
          <li><i class="socicon socicon-google"></i></li>
          <li><i class="socicon socicon-github"></i></li>
        </ul>
      </div>
    </footer>
    <ba-back-top position="200"></ba-back-top>
    `

*/
