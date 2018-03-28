import {Component} from '@angular/core';
import {FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {

  public form:FormGroup;
  public usuario:AbstractControl;
 // public email:AbstractControl;
  public password:AbstractControl;
  public submitted:boolean = false;

  constructor(fb:FormBuilder) {
    this.form = fb.group({
      'usuario': ['', Validators.compose([Validators.required, Validators.minLength(4)])],    
   //   'email': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
    });
     this.usuario = this.form.controls['usuario'];
    //this.email = this.form.controls['email'];
    this.password = this.form.controls['password'];
  }

  public onSubmit(values:Object):void {
    this.submitted = true;
    if (this.form.valid) {
      // impolementar rutina de validacion de credeciales
        if ((this.usuario.value == "kernel") && (this.password.value == "kernel")){
        /* 
        
        
        
        antes de hacer el redirect implemento certificado de seguiridad grabo datos de sesion y creo token de acceso
        
        
        
        */
         // voy al escritorio de la app     
         window.open("#/pages/principal", "_self");   
        }else{
            alert("Error de Autentificación ::: Las credenciales suministradas son inválidas")
        };
        
      //    console.log(values);
    }
  }
}
