import { Component, AfterViewInit } from '@angular/core';
import { SceneService } from '../../services/scene.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VehiculosService } from '../../services/vehiculos.service';

@Component({
  selector: 'app-vehiculos-page',
  templateUrl: './vehiculos-page.component.html',
  imports:[CommonModule],
  styleUrls: ['./vehiculos-page.component.css']
})
export class VehiculosPageComponent implements AfterViewInit {
  constructor(private sceneService: SceneService, private router: Router, 
  private vehiculosService: VehiculosService) {}

  SelectedCar: string = "";
  
  ngOnInit(): void {
    if (!this.vehiculosService.selectedVehiculo) {
      console.error("No se ha seleccionado un vehículo. Redirigiendo a la página de vehículos.");
      this.router.navigate(['/menu']);
      return;
    }
    this.SelectedCar = ""
    this.SelectedCar = this.vehiculosService.selectedVehiculo.Modelo3d; 
  }

  ngAfterViewInit(): void {
    const container = document.getElementById('renderer-container');
    if (container) {
      this.sceneService.initScene(container, "cielo");
      this.sceneService.loadCar(this.SelectedCar, 0, ""); // Asegúrate de que el nombre corresponde al recurso
      this.sceneService.loadRoad('road__avenue__street', 1);
      this.sceneService.setSpeed(0, 0);
    }
  }

  // onVehicleChange(event: Event): void {
  //   const selectElement = event.target as HTMLSelectElement;
  //   const selectedVehicle = selectElement.value;

  //   const container = document.getElementById('renderer-container');
  //   if (container) {
  //     console.log('Cambiando vehículo:', selectedVehicle);  // Verifica el cambio de vehículo
  //     // Limpiar la escena antes de cargar el nuevo vehículo
  //     this.sceneService.clearScene();
  //     this.sceneService.loadCar(selectedVehicle, 10, "lamborghini_wheel"); // Asegúrate de que el nombre corresponde al recurso
  //     this.sceneService.loadRoad('road__avenue__street', 10);  // Asegúrate de que la carretera se está cargando bien
  //     this.sceneService.setSpeed(0.4, 0.2); // Reiniciar la velocidad si es necesario
  //   }
  // }

  vehiculos(){
    console.log("Vehiculos", this.SelectedCar);
  }

  cambiarRuedas(){
    console.log("Cambiando ruedas del vehículo:", this.SelectedCar);
  }
}
