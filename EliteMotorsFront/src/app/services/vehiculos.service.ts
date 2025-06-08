import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable, map } from 'rxjs';
import { cliente } from '../model/cliente';

@Injectable({
  providedIn: 'root'
})
export class VehiculosService {

  allVehiculos: any[] = [];

  selectedVehiculo: any = null;

  constructor(private http: HttpClient) {
    this.cargarVehiculos(); // Se carga automáticamente
  }

  private cargarVehiculos(): void {
    this.http.get<any[]>(environment.api.vehiculos).subscribe({
      next: (data) => {
        this.allVehiculos = data;
        console.log('Vehículos cargados:', this.allVehiculos);
      },
      error: (error) => {
        console.error('Error al cargar vehículos', error);
      }
    });
  }

  /**
   * También puedes seguir usando el observable si lo necesitas
   */
  getAllVehiculos(): Observable<any[]> {
    return this.http.get<any[]>(environment.api.vehiculos);
  }
}
