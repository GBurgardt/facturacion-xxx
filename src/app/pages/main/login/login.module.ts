import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { AppTranslationModule } from '../../../app.translation.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../../theme/nga.module';

import { Login } from './login.component';
import { routing }       from './login.routing';
import { LoginService } from '../../../services/loginservice';
import { DefaultModal } from '../../reusable/modals/default-modal/default-modal.component';
import { AuthService } from '../../../services/authService';


@NgModule({
  imports: [
    CommonModule,
    AppTranslationModule,
    ReactiveFormsModule,
    FormsModule,
    NgaModule,
    routing
  ],
  declarations: [
    Login
  ],
  providers: [
    LoginService,
    AuthService
  ],
  
})
export class LoginModule {}
