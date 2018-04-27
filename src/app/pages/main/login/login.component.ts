import { Component } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../../../services/loginservice';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { UtilsService } from 'app/services/utilsService';

@Component({
    selector: 'login',
    templateUrl: './login.html',
    styleUrls: ['./login.scss']
})
export class Login {
    public form: FormGroup;
    public usuario: AbstractControl;
    public password: AbstractControl;
    public submitted: boolean = false;

    constructor(
        fb: FormBuilder,
        private loginService: LoginService,
        private router: Router,
        private utilsService: UtilsService
        
    ) {
        this.form = fb.group({
            'usuario': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
            'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
        });
        this.usuario = this.form.controls['usuario'];
        this.password = this.form.controls['password'];
    }

    async onSubmit(values: Object) {
        this.submitted = true;
        if (this.form.valid) {
            try {
                // Me logueo y obtengo la respuesta
                const respLogin = await this.loginService.login(this.usuario.value)(this.password.value);

                // Completa el login
                this.loginService.completeLogin(respLogin);
                
                // Redirecciono al dashboard
                this.router.navigate(['/pages/dashboard']);


            }catch(ex) {
                this.utilsService.decodeErrorResponse(ex);
            }
        }
    }

    
}
