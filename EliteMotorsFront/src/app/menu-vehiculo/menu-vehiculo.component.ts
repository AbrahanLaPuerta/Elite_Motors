import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehiculosService } from '../services/vehiculos.service';
import { Router } from '@angular/router';

interface Vehiculo {
  num_bastidor: string;
  marca: string;
  modelo: string;
  anio: number;
  precio: number;
  color: string;
  tipo: string;
  estado: string;
  Modelo3d: string;
  Kilometraje: number;
  combustible: string;
}

@Component({
  selector: 'app-menu-vehiculos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './menu-vehiculo.component.html',
  styleUrls: ['./menu-vehiculo.component.css']
})
export class MenuVehiculoComponent implements OnInit {
  constructor(private vehiculosService: VehiculosService, private router: Router) {}

  vistaGrid = true
  mostrarFiltrosMobile = false
  busqueda = ""
  filtroMarca = ""
  filtroPrecio = ""
  filtroCombustible = ""
  ordenamiento = "precio-asc"

  // Modal properties
  modalAbierto = false
  vehiculoSeleccionado: Vehiculo | null = null

  vehiculos: Vehiculo[] = []
  vehiculosFiltrados: Vehiculo[] = []
  marcas: string[] = []

  ngOnInit(): void {
    this.vehiculosService.getAllVehiculos().subscribe((data) => {
      console.log("Respuesta del servicio:", data)
      this.vehiculos = data
      this.vehiculosFiltrados = [...this.vehiculos]
      this.marcas = [...new Set(this.vehiculos.map((v) => v.marca))].sort()
    })
  }

  filtrarVehiculos() {
    this.vehiculosFiltrados = this.vehiculos.filter((vehiculo) => {
      const coincideBusqueda =
        vehiculo.marca.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        vehiculo.modelo.toLowerCase().includes(this.busqueda.toLowerCase())

      const coincideMarca = !this.filtroMarca || vehiculo.marca === this.filtroMarca
      const coincideCombustible = !this.filtroCombustible || vehiculo.combustible === this.filtroCombustible

      let coincidePrecio = true
      if (this.filtroPrecio) {
        switch (this.filtroPrecio) {
          case "0-25000":
            coincidePrecio = vehiculo.precio <= 25000
            break
          case "25000-40000":
            coincidePrecio = vehiculo.precio > 25000 && vehiculo.precio <= 40000
            break
          case "40000-60000":
            coincidePrecio = vehiculo.precio > 40000 && vehiculo.precio <= 60000
            break
          case "60000+":
            coincidePrecio = vehiculo.precio > 60000
            break
        }
      }

      return coincideBusqueda && coincideMarca && coincidePrecio && coincideCombustible
    })

    this.ordenarVehiculos()
  }

  ordenarVehiculos() {
    switch (this.ordenamiento) {
      case "precio-asc":
        this.vehiculosFiltrados.sort((a, b) => a.precio - b.precio)
        break
      case "precio-desc":
        this.vehiculosFiltrados.sort((a, b) => b.precio - a.precio)
        break
      case "anio-desc":
        this.vehiculosFiltrados.sort((a, b) => b.anio - a.anio)
        break
      case "km-asc":
        this.vehiculosFiltrados.sort((a, b) => a.Kilometraje - b.Kilometraje)
        break
    }
  }

  limpiarFiltros() {
    this.busqueda = ""
    this.filtroMarca = ""
    this.filtroPrecio = ""
    this.filtroCombustible = ""
    this.ordenamiento = "precio-asc"
    this.filtrarVehiculos()
  }

  toggleFiltrosMobile() {
    this.mostrarFiltrosMobile = !this.mostrarFiltrosMobile
  }

  verDetalles(vehiculo: Vehiculo) {
    this.vehiculoSeleccionado = vehiculo
    this.modalAbierto = true
    document.body.style.overflow = "hidden" // Prevenir scroll del body
  }

  cerrarModal() {
    this.modalAbierto = false
    this.vehiculoSeleccionado = null
    document.body.style.overflow = "auto" // Restaurar scroll del body
  }

  configurar(vehiculo: Vehiculo) {
    this.vehiculosService.selectedVehiculo = vehiculo
    console.log("Vehículo seleccionado para configuración:", vehiculo)
    this.router.navigate(['/vehiculos']);
  }

  toggleFavorito(vehiculo: Vehiculo) {
    console.log("Toggle favorito:", vehiculo)
    // Aquí puedes implementar la funcionalidad de favoritos
  }

  // Método para obtener el tipo de combustible con icono
  getCombustibleIcon(combustible: string): string {
    switch (combustible?.toLowerCase()) {
      case "gasolina":
        return "fas fa-gas-pump"
      case "diesel":
        return "fas fa-oil-can"
      case "eléctrico":
        return "fas fa-bolt"
      case "híbrido":
        return "fas fa-leaf"
      default:
        return "fas fa-gas-pump"
    }
  }

  // Método para obtener el color del badge según el estado
  getEstadoBadgeClass(estado: string): string {
    switch (estado?.toLowerCase()) {
      case "nuevo":
        return "status-badge-nuevo"
      case "seminuevo":
        return "status-badge-seminuevo"
      case "usado":
        return "status-badge-usado"
      default:
        return "status-badge"
    }
  }
}