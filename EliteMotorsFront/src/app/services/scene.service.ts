import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { VehiculosService } from './vehiculos.service';


@Injectable({
  providedIn: 'root'
})
export class SceneService {
  private scene: THREE.Scene | any;
  private camera: THREE.PerspectiveCamera | any;
  private renderer: THREE.WebGLRenderer | any;
  private controls: OrbitControls | any;

  private centrado: number = 0;

  private carModel: THREE.Group | any;
  private wheels: { [key: string]: THREE.Object3D } = {};
  private roads: THREE.Group[] = [];

  private moveSpeed = 0.05;
  private rotationSpeed = 0.1;
  private roadLength = 15;

  private clock = new THREE.Clock();

  constructor(private vehiculosService: VehiculosService) {}

  initScene(container: HTMLElement, fondo: string): void {
    this.scene = new THREE.Scene();

    const rgbeLoader = new RGBELoader();
    rgbeLoader.load('assets/hdr/noche_bonita.hdr', (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;

      this.scene.environment = texture; // Reflejos realistas
      this.scene.background = texture;  // Fondo con la HDRI (puedes quitarlo si quieres dejar fondo jpg)
    });


    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 1.5, 5);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Sombras suaves
    container.appendChild(this.renderer.domElement);

    const loaderFondo = new THREE.TextureLoader();
    loaderFondo.load('assets/images/' + fondo + '.jpg', (texture) => {
      this.scene.background = texture;
    });

    // Luz ambiental más suave
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
    hemiLight.position.set(0, 20, 0);
    this.scene.add(hemiLight);

    // Luz direccional mejor colocada y con sombras
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    this.scene.add(directionalLight);

    // Orbit Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 1, 0);
    this.controls.update();

    this.animate();

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  clearScene(): void {
    // Limpia la escena actual antes de cargar un nuevo vehículo
    // Esto podría incluir eliminar vehículos, caminos, etc.
    this.scene.remove(this.carModel); // O cualquier método que use tu servicio para limpiar la escena.
  }

  private getYSize(object: THREE.Object3D): number {
    const box = new THREE.Box3().setFromObject(object);
    return box.max.y - box.min.y;
  }

  private loadWheelModel(modelName: string): Promise<THREE.Object3D> {
    const loader = new GLTFLoader();
    return new Promise((resolve) => {
      loader.load('assets/models/ruedas/' + modelName + '.glb', (gltf) => {
        const wheel = gltf.scene;
        wheel.scale.set(1, 1, 1);
        resolve(wheel);
      });
    });
  }

