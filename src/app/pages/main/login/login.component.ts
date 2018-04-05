import { Component } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../../../services/loginservice';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';


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
        private router: Router
        
    ) {
        this.form = fb.group({
            'usuario': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
            'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
        });
        this.usuario = this.form.controls['usuario'];
        this.password = this.form.controls['password'];
    }

    public onSubmit(values: Object): void {
        this.submitted = true;
        if (this.form.valid) {
            if ((this.usuario.value == "kernel") && (this.password.value == "kernel")) {
                this.router.navigate(['/pages/dashboard']);
            } else {
                this.loginService.showModalError();
            };
        }
    }

    
}
