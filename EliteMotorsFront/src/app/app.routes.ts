import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { VehiculosPageComponent } from './pages/vehiculos-page/vehiculos-page.component';
import { MenuVehiculoComponent } from './menu-vehiculo/menu-vehiculo.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginPageComponent },
    { path: 'menu', component: MenuVehiculoComponent },
    { path: 'vehiculos', component: VehiculosPageComponent },
];
