import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../services/cliente.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import * as Validaciones from '../../validators/custom-validator';
import { Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  animations: [
    trigger('rotateChange', [
      transition('login => register', [
        style({ transform: 'rotateY(0deg)', opacity: 1 }),
        animate('0.6s ease-in-out', keyframes([
          style({ transform: 'rotateY(-90deg)', opacity: 0 }),
          style({ transform: 'rotateY(0deg)', opacity: 1 }),
        ]))
      ]),
      transition('register => login', [
        style({ transform: 'rotateY(0deg)', opacity: 1 }),
        animate('0.6s ease-in-out', keyframes([
          style({ transform: 'rotateY(90deg)', opacity: 0 }),
          style({ transform: 'rotateY(0deg)', opacity: 1 }),
        ]))
      ])
    ])
  ]
})

export class LoginPageComponent implements OnInit {
  isLogin: boolean = true;
  allUsers: any[] = [];
  userLogin: any = null;
  error: any = null;

  loginForm = new FormGroup({
    user: new FormControl(''),
    pass: new FormControl(''),
  });

  registerForm = new FormGroup({
    dniCLI: new FormControl('', [Validators.required, Validaciones.dniValidator]),
    user: new FormControl('', [Validators.required, Validaciones.usuarioValidator]),
    pass: new FormControl('', [Validators.required, Validaciones.passwdValidator]),
    nombre: new FormControl('', [Validators.required, Validaciones.nombreValidator]),
    apellido: new FormControl('', [Validators.required, Validaciones.apellidosValidator]),
    telefono: new FormControl('', [Validators.required, Validaciones.telefonoValidator]),
    email: new FormControl('', [Validators.required, Validaciones.emailValidator]),
    direccion: new FormControl('', [Validators.required, Validaciones.direccionValidator]),
  });

  constructor(private clientService: ClienteService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.comprobarLogin();
  }

  comprobarLogin(): void {
    if (sessionStorage.getItem("token")) {
      this.userLogin = sessionStorage.getItem("token");
      this.router.navigate(['/menu']);
    } else {
      console.warn('Logueate o regístrate para acceder a la aplicación.');
    }
  }

  getUsers(): void {
    this.clientService.getAllClientes().subscribe({
      next: (data) => {
        this.allUsers = data;
      },
      error: (error) => {
        error =  error.message;
        console.error('Error al obtener los usuarios:', error.message || error);
      }
    });
  }

  register(): void {
    const { dniCLI, user, pass, nombre, apellido, telefono, email, direccion } = this.registerForm.value;

    if (!dniCLI || !user || !pass || !nombre || !apellido || !telefono || !email || !direccion) {
      console.error("Datos obligatorios no ingresados");
      return;
    }

    console.log('Datos a guardar:', this.registerForm.value);

    this.clientService.addCliente({
      "dni_cliente": dniCLI,
      "usuario": user,
      "passwd": pass,
      "nombre": nombre,
      "apellidos": apellido,
      "telefono": telefono,
      "email": email,
      "direccion": direccion
    }).subscribe({
      next: (data) => {
        console.log('Datos guardados:', data);
      },
      error: (error) => {
        console.error('Error al guardar los datos:', error.message || error);
      }
    });

    this.clientService.addCliente({
      "usuario": "josema",
      "passwd": "josema",
      "nombre": "Jose maria",
      "apellidos": "Codes",
      "telefono": "653458947",
      "email": "hola@gmail.ru",
      "direccion": "calle repipi"
    }).subscribe({
      next: (data) => {
        console.log('Datos guardados:', data);
      },
      error: (error) => {
        console.error('Error al guardar los datos:', error.message || error);
      }
    });

  }

  login(): void {
    const { user, pass } = this.loginForm.value;

    if (!user || !pass) {
      console.error("Usuario y contraseña son obligatorios");
      return;
    }

    this.clientService.login(user, pass).subscribe({
      next: (data) => {
        if (data) {
          this.userLogin = data;
          sessionStorage.setItem("token", this.userLogin.token);
          console.log('Inicio de sesión exitoso:', this.userLogin);
          this.router.navigate(['/menu']);
        } else {
          console.warn('Usuario no encontrado.', data);
        }
      },
      error: (error) => {
        console.error(`Error al iniciar sesión para ${user}:`, error.message || error);
      }
    });
  }
}
