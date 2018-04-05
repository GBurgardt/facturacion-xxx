import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';

import { routing }       from './pages.routing';
import { NgaModule } from '../theme/nga.module';
import { AppTranslationModule } from '../app.translation.module';

import { Pages } from './pages.component';
import { DefaultModal } from './reusable/modals/default-modal/default-modal.component';


@NgModule({
  imports: [CommonModule, AppTranslationModule, NgaModule, routing],
  declarations: [
    Pages,
    DefaultModal
  ],
  entryComponents: [
    DefaultModal
  ]
})
export class PagesModule {}
