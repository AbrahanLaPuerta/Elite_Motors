import { Component, AfterViewInit } from '@angular/core';
import { SceneService } from '../../services/scene.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VehiculosService } from '../../services/vehiculos.service';

@Component({
  selector: 'app-vehiculos-page',
  templateUrl: './vehiculos-page.component.html',
  imports: [CommonModule],
  styleUrls: ['./vehiculos-page.component.css']
})
export class VehiculosPageComponent implements AfterViewInit {
  constructor(private sceneService: SceneService, private router: Router,
    private vehiculosService: VehiculosService) { }

  SelectedCar: string = "";

  coloresDisponibles: string[] = [
    '#ff0000', // rojo
    '#00ff00', // verde
    '#0000ff', // azul
    '#ffff00', // amarillo
    '#ffffff', // blanco
    '#000000', // negro
    '#ff00ff', // fucsia
    '#00ffff'  // cian
  ];

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

  onVehicleChange(rueda: string): void {
    // const selectElement = event.target as HTMLSelectElement;
    // const selectedVehicle = selectElement.value;

    // console.log("Elemento seleccionado:", selectElement);

    const container = document.getElementById('renderer-container');
    if (container) {
      console.log('Cambiando vehículo:', this.SelectedCar);  // Verifica el cambio de vehículo
      // Limpiar la escena antes de cargar el nuevo vehículo
      this.sceneService.clearScene();
      this.sceneService.loadCar(this.SelectedCar, 0, rueda); // Asegúrate de que el nombre corresponde al recurso
      this.sceneService.loadRoad('road__avenue__street', 1);  // Asegúrate de que la carretera se está cargando bien
      this.sceneService.setSpeed(0, 0); // Reiniciar la velocidad si es necesario
    }
  }

  Volver(){
      this.sceneService.clearScene();
      this.router.navigate(['/menu']);
  }

  cambiarColorHex(hex: string): void {
    const color = parseInt(hex.replace('#', ''), 16);
    this.sceneService.changeCarColor(color);
  }

  cambiarColorVehiculo(event: Event): void {
    const input = event.target as HTMLInputElement;
    const hex = input.value;
    const color = parseInt(hex.replace('#', ''), 16);
    this.sceneService.changeCarColor(color);
  }


}