  async loadCar(modelName: string, roadNumber: number, rings: string = "", color: number = 0x555555): Promise<void> {
    const loader = new GLTFLoader();
    loader.load('assets/models/coches/' + modelName + ".glb", async (gltf) => {
      if (this.carModel) {
        this.scene.remove(this.carModel);
      }
      

      this.carModel = gltf.scene;

      // Calcular el tamaño del coche para escalarlo
      const bbox = new THREE.Box3().setFromObject(this.carModel);
      const size = new THREE.Vector3();
      bbox.getSize(size);

      const desiredWidth = 2.4;
      const desiredLength = 5;
      const desiredHeight = 2.2;

      const scaleX = desiredWidth / size.x;
      const scaleY = desiredHeight / size.y;
      const scaleZ = desiredLength / size.z;

      const uniformScale = Math.min(scaleX, scaleY, scaleZ);
      this.carModel.scale.setScalar(uniformScale);
      this.carModel.position.set(0, 0, (roadNumber / 3) * this.roadLength);

      // 🔆 Activar sombras y mejorar materiales
      this.carModel.traverse((child: THREE.Object3D) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;

          // Forzar a usar MeshStandardMaterial si no lo es
          const oldMat = mesh.material as THREE.Material;
          if (!(oldMat instanceof THREE.MeshStandardMaterial)) {
            mesh.material = new THREE.MeshStandardMaterial({
              color: (oldMat as any).color || 0x555555,
              roughness: 0.5,
              metalness: 0.3
            });
          }

        }
      });

      // 💡 Luz interior
      const interiorLight = new THREE.PointLight(0xffffff, 1, 5);
      interiorLight.position.set(0, 1.2, 0); // en el habitáculo
      interiorLight.castShadow = true;
      this.carModel.add(interiorLight);

      this.scene.add(this.carModel);

      const ruedas = ['WheelFtL', 'WheelFtR', 'WheelBkL', 'WheelBkR'];
      const posiciones: THREE.Vector3[] = [];

      if (rings != "") {
        const ruedaOriginal = this.carModel.getObjectByName('WheelFtL') as THREE.Object3D;
        const posOriginal = ruedaOriginal.getWorldPosition(new THREE.Vector3());
        this.carModel.worldToLocal(posOriginal);
        const originalHeight = this.getYSize(ruedaOriginal);

        ruedas.forEach((nombre) => {
          const rueda = this.carModel.getObjectByName(nombre);
          if (rueda) {
            const localPos = rueda.getWorldPosition(new THREE.Vector3());
            this.carModel.worldToLocal(localPos);
            posiciones.push(localPos);
            rueda.parent?.remove(rueda);
          }
        });

        const modeloRueda = await this.loadWheelModel(rings);
        const nuevaAltura = this.getYSize(modeloRueda);
        const escala = originalHeight / nuevaAltura;
        modeloRueda.scale.setScalar(escala);

        this.wheels = {};
        posiciones.forEach((pos, i) => {
          const ruedaClon = modeloRueda.clone(true);
          ruedaClon.position.copy(pos);
          ruedaClon.rotation.y = (i === 0 || i === 2) ? -(Math.PI / 2) : Math.PI / 2;
          ruedaClon.name = ['FL', 'FR', 'RL', 'RR'][i];

          ruedaClon.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });

          this.carModel.add(ruedaClon);
          this.wheels[ruedaClon.name] = ruedaClon;
        });
      } else {
        // Ruedas originales
        this.wheels = {};
        ruedas.forEach((nombre, i) => {
          const rueda = this.carModel.getObjectByName(nombre);
          if (rueda) {
            this.wheels[['FL', 'FR', 'RL', 'RR'][i]] = rueda;
          }
        });
      }
    });
  }

  changeCarColor(color: number): void {
  if (!this.carModel) return;


  const carroceriaNames = ['carroceria'];

  this.carModel.traverse((child: THREE.Object3D) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      const nombre = mesh.name.toLowerCase();

      const esCarroceria = carroceriaNames.some(n =>
        nombre.includes(n.toLowerCase())
      );

      if (esCarroceria && mesh.material instanceof THREE.MeshStandardMaterial) {
        mesh.material.color.set(color);
      }
    }
  });
}


  loadRoad(roadname: string, numRoads: number): void {
    const loader = new GLTFLoader();
    loader.load('assets/models/carreteras/' + roadname + '.glb', (gltf) => {
      // Limpiar anteriores
      this.roads.forEach(road => this.scene.remove(road));
      this.roads = [];

      for (let i = 0; i < numRoads; i++) {
        const road = gltf.scene.clone();
        road.scale.set(0.01, 0.01, 0.01);

        // Calculamos la posición Z para que cada carretera esté separada
        road.position.set(1.5, -0.01, -(this.roadLength * i));

        // Agregamos la carretera a la escena
        this.scene.add(road);
        this.roads.push(road);
      }
    });
  }

  setSpeed(moveSpeed: number, rotationSpeed: number): void {
    this.moveSpeed = moveSpeed;
    this.rotationSpeed = rotationSpeed;
  }

  private animate = (): void => {
    requestAnimationFrame(this.animate);

    // Mover carreteras
    if (this.roads.length > 2) {
      this.roads.forEach((road) => {
        road.position.z -= this.moveSpeed;
      });

      for (let i = 0; i < this.roads.length; i++) {
        const road = this.roads[i];
        if (road.position.z <= -this.roadLength) {
          const prevRoad = this.roads[(i - 1 + this.roads.length) % this.roads.length];
          road.position.z = prevRoad.position.z + this.roadLength;
        }
      }
    }

    // Rotar ruedas
    Object.values(this.wheels).forEach(wheel => {
      if (wheel) wheel.rotation.x += this.rotationSpeed;
    });

    if (this.carModel && this.centrado < 100) {
      console.log("centrado");
      const carPosition = new THREE.Vector3();
      this.carModel.getWorldPosition(carPosition);

      // Mueve la cámara en cada frame para que siga al coche
      const cameraOffset = new THREE.Vector3(5, 2, 0); // altura y distancia hacia atrás
      const cameraPosition = carPosition.clone().add(cameraOffset);

      this.camera.position.lerp(cameraPosition, 0.1); // suaviza el movimiento de la cámara

      this.controls.target.copy(carPosition);
      this.controls.update();

      this.centrado += 1;
    }


    this.renderer.render(this.scene, this.camera);
  };


}
